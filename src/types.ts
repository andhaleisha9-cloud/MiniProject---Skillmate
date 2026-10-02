export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | 'Final Year';

export interface PastProject {
  id: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  link?: string;
}

export interface StudentContact {
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  discord?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  year: AcademicYear;
  avatarUrl?: string;
  bio: string;
  skills: string[];
  interests: string[];
  projects: PastProject[];
  contact: StudentContact;
  lookingForPartner: boolean;
  preferredProjectTypes?: string[];
  joinedDate: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ProjectRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderDepartment: string;
  senderYear: AcademicYear;
  senderSkills: string[];
  recipientId: string;
  recipientName: string;
  projectTitle: string;
  roleNeeded: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export type ProjectPartnerStatus = 'Planning' | 'In Progress' | 'Completed';

export interface ProjectPartner {
  id: string;
  requestId: string;
  studentId1: string;
  studentId2: string;
  partnerStudent: Student;
  projectTitle: string;
  roleDescription: string;
  status: ProjectPartnerStatus;
  formedDate: string;
  notes?: string;
}

export interface ProjectPost {
  id: string;
  authorId: string;
  authorName: string;
  authorDepartment: string;
  authorYear: AcademicYear;
  title: string;
  category: string;
  description: string;
  rolesNeeded: string[];
  skillsRequired: string[];
  teamSize: number;
  currentTeamCount: number;
  createdAt: string;
  status: 'open' | 'closed';
  interestedStudentIds: string[];
}

export type ActiveTab =
  | 'dashboard'
  | 'project-board'
  | 'find-students'
  | 'my-profile'
  | 'requests'
  | 'partners';

