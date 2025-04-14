export interface JobDescription {
  text: string;
  keywords: string[];
  requiredSkills: string[];
  experienceLevel: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  links: {
    github?: string;
    leetcode?: string;
    portfolio?: string;
    linkedin?: string;
  };
  atsScore: number;
  resumeUrl: string;
  matchPercentage: number;
  skills: string[];
  experience: number;
  status: "New" | "Reviewing" | "Interviewing" | "Rejected" | "Hired";
}
