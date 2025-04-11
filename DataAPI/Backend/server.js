require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
const PORT = process.env.PORT || 3001;

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are allowed!"));
    }
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const analyzeResumeContent = (textContent) => {
  // Define important keywords for different categories
  const keywordCategories = {
    technical: [
      "javascript",
      "python",
      "java",
      "react",
      "node",
      "express",
      "mongodb",
      "sql",
    ],
    education: ["bachelor", "master", "phd", "degree", "university", "college"],
    experience: ["experience", "worked", "developer", "engineer", "years"],
    projects: ["project", "built", "developed", "created", "implemented"],
  };

  // Check for links
  const linkPatterns = {
    github: /github\.com\/[a-zA-Z0-9-]+/g,
    linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/g,
    leetcode: /leetcode\.com\/[a-zA-Z0-9-]+/g,
    portfolio: /(https?:\/\/)?[a-zA-Z0-9-]+\.(com|io|dev|net)\/?/g,
  };

  // Calculate presence percentage for each category
  const categoryResults = {};
  let totalKeywordsFound = 0;
  let totalKeywordsPossible = 0;

  Object.entries(keywordCategories).forEach(([category, keywords]) => {
    const foundKeywords = keywords.filter((keyword) =>
      textContent.toLowerCase().includes(keyword)
    );
    const percentage = (foundKeywords.length / keywords.length) * 100;

    categoryResults[category] = {
      percentage: percentage.toFixed(2),
      found: foundKeywords,
      missing: keywords.filter((k) => !foundKeywords.includes(k)),
    };

    totalKeywordsFound += foundKeywords.length;
    totalKeywordsPossible += keywords.length;
  });

  // Extract links
  const foundLinks = {};
  Object.entries(linkPatterns).forEach(([platform, pattern]) => {
    const matches = textContent.match(pattern);
    if (matches) {
      foundLinks[platform] = matches[0];
      if (!matches[0].startsWith("http")) {
        foundLinks[platform] = "https://" + matches[0];
      }
    }
  });

  // Calculate overall match percentage
  const overallMatch = (totalKeywordsFound / totalKeywordsPossible) * 100;

  return {
    overallMatchPercentage: overallMatch.toFixed(2),
    categoryAnalysis: categoryResults,
    linksFound: foundLinks,
    bikashAnalysis: {
      hasBikash: textContent.toLowerCase().includes("bikash"),
      mentionCount: (textContent.toLowerCase().match(/bikash/g) || []).length,
    },
  };
};
// Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let textContent = "";

    // Extract text content based on file type
    if (fileExt === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      textContent = data.text;
    } else if (fileExt === ".doc" || fileExt === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    }

    // Split content into words
    const words = textContent
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .split(" ");

    console.log("Extracted words:", words);

    // Store file metadata and words in your database (simplified here)
    const fileId = path.basename(
      req.file.filename,
      path.extname(req.file.filename)
    );

    const analysisResults = analyzeResumeContent(textContent);

    // console.log(analysisResults);

    //real mae database ko bhej denge
    res.json({
      message: "File uploaded and processed successfully",
      fileId: fileId,
      originalName: req.file.originalname,
      words: words,
      wordCount: words.length,
      analysis: analysisResults,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
});

// Download endpoint
app.get("/api/download/:fileId", (req, res) => {
  try {
    const fileId = req.params.fileId;
    const uploadDir = path.join(__dirname, "uploads");

    // Find the file with the matching ID (without extension)
    const files = fs.readdirSync(uploadDir);
    const file = files.find((f) => f.startsWith(fileId));

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadDir, file);
    const fileExt = path.extname(file);

    // Set appropriate Content-Type based on file extension
    let contentType = "application/octet-stream";
    if (fileExt === ".pdf") {
      contentType = "application/pdf";
    } else if (fileExt === ".doc") {
      contentType = "application/msword";
    } else if (fileExt === ".docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=${file}`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
