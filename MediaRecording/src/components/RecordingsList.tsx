import React from "react";
import styled from "styled-components";
import { FaPlay, FaTrash, FaArrowLeft } from "react-icons/fa";
import { Recording } from "../App";

const ListContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 800px;
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
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
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
  align-items: center;
  gap: 1rem;
`;

const Thumbnail = styled.div<{ src: string }>`
  width: 80px;
  height: 45px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`;

const RecordingDetails = styled.div`
  flex: 1;
`;

const RecordingName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1rem;
`;

const RecordingDate = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.8rem;
`;

const RecordingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? "#3498db" : "#e74c3c")};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
`;

interface RecordingsListProps {
  recordings: Recording[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const RecordingsList: React.FC<RecordingsListProps> = ({
  recordings,
  onBack,
  onDelete,
}) => {
  const playRecording = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  const handleDelete = (id: string, videoUrl: string) => {
    URL.revokeObjectURL(videoUrl);
    onDelete(id);
  };

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Your Recordings</ListTitle>
        <BackButton onClick={onBack}>
          <FaArrowLeft /> Back
        </BackButton>
      </ListHeader>

      {recordings.length === 0 ? (
        <EmptyState>
          <p>No recordings yet. Start recording to see them here.</p>
        </EmptyState>
      ) : (
        recordings.map((recording) => (
          <RecordingItem key={recording.id}>
            <RecordingInfo>
              <Thumbnail
                src={
                  recording.thumbnailUrl ||
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI0NSIgdmlld0JveD0iMCAwIDgwIDQ1IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNDUiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNMzIgMjVMMjAgMTV2MjBsMTItMTB6bTE2IDBsMTIgMTB2LTIwbC0xMiAxMHoiIGZpbGw9IiNjY2MiLz48L3N2Zz4="
                }
              />
              <RecordingDetails>
                <RecordingName>{recording.name}</RecordingName>
                <RecordingDate>{recording.date.toLocaleString()}</RecordingDate>
              </RecordingDetails>
            </RecordingInfo>
            <RecordingActions>
              <ActionButton
                primary
                onClick={() => playRecording(recording.videoUrl)}
                aria-label="Play recording"
              >
                <FaPlay />
              </ActionButton>
              <ActionButton
                onClick={() => handleDelete(recording.id, recording.videoUrl)}
                aria-label="Delete recording"
              >
                <FaTrash />
              </ActionButton>
            </RecordingActions>
          </RecordingItem>
        ))
      )}
    </ListContainer>
  );
};

export default RecordingsList;
