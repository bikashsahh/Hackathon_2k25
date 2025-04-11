import React from "react";
import styled from "styled-components";
import {
  FaPlay,
  FaTrash,
  FaArrowLeft,
  FaUser,
  FaBriefcase,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

const ListContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
`;

const ListHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
`;

const BackButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #7f8c8d;
  }
`;

const RecordingItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const RecordingInfo = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Thumbnail = styled.div<{ src: string }>`
  width: 120px;
  height: 68px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  flex-shrink: 0;
`;

const RecordingDetails = styled.div`
  flex: 1;
`;

const CandidateName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Position = styled.p`
  margin: 0 0 0.25rem 0;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RecordingMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RecordingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PlayButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
`;

interface InterviewRecording {
  id: string;
  candidateName: string;
  position: string;
  date: Date;
  duration: number;
  videoUrl: string;
  thumbnailUrl?: string;
}

interface InterviewRecordingsProps {
  recordings: InterviewRecording[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const InterviewRecordings: React.FC<InterviewRecordingsProps> = ({
  recordings,
  onBack,
  onDelete,
}) => {
  const playRecording = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  const handleDelete = (id: string, videoUrl: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this interview recording?"
      )
    ) {
      URL.revokeObjectURL(videoUrl);
      onDelete(id);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Interview Recordings</ListTitle>
        <BackButton onClick={onBack}>
          <FaArrowLeft /> Back
        </BackButton>
      </ListHeader>

      {recordings.length === 0 ? (
        <EmptyState>
          <p>No interview recordings found.</p>
        </EmptyState>
      ) : (
        recordings.map((recording) => (
          <RecordingItem key={recording.id}>
            <RecordingInfo>
              <Thumbnail
                src={
                  recording.thumbnailUrl ||
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNjgiIHZpZXdCb3g9IjAgMCAxMjAgNjgiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjgiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNNDggMzRMMzYgMjR2MjBsMTItMTB6bTE2IDBsMTIgMTB2LTIwbC0xMiAxMHoiIGZpbGw9IiNjY2MiLz48L3N2Zz4="
                }
              />
              <RecordingDetails>
                <CandidateName>
                  <FaUser /> {recording.candidateName}
                </CandidateName>
                <Position>
                  <FaBriefcase /> {recording.position}
                </Position>
                <RecordingMeta>
                  <MetaItem>
                    <FaCalendarAlt /> {formatDate(recording.date)}
                  </MetaItem>
                  <MetaItem>
                    <FaClock /> {formatDuration(recording.duration)}
                  </MetaItem>
                </RecordingMeta>
              </RecordingDetails>
            </RecordingInfo>
            <RecordingActions>
              <PlayButton onClick={() => playRecording(recording.videoUrl)}>
                <FaPlay /> Play
              </PlayButton>
              <DeleteButton
                onClick={() => handleDelete(recording.id, recording.videoUrl)}
              >
                <FaTrash /> Delete
              </DeleteButton>
            </RecordingActions>
          </RecordingItem>
        ))
      )}
    </ListContainer>
  );
};

export default InterviewRecordings;
