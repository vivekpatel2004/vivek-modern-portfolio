export type Skill = { name: string; category: string; percent?: number; icon: string; level?: string };
export type Project = {
  name: string; eyebrow: string; description: string; details: string[];
  stack: string[]; demo: string; github: string; image: string; featured: boolean;
};
export type Experience = { role: string; company: string; period: string; location: string; points: string[] };
export type PortfolioContent = {
  profile: { name: string; role: string; location: string; email: string; github: string; linkedin: string; resume: string; intro: string; availability: string; avatar: string };
  about: string[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: {
    degree: string;
    field?: string;
    school: string;
    board?: string;
    location?: string;
    period: string;
    detail: string;
    description?: string;
  }[];
  certifications: { name: string; issuer: string; date: string; url: string }[];
  stats: { label: string; value: string }[];
};