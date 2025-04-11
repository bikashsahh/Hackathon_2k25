import { useState } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [downloadLinks, setDownloadLinks] = useState<
    { id: string; name: string }[]
  >([]);
  interface AnalysisResults {
    overallMatchPercentage: number;
    linksFound: Record<string, string>;
    categoryAnalysis: Record<
      string,
      { percentage: number; found: string[]; missing: string[] }
    >;
    bikashAnalysis: { hasBikash: boolean; mentionCount: number };
  }

  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResults | null>(null);

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus("Upload successful!");
        setSelectedFile(null);
        setDownloadLinks((prev) => [
          ...prev,
          {
            id: data.fileId,
            name: selectedFile.name,
          },
        ]);
        setAnalysisResults(data.analysis);
      } else {
        setUploadStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setUploadStatus(
        `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Document Upload</h2>
      <div className="upload-section">
        <input
          type="file"
          id="fileInput"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="fileInput" className="file-label">
          {selectedFile ? selectedFile.name : "Choose a file (PDF or DOC)"}
        </label>
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>
      {uploadStatus && <p className="status">{uploadStatus}</p>}

      {downloadLinks.length > 0 && (
        <div className="download-section">
          <h3>Your Uploaded Files:</h3>
          <ul className="file-list">
            {downloadLinks.map((file) => (
              <li key={file.id} className="file-item">
                <a
                  href={`http://localhost:3001/api/download/${file.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysisResults && (
        <div className="analysis-results">
          <h3>Resume Analysis</h3>

          <div className="overall-match">
            <h4>Overall Match: {analysisResults.overallMatchPercentage}%</h4>
          </div>

          <div className="links-found">
            <h4>Important Links:</h4>
            <ul>
              {Object.entries(analysisResults.linksFound).map(
                ([platform, link]) => (
                  <li key={platform}>
                    <strong>{platform}:</strong>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="category-analysis">
            <h4>Category Analysis:</h4>
            {Object.entries(analysisResults.categoryAnalysis).map(
              ([category, data]) => (
                <div key={category} className="category">
                  <h5>
                    {category.charAt(0).toUpperCase() + category.slice(1)}:{" "}
                    {data.percentage}%
                  </h5>
                  <p>Found: {data.found.join(", ")}</p>
                  {data.missing.length > 0 && (
                    <p className="missing">
                      Missing: {data.missing.join(", ")}
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          {analysisResults.bikashAnalysis.hasBikash && (
            <div className="bikash-mention">
              <h4>Bikash Mention:</h4>
              <p>
                Found {analysisResults.bikashAnalysis.mentionCount} mention(s)
                of "Bikash"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
