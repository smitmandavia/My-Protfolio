export type SectionId = "hero" | "about" | "experience" | "projects" | "skills" | "education" | "contact";

export type ProjectFilterId = "all" | "backend" | "fullstack" | "realtime" | "desktop" | "automation";

export interface NavLink {
  id: Exclude<SectionId, "education">;
  label: string;
  href: `#${Exclude<SectionId, "education">}`;
}

export interface PersonalData {
  name: string;
  role: string;
  roles: string[];
  tagline: string;
  bio: string;
  aboutHeading: string;
  aboutParagraphs: string[];
  availabilityLabel: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  ctaViewWork: string;
  ctaDownloadResume: string;
  profileAlt: string;
}

export interface AboutStat {
  label: string;
  value: number;
  suffix: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  bullets: string[];
  tech: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: string;
  filters: ProjectFilterId[];
  featured: boolean;
  github: string | null;
  live: string | null;
}

export interface EducationItem {
  degree: string;
  field: string;
  school: string;
  location: string;
  year: string;
  courses: string[];
}

export type SkillGroups = Record<string, string[]>;

export interface FilterTab {
  id: ProjectFilterId;
  label: string;
}

export interface ContactFieldLabels {
  name: string;
  email: string;
  message: string;
}

export interface ContactCopy {
  sectionTitle: string;
  heading: string;
  message: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  envErrorMessage: string;
  privateProjectLabel: string;
}

export interface PortfolioCopy {
  skipToContent: string;
  timelineTitle: string;
  projectTitle: string;
  skillsTitle: string;
  educationTitle: string;
  footerText: string;
  projectFilters: FilterTab[];
  contactFields: ContactFieldLabels;
  contactCopy: ContactCopy;
  resumePath: string;
  privateTooltip: string;
}
