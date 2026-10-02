import sqlite3
import json
import os

DB_FILE = os.path.join(os.path.dirname(__file__), "skills_partner.db")

# Delete existing DB if present to ensure clean seed
if os.path.exists(DB_FILE):
    os.remove(DB_FILE)

conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# Enable foreign keys
cursor.execute("PRAGMA foreign_keys = ON;")

# 1. Create Tables
cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    looking_for_partner INTEGER NOT NULL DEFAULT 1,
    joined_date TEXT NOT NULL,
    phone TEXT,
    github TEXT,
    linkedin TEXT,
    discord TEXT
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS student_skills (
    student_id TEXT NOT NULL,
    skill TEXT NOT NULL,
    PRIMARY KEY (student_id, skill),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS student_interests (
    student_id TEXT NOT NULL,
    interest TEXT NOT NULL,
    PRIMARY KEY (student_id, interest),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS student_preferred_project_types (
    student_id TEXT NOT NULL,
    project_type TEXT NOT NULL,
    PRIMARY KEY (student_id, project_type),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS past_projects (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    role TEXT,
    tech_stack TEXT NOT NULL, -- JSON array string
    link TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS project_posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    roles_needed TEXT NOT NULL, -- JSON array string
    skills_required TEXT NOT NULL, -- JSON array string
    team_size INTEGER NOT NULL,
    current_team_count INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL,
    interested_student_ids TEXT NOT NULL, -- JSON array string
    FOREIGN KEY (author_id) REFERENCES students(id) ON DELETE CASCADE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS project_requests (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    project_title TEXT NOT NULL,
    role_needed TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES students(id) ON DELETE CASCADE
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS project_partners (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    student_id_1 TEXT NOT NULL,
    student_id_2 TEXT NOT NULL,
    project_title TEXT NOT NULL,
    role_description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'In Progress',
    formed_date TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (request_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id_1) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id_2) REFERENCES students(id) ON DELETE CASCADE
);
""")

# 2. Seed Data
students_data = [
    {
        "id": "student-1",
        "name": "Arjun Mehta",
        "email": "arjun.mehta@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Computer Science",
        "year": "3rd Year",
        "avatar_url": None,
        "bio": "Full-stack developer passionate about building practical web platforms for campus needs. Currently seeking a team partner with machine learning or data science expertise for our 6th-semester capstone mini project.",
        "skills": ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker"],
        "interests": ["Web Development", "Cloud Architecture", "Distributed Systems", "Campus Tools"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Capstone Mini Project", "Hackathons", "Open Source Tools"],
        "joined_date": "2024-08-15",
        "phone": "+91 98450 12345",
        "github": "https://github.com/arjunmehta-dev",
        "linkedin": "https://linkedin.com/in/arjun-mehta-cs",
        "discord": "arjun_m#4412",
        "projects": [
            {
                "id": "proj-1",
                "title": "Kamaladevi Lost & Found Portal",
                "description": "A responsive web application allowing college students to post, verify, and claim misplaced belongings across campus departments.",
                "role": "Full Stack Lead",
                "techStack": ["React", "Node.js", "Express", "PostgreSQL"],
                "link": "https://github.com/arjunmehta-dev/campus-lost-found"
            },
            {
                "id": "proj-2",
                "title": "Lab Slot Reservation Engine",
                "description": "Micro-scheduler for CS department laboratory hardware slots and GPU compute sessions.",
                "role": "Backend Developer",
                "techStack": ["TypeScript", "Express", "Tailwind CSS"],
                "link": "https://github.com/arjunmehta-dev/lab-scheduler"
            }
        ]
    },
    {
        "id": "student-2",
        "name": "Kavya Ramanathan",
        "email": "kavya.ramanathan@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Data Science & AI",
        "year": "3rd Year",
        "avatar_url": None,
        "bio": "Data Science student focusing on natural language processing, predictive modeling, and analytics. Looking for a web developer partner to build interactive UI frontends for ML models.",
        "skills": ["Python", "Machine Learning", "FastAPI", "Pandas", "PyTorch", "Data Analysis", "Scikit-Learn"],
        "interests": ["Natural Language Processing", "Healthcare AI", "Computer Vision", "Data Visualization"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Research Paper Implementation", "Mini Project", "Kaggle Competitions"],
        "joined_date": "2024-09-02",
        "phone": None,
        "github": "https://github.com/kavya-ds",
        "linkedin": "https://linkedin.com/in/kavyaramanathan-ai",
        "discord": None,
        "projects": [
            {
                "id": "proj-3",
                "title": "Academic Abstract Summarizer",
                "description": "Fine-tuned transformer model that distills 5-page research papers into structured 3-sentence summaries for literature review.",
                "role": "ML Engineer",
                "techStack": ["Python", "HuggingFace", "FastAPI", "PyTorch"],
                "link": "https://github.com/kavya-ds/abstract-summarizer"
            },
            {
                "id": "proj-4",
                "title": "Campus Sentiment Monitor",
                "description": "Analyzed anonymous campus forum submissions to categorize student satisfaction trends regarding course registration and dining.",
                "role": "Data Analyst",
                "techStack": ["Python", "Pandas", "NLTK", "Matplotlib"],
                "link": None
            }
        ]
    },
    {
        "id": "student-3",
        "name": "Karthik Sundaram",
        "email": "karthik.sundaram@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Computer Science",
        "year": "Final Year",
        "avatar_url": None,
        "bio": "Mobile application developer with hands-on Flutter and native Android development experience. Currently exploring cross-platform productivity utilities for students and study groups.",
        "skills": ["Flutter", "Dart", "Android", "Firebase", "UI/UX Design", "Figma", "Java"],
        "interests": ["Mobile App Development", "Product Design", "Offline-First Systems"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Major Capstone Project", "Startup MVP"],
        "joined_date": "2023-08-10",
        "phone": None,
        "github": "https://github.com/karthiksundaram-mobile",
        "linkedin": None,
        "discord": "karthik_s#9011",
        "projects": [
            {
                "id": "proj-5",
                "title": "StudyPulse - Peer Focus & Study Groups",
                "description": "Cross-platform mobile app enabling synchronized study sessions with shared audio ambiances and subject goal tracking.",
                "role": "Mobile Lead",
                "techStack": ["Flutter", "Dart", "Firebase", "Provider"],
                "link": None
            }
        ]
    },
    {
        "id": "student-4",
        "name": "Priya Sharma",
        "email": "priya.sharma@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Information Technology",
        "year": "3rd Year",
        "avatar_url": None,
        "bio": "Frontend enthusiast and UI designer. I love turning complex student processes into clean, accessible web interfaces. Looking for a backend/database specialist for our semester course project.",
        "skills": ["React", "Next.js", "Tailwind CSS", "UI/UX Design", "Figma", "JavaScript", "HTML5/CSS3"],
        "interests": ["UI/UX Design", "Web Development", "Design Systems", "Accessibility"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Course Mini Project", "UI/UX Redesigns"],
        "joined_date": "2024-08-20",
        "phone": None,
        "github": "https://github.com/priyasharma-web",
        "linkedin": "https://linkedin.com/in/priya-sharma-ux",
        "discord": None,
        "projects": [
            {
                "id": "proj-6",
                "title": "Department Course Syllabus Navigator",
                "description": "Redesigned the departmental PDF curriculum into a clean, searchable, filterable interactive course catalogue.",
                "role": "UI Designer & Frontend Dev",
                "techStack": ["React", "Tailwind CSS", "Figma"],
                "link": None
            }
        ]
    },
    {
        "id": "student-5",
        "name": "Rohan Verma",
        "email": "rohan.verma@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Electronics & Communication",
        "year": "2nd Year",
        "avatar_url": None,
        "bio": "Hardware tinkerer focused on IoT sensors, microcontroller firmware, and telemetry dashboards. Looking for a web programmer to build real-time monitoring web interfaces for hardware sensors.",
        "skills": ["Embedded C", "IoT", "Python", "Arduino", "Raspberry Pi", "MQTT", "C++"],
        "interests": ["Internet of Things", "Embedded Systems", "Smart Agriculture", "Robotics"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Hardware Hackathon", "IoT Mini Project"],
        "joined_date": "2025-01-14",
        "phone": "+91 98765 43210",
        "github": "https://github.com/rohanverma-iot",
        "linkedin": None,
        "discord": None,
        "projects": [
            {
                "id": "proj-7",
                "title": "Automated Greenhouse Climate Controller",
                "description": "ESP32-based soil moisture and ambient temperature controller transmitting sensor payloads over MQTT protocol.",
                "role": "Hardware Firmware Engineer",
                "techStack": ["Embedded C", "ESP32", "MQTT", "C++"],
                "link": None
            }
        ]
    },
    {
        "id": "student-6",
        "name": "Ananya Iyer",
        "email": "ananya.iyer@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Computer Science",
        "year": "2nd Year",
        "avatar_url": None,
        "bio": "Backend programmer with strong foundations in Data Structures, Algorithms, and Object-Oriented Design in Java. Seeking frontend collaborators for database-driven enterprise applications.",
        "skills": ["Java", "Spring Boot", "PostgreSQL", "Data Structures", "Docker", "REST APIs"],
        "interests": ["Backend Systems", "Database Optimization", "Cloud Services"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Mini Project", "Backend Service"],
        "joined_date": "2025-02-01",
        "phone": None,
        "github": "https://github.com/ananya-iyer-cs",
        "linkedin": None,
        "discord": None,
        "projects": [
            {
                "id": "proj-8",
                "title": "High-Throughput Student Grading Ledger",
                "description": "Spring Boot REST service supporting concurrent CSV grade uploads with atomic rollback transactions and audit logs.",
                "role": "Backend Architect",
                "techStack": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
                "link": None
            }
        ]
    },
    {
        "id": "student-7",
        "name": "Aditya Nair",
        "email": "aditya.nair@kamaladevi.edu",
        "college": "Kamaladevi College",
        "department": "Software Engineering",
        "year": "Final Year",
        "avatar_url": None,
        "bio": "Software engineer passionate about API security, Linux system administration, and automated test runners. Looking to partner on web tools requiring strong authentication and testing pipelines.",
        "skills": ["Python", "Docker", "Linux", "FastAPI", "Cybersecurity", "Git", "Testing"],
        "interests": ["DevOps", "Cybersecurity", "System Administration"],
        "looking_for_partner": 1,
        "preferred_project_types": ["Final Year Capstone", "Open Source Tool"],
        "joined_date": "2023-09-01",
        "phone": None,
        "github": "https://github.com/adityanair-sec",
        "linkedin": None,
        "discord": None,
        "projects": [
            {
                "id": "proj-9",
                "title": "Static Vulnerability Scanner for Student Repos",
                "description": "CLI tool scanning GitHub student submissions for leaked API keys, unprotected secrets, and deprecated package CVEs.",
                "role": "Author & Maintainer",
                "techStack": ["Python", "Docker", "Git API"],
                "link": None
            }
        ]
    }
]

for s in students_data:
    cursor.execute("""
    INSERT INTO students (id, name, email, college, department, year, avatar_url, bio, looking_for_partner, joined_date, phone, github, linkedin, discord)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        s["id"], s["name"], s["email"], s["college"], s["department"], s["year"],
        s["avatar_url"], s["bio"], s["looking_for_partner"], s["joined_date"],
        s["phone"], s["github"], s["linkedin"], s["discord"]
    ))

    for skill in s["skills"]:
        cursor.execute("INSERT INTO student_skills (student_id, skill) VALUES (?, ?)", (s["id"], skill))

    for interest in s["interests"]:
        cursor.execute("INSERT INTO student_interests (student_id, interest) VALUES (?, ?)", (s["id"], interest))

    for p_type in s["preferred_project_types"]:
        cursor.execute("INSERT INTO student_preferred_project_types (student_id, project_type) VALUES (?, ?)", (s["id"], p_type))

    for proj in s["projects"]:
        cursor.execute("""
        INSERT INTO past_projects (id, student_id, title, description, role, tech_stack, link)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            proj["id"], s["id"], proj["title"], proj["description"], proj["role"],
            json.dumps(proj["techStack"]), proj.get("link")
        ))

# Project Posts
project_posts_data = [
    {
        "id": "post-1",
        "authorId": "student-1",
        "title": "Kamaladevi Smart Campus Lost & Found Web Portal",
        "category": "Capstone Mini Project",
        "description": "Building a real-time responsive web portal allowing students to report, verify, and reclaim misplaced items across campus departments, labs, and library.",
        "rolesNeeded": ["UI/UX Frontend Contributor", "Database & Auth Specialist"],
        "skillsRequired": ["React", "TypeScript", "PostgreSQL", "Tailwind CSS"],
        "teamSize": 3,
        "currentTeamCount": 2,
        "createdAt": "2026-10-01T10:00:00Z",
        "status": "open",
        "interestedStudentIds": ["student-4"]
    },
    {
        "id": "post-2",
        "authorId": "student-2",
        "title": "Automated Academic Abstract Summarization Engine",
        "category": "Research Project",
        "description": "Developing a domain-adapted transformer pipeline to extract multi-sentence summaries and key findings from PDF research papers. Seeking a frontend partner to create a clean student-facing dashboard.",
        "rolesNeeded": ["Full-Stack Web Developer (React + FastAPI)"],
        "skillsRequired": ["Python", "FastAPI", "React", "PyTorch"],
        "teamSize": 2,
        "currentTeamCount": 1,
        "createdAt": "2026-09-30T16:20:00Z",
        "status": "open",
        "interestedStudentIds": []
    },
    {
        "id": "post-3",
        "authorId": "student-5",
        "title": "Solar-Powered Smart Agriculture IoT Sensor Grid",
        "category": "Hardware & IoT Mini Project",
        "description": "ESP32 microcontrollers deployed with NPK soil nutrient sensors transmitting telemetry via MQTT protocol. Need a software collaborator to build the telemetry web interface and alerts.",
        "rolesNeeded": ["Web Dashboard Developer", "Backend API Specialist"],
        "skillsRequired": ["Python", "MQTT", "React", "FastAPI"],
        "teamSize": 3,
        "currentTeamCount": 1,
        "createdAt": "2026-09-29T12:00:00Z",
        "status": "open",
        "interestedStudentIds": []
    },
    {
        "id": "post-4",
        "authorId": "student-3",
        "title": "Campus Peer Study & Focus Room Mobile App",
        "category": "Final Year Capstone",
        "description": "Cross-platform Flutter application for study buddy pairing, synchronized Pomodoro rooms, and shared study playlists for Kamaladevi college exam prep.",
        "rolesNeeded": ["Backend Cloud Architect (Node.js/Firebase)"],
        "skillsRequired": ["Flutter", "Firebase", "Node.js"],
        "teamSize": 2,
        "currentTeamCount": 1,
        "createdAt": "2026-09-27T08:45:00Z",
        "status": "open",
        "interestedStudentIds": []
    }
]

for p in project_posts_data:
    cursor.execute("""
    INSERT INTO project_posts (id, author_id, title, category, description, roles_needed, skills_required, team_size, current_team_count, status, created_at, interested_student_ids)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        p["id"], p["authorId"], p["title"], p["category"], p["description"],
        json.dumps(p["rolesNeeded"]), json.dumps(p["skillsRequired"]),
        p["teamSize"], p["currentTeamCount"], p["status"], p["createdAt"],
        json.dumps(p["interestedStudentIds"])
    ))

# Project Requests
requests_data = [
    {
        "id": "req-1",
        "senderId": "student-2",
        "recipientId": "student-1",
        "projectTitle": "Automated Campus Course Recommendation System",
        "roleNeeded": "Full-Stack Frontend Developer (React + TypeScript)",
        "message": "Hi Arjun! I saw your Lost & Found React project and noticed you are looking for an ML partner for the 6th sem mini project. I have pre-trained a collaborative filtering model in PyTorch and wrote FastAPI endpoints, but I need an experienced frontend partner to build the student interface and dashboard for Kamaladevi College. Would you like to team up?",
        "status": "pending",
        "createdAt": "2026-10-01T14:30:00Z"
    },
    {
        "id": "req-2",
        "senderId": "student-5",
        "recipientId": "student-1",
        "projectTitle": "Smart Campus Waste Management Dashboard",
        "roleNeeded": "Web App & Database Developer",
        "message": "Hey Arjun, our ECE team built ultrasonic bin sensor nodes reporting over MQTT. We need someone who knows PostgreSQL and React to display bin fill levels across the Kamaladevi campus map.",
        "status": "pending",
        "createdAt": "2026-09-30T09:15:00Z"
    },
    {
        "id": "req-3",
        "senderId": "student-1",
        "recipientId": "student-4",
        "projectTitle": "Student Skills & Project Partners Platform",
        "roleNeeded": "Lead UI/UX Designer",
        "message": "Hi Priya! Your Course Syllabus redesign looked super clean. Would you like to partner up on designing the interface components for our Kamaladevi College B.Sc. mini project platform?",
        "status": "accepted",
        "createdAt": "2026-09-28T11:00:00Z"
    }
]

for r in requests_data:
    cursor.execute("""
    INSERT INTO project_requests (id, sender_id, recipient_id, project_title, role_needed, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        r["id"], r["senderId"], r["recipientId"], r["projectTitle"],
        r["roleNeeded"], r["message"], r["status"], r["createdAt"]
    ))

# Project Partners
partners_data = [
    {
        "id": "partner-1",
        "requestId": "req-3",
        "studentId1": "student-1",
        "studentId2": "student-4",
        "projectTitle": "Student Skills & Project Partners Platform",
        "roleDescription": "Lead UI/UX Designer & Component Architect",
        "status": "In Progress",
        "formedDate": "2026-09-29",
        "notes": "Weekly milestone: Finalizing student discovery cards and request workflow screens before midterm review."
    }
]

for pt in partners_data:
    cursor.execute("""
    INSERT INTO project_partners (id, request_id, student_id_1, student_id_2, project_title, role_description, status, formed_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        pt["id"], pt["requestId"], pt["studentId1"], pt["studentId2"],
        pt["projectTitle"], pt["roleDescription"], pt["status"],
        pt["formedDate"], pt["notes"]
    ))

conn.commit()
conn.close()
print("SQLite dataset successfully created at skills_partner.db")
