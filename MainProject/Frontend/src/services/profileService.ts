import { UserProfile } from "../types/profile";

const API_BASE_URL = "https://api.hirebots.com/v1";

export const fetchUserProfile = async (
  userId: string
): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

// Mock data for development
export const mockProfile: UserProfile = {
  id: "usr-12345",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  status: "Hired",
  atsScore: 87,
  appliedDate: "2023-10-15",
  lastUpdated: "2023-11-20",
  resumeUrl: "https://hirebots.com/resumes/usr-12345.pdf",
  skills: ["React", "TypeScript", "Node.js", "AWS"],
  experience: 5,
  currentCompany: "TechCorp",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
};
