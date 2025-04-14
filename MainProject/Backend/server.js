const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const textract = require("textract");
const natural = require("natural");
const { PorterStemmer } = natural;
const tokenizer = new natural.WordTokenizer();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|docx|doc/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOCX and DOC files are allowed!"));
    }
  },
});

// Mock database of candidates (in real app, use a real database)
const mockCandidates = [
  {
    id: "cand-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    links: {
      github: "github.com/alexjohnson",
      leetcode: "leetcode.com/alexjohnson",
    },
    resumeText:
      "Experienced full-stack developer with 5 years of experience in React, Node.js, and TypeScript. Strong background in AWS cloud services and CI/CD pipelines.",
    skills: ["React", "TypeScript", "Node.js", "AWS", "CI/CD"],
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
    resumeText:
      "Frontend developer with 3 years of experience building responsive web applications using React and JavaScript. Familiar with Python and Django for backend development.",
    skills: ["JavaScript", "React", "Python", "Django"],
    experience: 3,
    status: "New",
  },
];

// Helper function to extract text from files
async function extractTextFromFile(filePath, fileType) {
  try {
    if (fileType === "pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (fileType === "docx" || fileType === "doc") {
      return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
          if (error) reject(error);
          else resolve(text);
        });
      });
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    return "";
  }
}

// Helper function to calculate ATS score
function calculateATSScore(jobDescription, resumeText) {
  // Tokenize and process text
  const jdTokens = tokenizer.tokenize(jobDescription.toLowerCase());
  const resumeTokens = tokenizer.tokenize(resumeText.toLowerCase());

  // Stem words for better matching
  const jdStems = jdTokens.map((token) => PorterStemmer.stem(token));
  const resumeStems = resumeTokens.map((token) => PorterStemmer.stem(token));

  // Calculate keyword matches
  const uniqueJdStems = [...new Set(jdStems)];
  const matches = uniqueJdStems.filter((stem) =>
    resumeStems.includes(stem)
  ).length;

  // Calculate match percentage
  const matchPercentage = Math.min(
    Math.round((matches / uniqueJdStems.length) * 100),
    100
  );

  // Adjust score based on other factors
  let score = matchPercentage;

  // Bonus for skills section matches
  if (resumeText.toLowerCase().includes("skills")) {
    score += 5;
  }

  // Bonus for experience duration
  const experienceMatch = resumeText.match(/(\d+)\+?\s*years?/i);
  if (experienceMatch) {
    const years = parseInt(experienceMatch[1]);
    score += Math.min(years * 2, 10); // Max 10 points for experience
  }

  return Math.min(score, 100); // Cap at 100
}

// API Endpoint to analyze job description and resumes
app.post("/api/analyze", upload.array("resumes"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const files = req.files;

    if (!jobDescription || !files || files.length === 0) {
      return res.status(400).json({
        error: "Job description and at least one resume file are required",
      });
    }

    // Process all uploaded resumes
    const processedCandidates = await Promise.all(
      files.map(async (file) => {
        const fileExt = path.extname(file.originalname).slice(1);
        const resumeText = await extractTextFromFile(file.path, fileExt);

        // For demo, we'll match against our mock candidates
        // In real app, you'd create new candidate entries
        const bestMatch = mockCandidates
          .map((candidate) => {
            const score = calculateATSScore(
              jobDescription,
              candidate.resumeText
            );
            return {
              ...candidate,
              atsScore: score,
              matchPercentage: Math.min(
                score + Math.floor(Math.random() * 10),
                100
              ), // Add some variance
              resumeUrl: `/resumes/${file.filename}`,
            };
          })
          .sort((a, b) => b.atsScore - a.atsScore)[0];

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        return bestMatch;
      })
    );

    // Extract keywords from job description
    const jdTokens = tokenizer.tokenize(jobDescription.toLowerCase());
    const jdStems = [
      ...new Set(jdTokens.map((token) => PorterStemmer.stem(token))),
    ];

    // Prepare response
    const response = {
      jobDescription: {
        text: jobDescription,
        keywords: jdStems.slice(0, 15), // Top 15 keywords
        requiredSkills: jdStems
          .filter(
            (stem) => stem.length > 3 && !natural.stopwords.includes(stem)
          )
          .slice(0, 10),
        experienceLevel: jobDescription.toLowerCase().includes("senior")
          ? "Senior"
          : jobDescription.toLowerCase().includes("junior")
          ? "Junior"
          : "Mid-level",
      },
      candidates: processedCandidates,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in analysis:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Serve uploaded resumes
app.use("/resumes", express.static("uploads"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
