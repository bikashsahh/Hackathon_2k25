export interface UserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  status:
    | "Applied"
    | "In Progress"
    | "Interviewed"
    | "Shortlisted"
    | "Rejected"
    | "Hired";
  atsScore: number;
  appliedDate: string;
  lastUpdated: string;
  resumeUrl: string;
  skills: string[];
  experience: number;
  currentCompany?: string;
  phone?: string;
  location?: string;
}
