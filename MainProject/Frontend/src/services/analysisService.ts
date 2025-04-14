import { JobDescription, Candidate } from "../types/analysis";

const API_BASE_URL = "https://api.hirebots.com/v1";

// Mock analysis function (in real app, this would call your backend)
export const analyzeJobDescription = async (
  jdText: string,
  files: File[]
): Promise<{
  jobDescription: JobDescription;
  candidates: Candidate[];
}> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response - in a real app this would come from your backend
  return {
    jobDescription: {
      text: jdText,
      keywords:
        jdText
          .toLowerCase()
          .match(/\b(\w+)\b/g)
          ?.slice(0, 15) || [],
      requiredSkills: [
        "React",
        "TypeScript",
        "Node.js",
        ...(jdText.includes("AWS") ? ["AWS"] : []),
      ],
      experienceLevel: jdText.includes("senior")
        ? "Senior"
        : jdText.includes("junior")
        ? "Junior"
        : "Mid-level",
    },
    candidates: [
      {
        id: "cand-1",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        links: {
          github: "github.com/alexjohnson",
          leetcode: "leetcode.com/alexjohnson",
        },
        atsScore: 87,
        resumeUrl: "https://hirebots.com/resumes/cand-1.pdf",
        matchPercentage: 92,
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        experience: 5,
        status: "New",
      },
      {
        id: "cand-2",
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        phone: "+1 (555) 987-6543",
        links: {
          github: "github.com/sarahw",
          linkedin: "linkedin.com/in/sarahw",
        },
        atsScore: 76,
        resumeUrl: "https://hirebots.com/resumes/cand-2.pdf",
        matchPercentage: 84,
        skills: ["JavaScript", "React", "Python"],
        experience: 3,
        status: "New",
      },
    ],
  };
};

//----trying to connect to backend----//

// import { JobDescription, Candidate } from "../types/analysis";

// const API_BASE_URL = "http://localhost:5000"; // Update with your backend URL

// export const analyzeJobDescription = async (
//   jdText: string,
//   files: File[]
// ): Promise<{
//   jobDescription: JobDescription;
//   candidates: Candidate[];
// }> => {
//   // console.log("Sending request to backend with job description and files...");
//   // console.log("Job Description Text:", jdText);
//   // console.log("Files:", files);
//   const formData = new FormData();
//   formData.append("jobDescription", jdText);

//   files.forEach((file) => {
//     formData.append("resumes", file);
//   });

//   const response = await fetch(`${API_BASE_URL}/api/upload`, {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("Failed to analyze job description");
//   }

//   return response.json();
// };
