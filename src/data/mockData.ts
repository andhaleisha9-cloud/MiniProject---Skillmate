import { Student, ProjectRequest, ProjectPartner, ProjectPost } from '../types';

export const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Information Technology',
  'Data Science & AI',
  'Electronics & Communication',
  'Software Engineering'
];

export const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', 'Final Year'] as const;

export const POPULAR_SKILLS = [
  'React',
  'Python',
  'Node.js',
  'Machine Learning',
  'TypeScript',
  'Flutter',
  'Java',
  'PostgreSQL',
  'Tailwind CSS',
  'Docker',
  'FastAPI',
  'UI/UX Design',
  'Data Analysis',
  'MongoDB',
  'Spring Boot',
  'Embedded C',
  'IoT',
  'Next.js'
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Computer Science',
    year: '3rd Year',
    bio: 'Full-stack developer passionate about building practical web platforms for campus needs. Currently seeking a team partner with machine learning or data science expertise for our 6th-semester capstone mini project.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    interests: ['Web Development', 'Cloud Architecture', 'Distributed Systems', 'Campus Tools'],
    lookingForPartner: true,
    preferredProjectTypes: ['Capstone Mini Project', 'Hackathons', 'Open Source Tools'],
    joinedDate: '2024-08-15',
    contact: {
      email: 'arjun.mehta@kamaladevi.edu',
      phone: '+91 98450 12345',
      github: 'https://github.com/arjunmehta-dev',
      linkedin: 'https://linkedin.com/in/arjun-mehta-cs',
      discord: 'arjun_m#4412'
    },
    projects: [
      {
        id: 'proj-1',
        title: 'Kamaladevi Lost & Found Portal',
        description: 'A responsive web application allowing college students to post, verify, and claim misplaced belongings across campus departments.',
        role: 'Full Stack Lead',
        techStack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
        link: 'https://github.com/arjunmehta-dev/campus-lost-found'
      },
      {
        id: 'proj-2',
        title: 'Lab Slot Reservation Engine',
        description: 'Micro-scheduler for CS department laboratory hardware slots and GPU compute sessions.',
        role: 'Backend Developer',
        techStack: ['TypeScript', 'Express', 'Tailwind CSS'],
        link: 'https://github.com/arjunmehta-dev/lab-scheduler'
      }
    ]
  },
  {
    id: 'student-2',
    name: 'Kavya Ramanathan',
    email: 'kavya.ramanathan@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Data Science & AI',
    year: '3rd Year',
    bio: 'Data Science student focusing on natural language processing, predictive modeling, and analytics. Looking for a web developer partner to build interactive UI frontends for ML models.',
    skills: ['Python', 'Machine Learning', 'FastAPI', 'Pandas', 'PyTorch', 'Data Analysis', 'Scikit-Learn'],
    interests: ['Natural Language Processing', 'Healthcare AI', 'Computer Vision', 'Data Visualization'],
    lookingForPartner: true,
    preferredProjectTypes: ['Research Paper Implementation', 'Mini Project', 'Kaggle Competitions'],
    joinedDate: '2024-09-02',
    contact: {
      email: 'kavya.ramanathan@kamaladevi.edu',
      github: 'https://github.com/kavya-ds',
      linkedin: 'https://linkedin.com/in/kavyaramanathan-ai'
    },
    projects: [
      {
        id: 'proj-3',
        title: 'Academic Abstract Summarizer',
        description: 'Fine-tuned transformer model that distills 5-page research papers into structured 3-sentence summaries for literature review.',
        role: 'ML Engineer',
        techStack: ['Python', 'HuggingFace', 'FastAPI', 'PyTorch'],
        link: 'https://github.com/kavya-ds/abstract-summarizer'
      },
      {
        id: 'proj-4',
        title: 'Campus Sentiment Monitor',
        description: 'Analyzed anonymous campus forum submissions to categorize student satisfaction trends regarding course registration and dining.',
        role: 'Data Analyst',
        techStack: ['Python', 'Pandas', 'NLTK', 'Matplotlib']
      }
    ]
  },
  {
    id: 'student-3',
    name: 'Karthik Sundaram',
    email: 'karthik.sundaram@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Computer Science',
    year: 'Final Year',
    bio: 'Mobile application developer with hands-on Flutter and native Android development experience. Currently exploring cross-platform productivity utilities for students and study groups.',
    skills: ['Flutter', 'Dart', 'Android', 'Firebase', 'UI/UX Design', 'Figma', 'Java'],
    interests: ['Mobile App Development', 'Product Design', 'Offline-First Systems'],
    lookingForPartner: true,
    preferredProjectTypes: ['Major Capstone Project', 'Startup MVP'],
    joinedDate: '2023-08-10',
    contact: {
      email: 'karthik.sundaram@kamaladevi.edu',
      github: 'https://github.com/karthiksundaram-mobile',
      discord: 'karthik_s#9011'
    },
    projects: [
      {
        id: 'proj-5',
        title: 'StudyPulse - Peer Focus & Study Groups',
        description: 'Cross-platform mobile app enabling synchronized study sessions with shared audio ambiances and subject goal tracking.',
        role: 'Mobile Lead',
        techStack: ['Flutter', 'Dart', 'Firebase', 'Provider']
      }
    ]
  },
  {
    id: 'student-4',
    name: 'Priya Sharma',
    email: 'priya.sharma@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Information Technology',
    year: '3rd Year',
    bio: 'Frontend enthusiast and UI designer. I love turning complex student processes into clean, accessible web interfaces. Looking for a backend/database specialist for our semester course project.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'UI/UX Design', 'Figma', 'JavaScript', 'HTML5/CSS3'],
    interests: ['UI/UX Design', 'Web Development', 'Design Systems', 'Accessibility'],
    lookingForPartner: true,
    preferredProjectTypes: ['Course Mini Project', 'UI/UX Redesigns'],
    joinedDate: '2024-08-20',
    contact: {
      email: 'priya.sharma@kamaladevi.edu',
      linkedin: 'https://linkedin.com/in/priya-sharma-ux',
      github: 'https://github.com/priyasharma-web'
    },
    projects: [
      {
        id: 'proj-6',
        title: 'Department Course Syllabus Navigator',
        description: 'Redesigned the departmental PDF curriculum into a clean, searchable, filterable interactive course catalogue.',
        role: 'UI Designer & Frontend Dev',
        techStack: ['React', 'Tailwind CSS', 'Figma']
      }
    ]
  },
  {
    id: 'student-5',
    name: 'Rohan Verma',
    email: 'rohan.verma@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Electronics & Communication',
    year: '2nd Year',
    bio: 'Hardware tinkerer focused on IoT sensors, microcontroller firmware, and telemetry dashboards. Looking for a web programmer to build real-time monitoring web interfaces for hardware sensors.',
    skills: ['Embedded C', 'IoT', 'Python', 'Arduino', 'Raspberry Pi', 'MQTT', 'C++'],
    interests: ['Internet of Things', 'Embedded Systems', 'Smart Agriculture', 'Robotics'],
    lookingForPartner: true,
    preferredProjectTypes: ['Hardware Hackathon', 'IoT Mini Project'],
    joinedDate: '2025-01-14',
    contact: {
      email: 'rohan.verma@kamaladevi.edu',
      phone: '+91 98765 43210',
      github: 'https://github.com/rohanverma-iot'
    },
    projects: [
      {
        id: 'proj-7',
        title: 'Automated Greenhouse Climate Controller',
        description: 'ESP32-based soil moisture and ambient temperature controller transmitting sensor payloads over MQTT protocol.',
        role: 'Hardware Firmware Engineer',
        techStack: ['Embedded C', 'ESP32', 'MQTT', 'C++']
      }
    ]
  },
  {
    id: 'student-6',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Computer Science',
    year: '2nd Year',
    bio: 'Backend programmer with strong foundations in Data Structures, Algorithms, and Object-Oriented Design in Java. Seeking frontend collaborators for database-driven enterprise applications.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Data Structures', 'Docker', 'REST APIs'],
    interests: ['Backend Systems', 'Database Optimization', 'Cloud Services'],
    lookingForPartner: true,
    preferredProjectTypes: ['Mini Project', 'Backend Service'],
    joinedDate: '2025-02-01',
    contact: {
      email: 'ananya.iyer@kamaladevi.edu',
      github: 'https://github.com/ananya-iyer-cs'
    },
    projects: [
      {
        id: 'proj-8',
        title: 'High-Throughput Student Grading Ledger',
        description: 'Spring Boot REST service supporting concurrent CSV grade uploads with atomic rollback transactions and audit logs.',
        role: 'Backend Architect',
        techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker']
      }
    ]
  },
  {
    id: 'student-7',
    name: 'Aditya Nair',
    email: 'aditya.nair@kamaladevi.edu',
    college: 'Kamaladevi College',
    department: 'Software Engineering',
    year: 'Final Year',
    bio: 'Software engineer passionate about API security, Linux system administration, and automated test runners. Looking to partner on web tools requiring strong authentication and testing pipelines.',
    skills: ['Python', 'Docker', 'Linux', 'FastAPI', 'Cybersecurity', 'Git', 'Testing'],
    interests: ['DevOps', 'Cybersecurity', 'System Administration'],
    lookingForPartner: true,
    preferredProjectTypes: ['Final Year Capstone', 'Open Source Tool'],
    joinedDate: '2023-09-01',
    contact: {
      email: 'aditya.nair@kamaladevi.edu',
      github: 'https://github.com/adityanair-sec'
    },
    projects: [
      {
        id: 'proj-9',
        title: 'Static Vulnerability Scanner for Student Repos',
        description: 'CLI tool scanning GitHub student submissions for leaked API keys, unprotected secrets, and deprecated package CVEs.',
        role: 'Author & Maintainer',
        techStack: ['Python', 'Docker', 'Git API']
      }
    ]
  }
];

export const INITIAL_REQUESTS: ProjectRequest[] = [
  {
    id: 'req-1',
    senderId: 'student-2',
    senderName: 'Kavya Ramanathan',
    senderDepartment: 'Data Science & AI',
    senderYear: '3rd Year',
    senderSkills: ['Python', 'Machine Learning', 'FastAPI', 'PyTorch'],
    recipientId: 'student-1',
    recipientName: 'Arjun Mehta',
    projectTitle: 'Automated Campus Course Recommendation System',
    roleNeeded: 'Full-Stack Frontend Developer (React + TypeScript)',
    message: 'Hi Arjun! I saw your Lost & Found React project and noticed you are looking for an ML partner for the 6th sem mini project. I have pre-trained a collaborative filtering model in PyTorch and wrote FastAPI endpoints, but I need an experienced frontend partner to build the student interface and dashboard for Kamaladevi College. Would you like to team up?',
    status: 'pending',
    createdAt: '2026-10-01T14:30:00Z'
  },
  {
    id: 'req-2',
    senderId: 'student-5',
    senderName: 'Rohan Verma',
    senderDepartment: 'Electronics & Communication',
    senderYear: '2nd Year',
    senderSkills: ['Embedded C', 'IoT', 'Arduino', 'Python'],
    recipientId: 'student-1',
    recipientName: 'Arjun Mehta',
    projectTitle: 'Smart Campus Waste Management Dashboard',
    roleNeeded: 'Web App & Database Developer',
    message: 'Hey Arjun, our ECE team built ultrasonic bin sensor nodes reporting over MQTT. We need someone who knows PostgreSQL and React to display bin fill levels across the Kamaladevi campus map.',
    status: 'pending',
    createdAt: '2026-09-30T09:15:00Z'
  },
  {
    id: 'req-3',
    senderId: 'student-1',
    senderName: 'Arjun Mehta',
    senderDepartment: 'Computer Science',
    senderYear: '3rd Year',
    senderSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    recipientId: 'student-4',
    recipientName: 'Priya Sharma',
    projectTitle: 'Student Skills & Project Partners Platform',
    roleNeeded: 'Lead UI/UX Designer',
    message: 'Hi Priya! Your Course Syllabus redesign looked super clean. Would you like to partner up on designing the interface components for our Kamaladevi College B.Sc. mini project platform?',
    status: 'accepted',
    createdAt: '2026-09-28T11:00:00Z'
  }
];

export const INITIAL_PARTNERS: ProjectPartner[] = [
  {
    id: 'partner-1',
    requestId: 'req-3',
    studentId1: 'student-1',
    studentId2: 'student-4',
    partnerStudent: INITIAL_STUDENTS[3], // Priya Sharma
    projectTitle: 'Student Skills & Project Partners Platform',
    roleDescription: 'Lead UI/UX Designer & Component Architect',
    status: 'In Progress',
    formedDate: '2026-09-29',
    notes: 'Weekly milestone: Finalizing student discovery cards and request workflow screens before midterm review.'
  }
];

export const INITIAL_PROJECT_POSTS: ProjectPost[] = [
  {
    id: 'post-1',
    authorId: 'student-1',
    authorName: 'Arjun Mehta',
    authorDepartment: 'Computer Science',
    authorYear: '3rd Year',
    title: 'Kamaladevi Smart Campus Lost & Found Web Portal',
    category: 'Capstone Mini Project',
    description: 'Building a real-time responsive web portal allowing students to report, verify, and reclaim misplaced items across campus departments, labs, and library.',
    rolesNeeded: ['UI/UX Frontend Contributor', 'Database & Auth Specialist'],
    skillsRequired: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    teamSize: 3,
    currentTeamCount: 2,
    createdAt: '2026-10-01T10:00:00Z',
    status: 'open',
    interestedStudentIds: ['student-4']
  },
  {
    id: 'post-2',
    authorId: 'student-2',
    authorName: 'Kavya Ramanathan',
    authorDepartment: 'Data Science & AI',
    authorYear: '3rd Year',
    title: 'Automated Academic Abstract Summarization Engine',
    category: 'Research Project',
    description: 'Developing a domain-adapted transformer pipeline to extract multi-sentence summaries and key findings from PDF research papers. Seeking a frontend partner to create a clean student-facing dashboard.',
    rolesNeeded: ['Full-Stack Web Developer (React + FastAPI)'],
    skillsRequired: ['Python', 'FastAPI', 'React', 'PyTorch'],
    teamSize: 2,
    currentTeamCount: 1,
    createdAt: '2026-09-30T16:20:00Z',
    status: 'open',
    interestedStudentIds: []
  },
  {
    id: 'post-3',
    authorId: 'student-5',
    authorName: 'Rohan Verma',
    authorDepartment: 'Electronics & Communication',
    authorYear: '2nd Year',
    title: 'Solar-Powered Smart Agriculture IoT Sensor Grid',
    category: 'Hardware & IoT Mini Project',
    description: 'ESP32 microcontrollers deployed with NPK soil nutrient sensors transmitting telemetry via MQTT protocol. Need a software collaborator to build the telemetry web interface and alerts.',
    rolesNeeded: ['Web Dashboard Developer', 'Backend API Specialist'],
    skillsRequired: ['Python', 'MQTT', 'React', 'FastAPI'],
    teamSize: 3,
    currentTeamCount: 1,
    createdAt: '2026-09-29T12:00:00Z',
    status: 'open',
    interestedStudentIds: []
  },
  {
    id: 'post-4',
    authorId: 'student-3',
    authorName: 'Karthik Sundaram',
    authorDepartment: 'Computer Science',
    authorYear: 'Final Year',
    title: 'Campus Peer Study & Focus Room Mobile App',
    category: 'Final Year Capstone',
    description: 'Cross-platform Flutter application for study buddy pairing, synchronized Pomodoro rooms, and shared study playlists for Kamaladevi college exam prep.',
    rolesNeeded: ['Backend Cloud Architect (Node.js/Firebase)'],
    skillsRequired: ['Flutter', 'Firebase', 'Node.js'],
    teamSize: 2,
    currentTeamCount: 1,
    createdAt: '2026-09-27T08:45:00Z',
    status: 'open',
    interestedStudentIds: []
  }
];

