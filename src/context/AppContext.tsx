import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ProjectRequest,
  ProjectPartner,
  ProjectPost,
  ActiveTab,
  AcademicYear,
  ProjectPartnerStatus
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_REQUESTS,
  INITIAL_PARTNERS,
  INITIAL_PROJECT_POSTS
} from '../data/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentStudent: Student | null;
  allStudents: Student[];
  requests: ProjectRequest[];
  partners: ProjectPartner[];
  projectPosts: ProjectPost[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedStudentForModal: Student | null;
  setSelectedStudentForModal: (student: Student | null) => void;
  requestModalRecipient: Student | null;
  setRequestModalRecipient: (student: Student | null) => void;
  
  // Auth
  login: (identifier: string, password?: string) => boolean;
  register: (data: {
    name: string;
    email: string;
    department: string;
    year: AcademicYear;
    college: string;
    bio?: string;
    skills?: string[];
  }) => boolean;
  logout: () => void;
  switchStudent: (studentId: string) => void;

  // Project Posts / Calls for SkillMates
  createProjectPost: (data: {
    title: string;
    category: string;
    description: string;
    rolesNeeded: string[];
    skillsRequired: string[];
    teamSize: number;
  }) => void;
  deleteProjectPost: (postId: string) => void;
  toggleProjectPostStatus: (postId: string) => void;
  applyToProjectPost: (postId: string, roleSelected: string, pitchMessage: string) => boolean;

  // Actions
  sendRequest: (data: {
    recipientId: string;
    projectTitle: string;
    roleNeeded: string;
    message: string;
  }) => boolean;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  updateProfile: (updated: Partial<Student>) => void;
  updatePartnerProject: (partnerId: string, status: ProjectPartnerStatus, notes?: string) => void;
  
  // Helpers
  getReceivedRequests: () => ProjectRequest[];
  getSentRequests: () => ProjectRequest[];
  getMyPartners: () => ProjectPartner[];
  hasPendingRequestWith: (studentId: string) => 'none' | 'sent' | 'received' | 'partner';
  
  // Toast notifications
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'skillmate_students_v1',
  CURRENT_USER_ID: 'skillmate_current_user_v1',
  REQUESTS: 'skillmate_requests_v1',
  PARTNERS: 'skillmate_partners_v1',
  PROJECT_POSTS: 'skillmate_project_posts_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      // Require explicit login so user starts at the SkillMate login page
      return saved || null;
    } catch {
      return null;
    }
  });

  const [requests, setRequests] = useState<ProjectRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [partners, setPartners] = useState<ProjectPartner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
    } catch {
      return INITIAL_PARTNERS;
    }
  });

  const [projectPosts, setProjectPosts] = useState<ProjectPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECT_POSTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT_POSTS;
    } catch {
      return INITIAL_PROJECT_POSTS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [requestModalRecipient, setRequestModalRecipient] = useState<Student | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(allStudents));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [allStudents]);

  useEffect(() => {
    try {
      if (currentStudentId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentStudentId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [currentStudentId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [partners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECT_POSTS, JSON.stringify(projectPosts));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [projectPosts]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const dismissToast = () => setToast(null);

  const currentStudent = allStudents.find((s) => s.id === currentStudentId) || null;

  const login = (identifier: string, password?: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password?.trim().toLowerCase();

    // Support "student" / "student123" (or "student 123") mapping to Arjun Mehta
    if (
      cleanId === 'student' ||
      cleanId === 'student1' ||
      cleanId === 'arjun' ||
      cleanId === 'arjun.mehta@kamaladevi.edu'
    ) {
      if (cleanPass && cleanPass !== 'student123' && cleanPass !== 'student 123' && cleanPass !== 'password123' && cleanPass !== 'student') {
        showToast('Incorrect password for student account. Hint: student123', 'error');
        return false;
      }
      const arjun = allStudents.find((s) => s.id === 'student-1') || allStudents[0];
      if (arjun) {
        setCurrentStudentId(arjun.id);
        showToast(`Welcome to SkillMate, ${arjun.name}!`, 'success');
        return true;
      }
    }

    const found = allStudents.find(
      (s) =>
        s.email.trim().toLowerCase() === cleanId ||
        s.id.toLowerCase() === cleanId ||
        s.name.trim().toLowerCase() === cleanId
    );

    if (found) {
      setCurrentStudentId(found.id);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }

    showToast('No account found. Use ID: student and Pass: student123', 'error');
    return false;
  };

  const register = (data: {
    name: string;
    email: string;
    department: string;
    year: AcademicYear;
    college: string;
    bio?: string;
    skills?: string[];
  }): boolean => {
    const existing = allStudents.find(
      (s) => s.email.trim().toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existing) {
      showToast('An account with this email already exists. Please log in.', 'error');
      return false;
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      college: data.college.trim() || 'Kamaladevi College',
      department: data.department,
      year: data.year,
      bio: data.bio?.trim() || 'Student at Kamaladevi College looking to collaborate on hands-on software projects.',
      skills: data.skills && data.skills.length > 0 ? data.skills : ['Python', 'Problem Solving', 'Git'],
      interests: ['Web Development', 'Software Engineering'],
      lookingForPartner: true,
      preferredProjectTypes: ['Course Mini Project', 'Hackathon'],
      joinedDate: new Date().toISOString().split('T')[0],
      contact: {
        email: data.email.trim()
      },
      projects: []
    };

    setAllStudents((prev) => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);
    showToast(`Account created successfully! Welcome, ${newStudent.name}.`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentStudentId(null);
    showToast('You have been logged out.', 'info');
  };

  const switchStudent = (studentId: string) => {
    const target = allStudents.find((s) => s.id === studentId);
    if (target) {
      setCurrentStudentId(target.id);
      showToast(`Switched view to ${target.name} (${target.department})`, 'info');
    }
  };

  const sendRequest = (data: {
    recipientId: string;
    projectTitle: string;
    roleNeeded: string;
    message: string;
  }): boolean => {
    if (!currentStudent) {
      showToast('Please log in to send a request.', 'error');
      return false;
    }

    if (currentStudent.id === data.recipientId) {
      showToast('You cannot send a partnership request to yourself.', 'error');
      return false;
    }

    // Check if duplicate pending
    const existing = requests.find(
      (r) =>
        r.senderId === currentStudent.id &&
        r.recipientId === data.recipientId &&
        r.status === 'pending'
    );
    if (existing) {
      showToast('A pending request has already been sent to this student.', 'info');
      return false;
    }

    const recipient = allStudents.find((s) => s.id === data.recipientId);

    const newReq: ProjectRequest = {
      id: `req-${Date.now()}`,
      senderId: currentStudent.id,
      senderName: currentStudent.name,
      senderDepartment: currentStudent.department,
      senderYear: currentStudent.year,
      senderSkills: currentStudent.skills.slice(0, 4),
      recipientId: data.recipientId,
      recipientName: recipient?.name || 'Fellow Student',
      projectTitle: data.projectTitle.trim(),
      roleNeeded: data.roleNeeded.trim(),
      message: data.message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast(`Project partnership request sent to ${recipient?.name}!`, 'success');
    return true;
  };

  const acceptRequest = (requestId: string) => {
    if (!currentStudent) return;
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // Update request status
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' as const } : r))
    );

    // Identify partner student
    const partnerId = req.senderId === currentStudent.id ? req.recipientId : req.senderId;
    const partnerStudent = allStudents.find((s) => s.id === partnerId);

    if (partnerStudent) {
      // Check if already partners
      const alreadyPartner = partners.some(
        (p) =>
          (p.studentId1 === currentStudent.id && p.studentId2 === partnerId) ||
          (p.studentId1 === partnerId && p.studentId2 === currentStudent.id)
      );

      if (!alreadyPartner) {
        const newPartner: ProjectPartner = {
          id: `partner-${Date.now()}`,
          requestId: req.id,
          studentId1: currentStudent.id,
          studentId2: partnerId,
          partnerStudent: partnerStudent,
          projectTitle: req.projectTitle,
          roleDescription: req.roleNeeded,
          status: 'In Progress',
          formedDate: new Date().toISOString().split('T')[0],
          notes: `Project team initiated on ${new Date().toLocaleDateString()}. Initial proposal: "${req.message.slice(0, 100)}..."`
        };

        setPartners((prev) => [newPartner, ...prev]);
        showToast(`Request accepted! ${partnerStudent.name} is now your project partner.`, 'success');
      }
    }
  };

  const rejectRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
    );
    showToast('Partnership request declined.', 'info');
  };

  const updateProfile = (updated: Partial<Student>) => {
    if (!currentStudent) return;
    const updatedStudent = { ...currentStudent, ...updated };
    setAllStudents((prev) => prev.map((s) => (s.id === currentStudent.id ? updatedStudent : s)));
    showToast('Your student profile has been updated.', 'success');
  };

  const updatePartnerProject = (
    partnerId: string,
    status: ProjectPartnerStatus,
    notes?: string
  ) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status, notes: notes ?? p.notes } : p))
    );
    showToast('Project status and notes updated.', 'success');
  };

  const getReceivedRequests = (): ProjectRequest[] => {
    if (!currentStudent) return [];
    return requests.filter((r) => r.recipientId === currentStudent.id);
  };

  const getSentRequests = (): ProjectRequest[] => {
    if (!currentStudent) return [];
    return requests.filter((r) => r.senderId === currentStudent.id);
  };

  const getMyPartners = (): ProjectPartner[] => {
    if (!currentStudent) return [];
    return partners
      .filter((p) => p.studentId1 === currentStudent.id || p.studentId2 === currentStudent.id)
      .map((p) => {
        // Resolve real up-to-date student info for the partner
        const otherId = p.studentId1 === currentStudent.id ? p.studentId2 : p.studentId1;
        const currentData = allStudents.find((s) => s.id === otherId) || p.partnerStudent;
        return {
          ...p,
          partnerStudent: currentData
        };
      });
  };

  const createProjectPost = (data: {
    title: string;
    category: string;
    description: string;
    rolesNeeded: string[];
    skillsRequired: string[];
    teamSize: number;
  }) => {
    if (!currentStudent) {
      showToast('Please log in to upload a project listing.', 'error');
      return;
    }

    const newPost: ProjectPost = {
      id: `post-${Date.now()}`,
      authorId: currentStudent.id,
      authorName: currentStudent.name,
      authorDepartment: currentStudent.department,
      authorYear: currentStudent.year,
      title: data.title.trim(),
      category: data.category.trim() || 'Capstone Mini Project',
      description: data.description.trim(),
      rolesNeeded: data.rolesNeeded.filter(Boolean),
      skillsRequired: data.skillsRequired.filter(Boolean),
      teamSize: data.teamSize || 2,
      currentTeamCount: 1,
      createdAt: new Date().toISOString(),
      status: 'open',
      interestedStudentIds: []
    };

    setProjectPosts((prev) => [newPost, ...prev]);
    showToast(`Project request "${newPost.title}" posted to Campus Board!`, 'success');
  };

  const deleteProjectPost = (postId: string) => {
    setProjectPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Project listing deleted.', 'info');
  };

  const toggleProjectPostStatus = (postId: string) => {
    setProjectPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, status: p.status === 'open' ? 'closed' : 'open' } : p
      )
    );
    showToast('Project listing status updated.', 'info');
  };

  const applyToProjectPost = (
    postId: string,
    roleSelected: string,
    pitchMessage: string
  ): boolean => {
    if (!currentStudent) {
      showToast('Please log in to apply.', 'error');
      return false;
    }

    const post = projectPosts.find((p) => p.id === postId);
    if (!post) return false;

    if (post.authorId === currentStudent.id) {
      showToast('You cannot apply to your own project listing.', 'error');
      return false;
    }

    if (post.interestedStudentIds.includes(currentStudent.id)) {
      showToast('You have already applied to this project listing.', 'info');
      return false;
    }

    // Add student to interested list
    setProjectPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              interestedStudentIds: [...p.interestedStudentIds, currentStudent.id]
            }
          : p
      )
    );

    // Also automatically create a direct ProjectRequest so it shows up in the author's Requests tab!
    const newReq: ProjectRequest = {
      id: `req-${Date.now()}`,
      senderId: currentStudent.id,
      senderName: currentStudent.name,
      senderDepartment: currentStudent.department,
      senderYear: currentStudent.year,
      senderSkills: currentStudent.skills.slice(0, 4),
      recipientId: post.authorId,
      recipientName: post.authorName,
      projectTitle: post.title,
      roleNeeded: roleSelected || post.rolesNeeded[0] || 'Team Collaborator',
      message:
        pitchMessage.trim() ||
        `Hi ${post.authorName}, I saw your project listing "${post.title}" on the SkillMate Campus Board and would love to join your team as a ${roleSelected || 'collaborator'}.`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast(`Application sent to ${post.authorName}! Proposal added to their Requests inbox.`, 'success');
    return true;
  };

  const hasPendingRequestWith = (
    studentId: string
  ): 'none' | 'sent' | 'received' | 'partner' => {
    if (!currentStudent) return 'none';
    if (currentStudent.id === studentId) return 'none';

    // Check if partner
    const isPartner = partners.some(
      (p) =>
        (p.studentId1 === currentStudent.id && p.studentId2 === studentId) ||
        (p.studentId1 === studentId && p.studentId2 === currentStudent.id)
    );
    if (isPartner) return 'partner';

    // Check sent pending
    const sentPending = requests.find(
      (r) => r.senderId === currentStudent.id && r.recipientId === studentId && r.status === 'pending'
    );
    if (sentPending) return 'sent';

    // Check received pending
    const recvPending = requests.find(
      (r) => r.recipientId === currentStudent.id && r.senderId === studentId && r.status === 'pending'
    );
    if (recvPending) return 'received';

    return 'none';
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.PARTNERS);
    localStorage.removeItem(STORAGE_KEYS.PROJECT_POSTS);
    setAllStudents(INITIAL_STUDENTS);
    setCurrentStudentId('student-1');
    setRequests(INITIAL_REQUESTS);
    setPartners(INITIAL_PARTNERS);
    setProjectPosts(INITIAL_PROJECT_POSTS);
    showToast('Platform data reset to default demo records.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentStudent,
        allStudents,
        requests,
        partners,
        projectPosts,
        activeTab,
        setActiveTab,
        selectedStudentForModal,
        setSelectedStudentForModal,
        requestModalRecipient,
        setRequestModalRecipient,
        login,
        register,
        logout,
        switchStudent,
        sendRequest,
        acceptRequest,
        rejectRequest,
        updateProfile,
        updatePartnerProject,
        createProjectPost,
        deleteProjectPost,
        toggleProjectPostStatus,
        applyToProjectPost,
        getReceivedRequests,
        getSentRequests,
        getMyPartners,
        hasPendingRequestWith,
        toast,
        showToast,
        dismissToast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
