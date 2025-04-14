import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaTrash,
  FaFilePdf,
  FaFileWord,
  FaSearch,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import { analyzeJobDescription } from "../services/analysisService";
import { JobDescription, Candidate } from "../types/analysis";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #4285f4;
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #4285f4;
  }
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const Section = styled(motion.section)`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
`;

const FileUploadArea = styled(motion.div)`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4285f4;
    background: #f8faff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const FileItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FileIcon = styled.div`
  color: #ea4335;
  font-size: 1.25rem;
`;

const FileName = styled.div`
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;

  &:hover {
    color: #ea4335;
  }
`;

const SubmitButton = styled(motion.button)`
  background: #4285f4;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #3367d6;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const CandidateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CandidateItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #4285f4;
  }
`;

const CandidateAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #666;
  font-size: 1.25rem;
`;

const CandidateInfo = styled.div`
  flex: 1;
`;

const CandidateName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const CandidateEmail = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #666;
`;

const CandidateScore = styled.div<{ score: number }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  background-color: ${(props) => {
    if (props.score >= 80) return "#34a85320";
    if (props.score >= 60) return "#fbbc0520";
    return "#ea433520";
  }};
  color: ${(props) => {
    if (props.score >= 80) return "#34a853";
    if (props.score >= 60) return "#fbbc05";
    return "#ea4335";
  }};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterInput = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
`;

const DashboardPage = () => {
  const [jdText, setJdText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    jobDescription: JobDescription | null;
    candidates: Candidate[];
  } | null>(null);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minScore, setMinScore] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith(".docx") ||
          file.name.endsWith(".doc")
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!jdText.trim() || files.length === 0) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeJobDescription(jdText, files);
      setAnalysis(result);
      setFilteredCandidates(result.candidates);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/profile/${candidateId}`);
  };

  useEffect(() => {
    if (analysis) {
      const filtered = analysis.candidates.filter((candidate) => {
        const matchesSearch =
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesScore = candidate.atsScore >= minScore;
        return matchesSearch && matchesScore;
      });
      setFilteredCandidates(filtered);
    }
  }, [searchTerm, minScore, analysis]);

  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <img src="/logo.png" alt="HireBots" width="40" height="40" />
          <span>HireBots</span>
        </Logo>

        <NavControls>
          <NavButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaUserCircle /> Profile
          </NavButton>
          <NavButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaCog /> Settings
          </NavButton>
        </NavControls>
      </Header>

      <MainContent>
        <Section
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SectionTitle>
            {analysis ? "Edit Job Description" : "Enter Job Description"}
          </SectionTitle>

          <TextArea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            disabled={isAnalyzing}
          />

          <FileUploadArea
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <FaUpload
              size={32}
              style={{ marginBottom: "1rem", color: "#4285f4" }}
            />
            <p>Click to upload resumes (PDF, DOCX)</p>
            <p style={{ fontSize: "0.8rem", color: "#666" }}>
              or drag and drop files here
            </p>
            <FileInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.doc,.docx"
              disabled={isAnalyzing}
            />
          </FileUploadArea>

          {files.length > 0 && (
            <>
              <FileList>
                {files.map((file, index) => (
                  <FileItem
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FileInfo>
                      <FileIcon>
                        {file.type === "application/pdf" ? (
                          <FaFilePdf />
                        ) : (
                          <FaFileWord />
                        )}
                      </FileIcon>
                      <FileName>{file.name}</FileName>
                    </FileInfo>
                    <RemoveButton onClick={() => removeFile(index)}>
                      <FaTrash />
                    </RemoveButton>
                  </FileItem>
                ))}
              </FileList>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4285f4",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <FaUpload /> Add More Files
                </button>
              </div>
            </>
          )}

          <SubmitButton
            onClick={handleSubmit}
            disabled={!jdText.trim() || files.length === 0 || isAnalyzing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Resumes"}
          </SubmitButton>
        </Section>

        <Section
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SectionTitle>
            {analysis ? "Candidate Matches" : "Results Will Appear Here"}
          </SectionTitle>

          {analysis ? (
            <>
              <FilterContainer>
                <FilterInput>
                  <Input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </FilterInput>
                <FilterInput>
                  <Select
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                  >
                    <option value={0}>All Scores</option>
                    <option value={60}>60+ ATS Score</option>
                    <option value={70}>70+ ATS Score</option>
                    <option value={80}>80+ ATS Score</option>
                    <option value={90}>90+ ATS Score</option>
                  </Select>
                </FilterInput>
              </FilterContainer>

              <CandidateList>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <CandidateItem
                      key={candidate.id}
                      onClick={() => handleCandidateClick(candidate.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CandidateAvatar>
                        {candidate.name.charAt(0)}
                      </CandidateAvatar>
                      <CandidateInfo>
                        <CandidateName>{candidate.name}</CandidateName>
                        <CandidateEmail>{candidate.email}</CandidateEmail>
                      </CandidateInfo>
                      <CandidateScore score={candidate.atsScore}>
                        {candidate.atsScore}%
                      </CandidateScore>
                    </CandidateItem>
                  ))
                ) : (
                  <p>No candidates match your filters</p>
                )}
              </CandidateList>
            </>
          ) : (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#666" }}
            >
              <FaSearch
                size={48}
                style={{ marginBottom: "1rem", opacity: 0.5 }}
              />
              <p>
                Submit a job description and resumes to see candidate matches
              </p>
            </div>
          )}
        </Section>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardPage;
