export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface Stat {
  number: number;
  suffix: string;
  label: string;
}

export interface CoursePersona {
  title: string;
  description: string;
}

export interface CurriculumModule {
  phase: string;
  title: string;
  duration: string;
  topics: string[];
}

export interface Project {
  title: string;
  description: string;
}

export interface CareerOutcomes {
  roles: string[];
  salaryRange: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: number;
  slug: string;
  name: string;
  duration: string;
  level: string;
  tagline: string;
  description: string;
  heroDescription: string;
  color: string;
  whoIsThisFor: CoursePersona[];
  curriculum: CurriculumModule[];
  tools: string[];
  projects: Project[];
  caseStudies?: CaseStudy[];
  careerOutcomes: CareerOutcomes;
  faqs: FAQ[];
}

export interface CaseStudy {
  company: string;
  title: string;
  description: string;
  focus: string[];
}

export interface Testimonial {
  name: string;
  previousRole: string;
  currentRole: string;
  company: string;
  quote: string;
  salaryHike: string;
}

export interface Instructor {
  name: string;
  experience: string;
  title: string;
  bio: string;
  specializations: string[];
}

export interface FAQCategory {
  category: string;
  questions: FAQ[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

export interface ComparisonRow {
  feature: string;
  course1: string;
  course2: string;
  course3: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
