import {
  EducationItem,
  ExperienceItem,
  NavLink,
  PersonalData,
  PortfolioCopy,
  ProjectItem,
  SkillGroups,
} from "@/lib/types";

export const personal: PersonalData = {
  name: "Smit Mandavia",
  role: "Python Developer | Backend & Full-Stack",
  roles: ["Python Developer", "Backend Engineer", "Full-Stack Developer"],
  tagline: "Building scalable backends & real-time systems",
  bio: "Results-driven Python developer with hands-on experience building production-grade internal tools across financial services and HRMS domains.",
  aboutHeading: "Passionate about building things that work.",
  aboutParagraphs: [
    "I build reliable software that helps teams move faster. My focus is backend architecture with FastAPI, data-driven systems, and maintainable full-stack delivery.",
    "At Junomoneta, I have shipped real-time analytics, incentive engines, and automation workflows that improved internal operations and reduced recurring manual effort.",
  ],
  availabilityLabel: "Available for opportunities",
  company: "Junomoneta Finsol Pvt. Ltd., GIFT City, India",
  email: "smitmandavia@gmail.com",
  phone: "+91-8200807232",
  location: "Vadodara, Gujarat, India",
  github: "https://github.com/smitmandavia",
  linkedin: "https://www.linkedin.com/in/smit-mandavia-52544812a",
  ctaViewWork: "View My Work",
  ctaDownloadResume: "Download Resume",
  profileAlt: "Portrait of Smit Mandavia",
};

export const navLinks: NavLink[] = [
  { id: "about", label: "About", href: "#about" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const aboutStats = [
  { label: "Years Exp", value: 1, suffix: "+" },
  { label: "Projects", value: 6, suffix: "+" },
  { label: "Technologies", value: 10, suffix: "+" },
];

export const topSkills = ["Python", "FastAPI", "React", "TypeScript", "Go", "PostgreSQL"];

export const experience: ExperienceItem[] = [
  {
    id: "junomoneta",
    role: "Python Developer",
    company: "Junomoneta Finsol Pvt. Ltd.",
    location: "GIFT City, Gujarat, India",
    duration: "January 2025 - Present",
    type: "Full-time",
    bullets: [
      "Engineered FastAPI microservices for HRMS, trader analytics, and business platforms serving 5+ internal teams.",
      "Optimized SQL queries and stored procedures across PostgreSQL, MySQL, and SQL Server, reducing query execution time by about 30%.",
      "Built real-time WebSocket dashboards in React and TypeScript for live PnL monitoring and trader analytics.",
      "Developed incentive calculation modules automating complex business logic across 3+ calculation rule sets.",
      "Built RMS Desktop Application using React and Electron JS with threshold-based system tray alerts.",
      "Created EOD and Bhavcopy processing services, SFTP cron jobs, and back office automation tools saving about 10 hours per week.",
      "Collaborated in Agile teams following full SDLC across 6+ internal platform projects.",
    ],
    tech: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Go",
      "PostgreSQL",
      "SQL Server",
      "WebSocket",
      "Docker",
      "Electron JS",
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    id: "incentive",
    title: "Incentive Management System",
    description: "End-to-end incentive computation engine with PnL, margin, carry-forward rules, and real-time React dashboards.",
    longDescription:
      "Owned complete backend development. Designed incentive calculation logic for individual and team flows, carry-forward features, and optimized SQL reporting.",
    tech: ["Python", "FastAPI", "PostgreSQL", "React", "TypeScript", "SQL"],
    category: "Backend + Full-Stack",
    filters: ["backend", "fullstack"],
    featured: true,
    github: null,
    live: null,
  },
  {
    id: "spectrum",
    title: "Spectrum - Trade Insights",
    description: "Real-time PnL monitoring platform with WebSocket streams and live interactive analytics dashboards.",
    longDescription:
      "Built React frontend with full API integration. Created backend APIs in Go and Python. Integrated WebSocket for live metric calculations.",
    tech: ["React", "TypeScript", "WebSocket", "Go", "Python", "PostgreSQL"],
    category: "Real-Time Systems",
    filters: ["realtime"],
    featured: true,
    github: null,
    live: null,
  },
  {
    id: "ifsc-rms",
    title: "IFSC - RMS Module",
    description: "Full-stack RMS module with Go and GIN backend, alert APIs, Docker deployment, and React frontend.",
    longDescription:
      "Owned entire frontend end-to-end. Set up Go backend with GIN APIs for Alert and Under Monitoring services and deployed with Docker.",
    tech: ["Go", "GIN", "React", "TypeScript", "Docker", "PostgreSQL"],
    category: "Full-Stack",
    filters: ["fullstack"],
    featured: true,
    github: null,
    live: null,
  },
  {
    id: "hrms",
    title: "HRMS - Probation & Onboarding",
    description: "Automated HR workflows covering onboarding, PIP, probation lifecycle, approvals, and notifications.",
    longDescription:
      "Enhanced stored procedures for probation workflows, built review UI with editable forms, and fixed real-time production bugs.",
    tech: ["Python", "SQL Server", "MySQL", "React", "TypeScript"],
    category: "Backend + Full-Stack",
    filters: ["backend", "fullstack"],
    featured: false,
    github: null,
    live: null,
  },
  {
    id: "rms-desktop",
    title: "RMS Desktop Application",
    description: "Cross-platform Electron JS desktop app with system tray alerts and threshold-based RMS notifications.",
    longDescription:
      "Built using React and Electron JS. Integrated native APIs for file system access, system tray support, and real-time alert triggers.",
    tech: ["Electron JS", "React", "TypeScript", "Tailwind CSS"],
    category: "Desktop Application",
    filters: ["desktop"],
    featured: false,
    github: null,
    live: null,
  },
  {
    id: "backoffice",
    title: "Back Office Automation",
    description: "Python EXE tools for document processing, SFTP cron jobs, and EOD mail service automation.",
    longDescription:
      "Built standalone EXE utilities for back office teams, developed cron-based SFTP and EOD services, and created EOD mail service in Go.",
    tech: ["Python", "PyInstaller", "Go", "Pandas", "Cron", "SFTP"],
    category: "Automation",
    filters: ["automation", "backend"],
    featured: false,
    github: null,
    live: null,
  },
];

export const skills: SkillGroups = {
  Languages: ["Python", "TypeScript", "SQL", "Go", "JavaScript"],
  Frameworks: ["FastAPI", "React", "Tailwind CSS", "Pandas", "Electron JS"],
  Databases: ["PostgreSQL", "MySQL", "SQL Server"],
  Concepts: ["REST APIs", "WebSockets", "Microservices", "OOP", "SDLC", "Agile", "CI/CD", "JWT", "Docker"],
  Tools: ["Git", "Postman", "Swagger", "PyInstaller", "VS Code"],
};

export const education: EducationItem[] = [
  {
    degree: "Post Graduate Diploma",
    field: "Software Engineering Technology - Artificial Intelligence",
    school: "Centennial College",
    location: "Toronto, Canada",
    year: "2023",
    courses: ["Data Analysis", "NLP", "Web Design", "DSA", "Mobile Application Development"],
  },
  {
    degree: "Bachelor of Science",
    field: "Computer Science",
    school: "Gujarat Technological University",
    location: "Gujarat, India",
    year: "2020",
    courses: ["Python", "JavaScript/CSS", "Algorithms", "OOP"],
  },
];

export const copy: PortfolioCopy = {
  skipToContent: "Skip to main content",
  timelineTitle: "Experience",
  projectTitle: "Projects",
  skillsTitle: "Technical Skills",
  educationTitle: "Education",
  footerText: "Built by Smit Mandavia",
  projectFilters: [
    { id: "all", label: "All" },
    { id: "backend", label: "Backend" },
    { id: "fullstack", label: "Full-Stack" },
    { id: "realtime", label: "Real-Time" },
    { id: "desktop", label: "Desktop" },
    { id: "automation", label: "Automation" },
  ],
  contactFields: {
    name: "Name",
    email: "Email",
    message: "Message",
  },
  contactCopy: {
    sectionTitle: "Contact",
    heading: "Let's work together",
    message: "If you are hiring for backend, real-time systems, or full-stack product work, I am open to discussing impactful roles.",
    submitLabel: "Send Message",
    sendingLabel: "Sending...",
    successMessage: "Message sent successfully.",
    errorMessage: "Unable to send message right now. Please email directly.",
    envErrorMessage: "Email service is not configured yet. Please add EmailJS environment variables.",
    privateProjectLabel: "Private Repo",
  },
  resumePath: "/Smit_Mandavia_Complete.pdf",
  privateTooltip: "Private - Internal Project",
};
