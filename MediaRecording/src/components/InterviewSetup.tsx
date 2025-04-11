import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaUser,
  FaBriefcase,
  FaVideo,
  FaHistory,
  FaCamera,
  FaMicrophone,
  FaDesktop,
  FaExclamationTriangle,
} from "react-icons/fa";

const SetupContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #7f8c8d;
  }
`;

const PermissionStatus = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const PermissionItem = styled.div<{ granted: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  color: ${(props) => (props.granted ? "#2ecc71" : "#e74c3c")};
`;

const ErrorAlert = styled.div`
  padding: 1rem;
  background: #fdecea;
  border-left: 4px solid #e74c3c;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c0392b;
`;

interface InterviewSetupProps {
  onStart: (details: { candidateName: string; position: string }) => void;
  onViewRecordings: () => void;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({
  onStart,
  onViewRecordings,
}) => {
  const [candidateName, setCandidateName] = useState("");
  const [position, setPosition] = useState("");
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false, // Screen share can't be checked in advance
  });
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const checkPermissions = async () => {
    setIsChecking(true);
    setError("");

    try {
      // Check camera permission
      const cameraStream = await navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
          return true;
        })
        .catch(() => false);

      // Check microphone permission
      const microphoneStream = await navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
          return true;
        })
        .catch(() => false);

      setPermissions({
        camera: cameraStream,
        microphone: microphoneStream,
        screen: true, // Screen share can't be checked in advance
      });

      if (!cameraStream || !microphoneStream) {
        setError("Camera and microphone permissions are required");
      }
    } catch (err) {
      console.error("Permission check error:", err);
      setError(
        "Failed to check permissions. Please refresh the page and try again."
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateName.trim() || !position.trim()) {
      setError("Please enter candidate name and position");
      return;
    }

    try {
      // First get camera and mic permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((track) => track.stop());

      // Then proceed to screen share (which will prompt separately)
      onStart({ candidateName, position });
    } catch (err) {
      console.error("Failed to get permissions:", err);
      setError(
        "Could not access camera and microphone. Please allow permissions."
      );
    }
  };

  // Check basic permissions when component loads
  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <SetupContainer>
      <Title>Setup New Interview</Title>

      {error && (
        <ErrorAlert>
          <FaExclamationTriangle /> {error}
        </ErrorAlert>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="candidateName">
            <FaUser /> Candidate Name
          </Label>
          <Input
            id="candidateName"
            type="text"
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="position">
            <FaBriefcase /> Role
          </Label>
          <Input
            id="position"
            type="text"
            placeholder="Enter position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </FormGroup>

        <PermissionStatus>
          <h4>Required Permissions:</h4>
          <PermissionItem granted={permissions.camera}>
            <FaCamera /> Camera:{" "}
            {permissions.camera ? "Granted" : "Not Granted"}
          </PermissionItem>
          <PermissionItem granted={permissions.microphone}>
            <FaMicrophone /> Microphone:{" "}
            {permissions.microphone ? "Granted" : "Not Granted"}
          </PermissionItem>
          <PermissionItem granted={permissions.screen}>
            <FaDesktop /> Screen Share: Will be requested when starting
          </PermissionItem>
          {isChecking && <p>Checking permissions...</p>}
        </PermissionStatus>

        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          <FaExclamationTriangle /> Note: The browser will prompt you to select
          what to share when starting the interview.
        </p>

        <ButtonGroup>
          <PrimaryButton type="submit" disabled={isChecking}>
            <FaVideo /> {isChecking ? "Checking..." : "Start Interview"}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onViewRecordings}>
            <FaHistory /> View Past Interviews
          </SecondaryButton>
        </ButtonGroup>
      </form>
    </SetupContainer>
  );
};

export default InterviewSetup;
