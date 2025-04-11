import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaStop,
  FaSave,
  FaTimes,
  FaUser,
  FaBriefcase,
  FaClock,
} from "react-icons/fa";

const RecorderContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
`;

const InterviewHeader = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CandidateInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CandidateName = styled.h3`
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Position = styled.p`
  margin: 0;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewContainer = styled.div`
  position: relative;
  background: #000;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
`;

const MainVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
`;

const CameraPreview = styled.video`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 25%;
  max-width: 250px;
  height: 25%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  object-fit: cover;
  border: 2px solid #3498db;
`;

const Controls = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecordingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecordingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e74c3c;
  font-weight: 600;
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  background: #e74c3c;
  border-radius: 50%;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Timer = styled.div`
  font-family: monospace;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const StopButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const SaveButton = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #27ae60;
  }
`;

const CancelButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
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

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fdecea;
  border-left: 4px solid #e74c3c;
  margin: 1rem 0;
  color: #c0392b;
  text-align: center;
`;

interface InterviewRecording {
  id: string;
  candidateName: string;
  position: string;
  date: Date;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

interface InterviewRecorderProps {
  candidateName: string;
  position: string;
  onSave: (recording: InterviewRecording) => void;
  onCancel: () => void;
}

const InterviewRecorder: React.FC<InterviewRecorderProps> = ({
  candidateName,
  position,
  onSave,
  onCancel,
}) => {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [error, setError] = useState("");

  // Initialize recording
  useEffect(() => {
    const initRecording = async () => {
      try {
        // Get camera stream first
        const camStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setCameraStream(camStream);
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = camStream;
        }

        // Then get screen share
        try {
          const displayMedia =
            navigator.mediaDevices.getDisplayMedia ||
            (
              navigator.mediaDevices.getDisplayMedia ??
              (
                navigator as unknown as {
                  getDisplayMedia: () => Promise<MediaStream>;
                }
              ).getDisplayMedia
            ).bind(navigator);

          const screenStream = await displayMedia({
            video: true,
            audio: true,
          });
          setScreenStream(screenStream);
          if (mainVideoRef.current) {
            mainVideoRef.current.srcObject = screenStream;
          }

          // Handle when user stops screen share
          screenStream.getVideoTracks()[0].onended = () => {
            stopRecording();
            setError("Screen sharing was ended. Recording stopped.");
          };

          // Start recording
          startRecording(camStream, screenStream);
        } catch (screenError) {
          console.error("Screen share error:", screenError);
          // If screen share fails, continue with just camera
          startRecording(camStream, null);
        }
      } catch (err) {
        console.error("Error initializing recording:", err);
        setError(
          "Failed to access camera. Please refresh and allow permissions."
        );
        setTimeout(() => onCancel(), 3000);
      }
    };

    initRecording();

    return () => {
      if (cameraStream)
        cameraStream.getTracks().forEach((track) => track.stop());
      if (screenStream)
        screenStream.getTracks().forEach((track) => track.stop());
      if (timerInterval) clearInterval(timerInterval);
      if (recordedVideo) URL.revokeObjectURL(recordedVideo);
    };
  }, []);

  const startRecording = (
    camStream: MediaStream,
    screenStream: MediaStream | null
  ) => {
    // Create canvas to combine streams
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Could not initialize recording canvas");
      return;
    }

    // Set canvas dimensions (HD)
    canvas.width = 1280;
    canvas.height = 720;

    // Create stream from canvas
    const canvasStream = canvas.captureStream(30);
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    // Add audio tracks
    if (camStream.getAudioTracks().length > 0) {
      const cameraAudio = audioContext.createMediaStreamSource(
        new MediaStream(camStream.getAudioTracks())
      );
      cameraAudio.connect(destination);
    }

    if (screenStream && screenStream.getAudioTracks().length > 0) {
      const screenAudio = audioContext.createMediaStreamSource(
        new MediaStream(screenStream.getAudioTracks())
      );
      screenAudio.connect(destination);
    }

    // Combine audio streams
    destination.stream.getAudioTracks().forEach((track) => {
      canvasStream.addTrack(track);
    });

    // Start drawing to canvas
    const drawFrame = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw screen share if available
      if (screenStream && mainVideoRef.current) {
        try {
          ctx.drawImage(
            mainVideoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
        } catch (err) {
          console.error("Error drawing screen:", err);
        }
      }
      // Otherwise draw camera
      else if (cameraVideoRef.current) {
        ctx.drawImage(
          cameraVideoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      // Draw camera overlay if screen sharing
      if (screenStream && cameraVideoRef.current) {
        try {
          const overlayWidth = canvas.width / 4;
          const overlayHeight =
            (overlayWidth * cameraVideoRef.current.videoHeight) /
            cameraVideoRef.current.videoWidth;
          const overlayX = canvas.width - overlayWidth - 20;
          const overlayY = canvas.height - overlayHeight - 20;

          ctx.drawImage(
            cameraVideoRef.current,
            overlayX,
            overlayY,
            overlayWidth,
            overlayHeight
          );

          // Add border to overlay
          ctx.strokeStyle = "#3498db";
          ctx.lineWidth = 3;
          ctx.strokeRect(overlayX, overlayY, overlayWidth, overlayHeight);
        } catch (err) {
          console.error("Error drawing camera overlay:", err);
        }
      }

      if (isRecording) {
        requestAnimationFrame(drawFrame);
      }
    };

    // Start recording
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);

      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100); // Collect data every 100ms
    setIsRecording(true);
    drawFrame();

    // Start timer
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (!recordedVideo) return;

    // Generate thumbnail
    let thumbnailUrl = "";
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx && mainVideoRef.current) {
        canvas.width = 320;
        canvas.height = 180;
        ctx.drawImage(mainVideoRef.current, 0, 0, canvas.width, canvas.height);
        thumbnailUrl = canvas.toDataURL("image/jpeg");
      }
    } catch (err) {
      console.error("Error generating thumbnail:", err);
    }

    const newRecording: InterviewRecording = {
      id: Date.now().toString(),
      candidateName,
      position,
      date: new Date(),
      videoUrl: recordedVideo,
      thumbnailUrl,
      duration: recordingTime,
    };

    onSave(newRecording);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <RecorderContainer>
      <InterviewHeader>
        <CandidateInfo>
          <CandidateName>
            <FaUser /> {candidateName}
          </CandidateName>
          <Position>
            <FaBriefcase /> {position}
          </Position>
        </CandidateInfo>
        {isRecording && (
          <RecordingIndicator>
            <IndicatorDot />
            <span>Recording</span>
          </RecordingIndicator>
        )}
      </InterviewHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PreviewContainer>
        <MainVideo ref={mainVideoRef} autoPlay muted playsInline />
        {cameraStream && (
          <CameraPreview ref={cameraVideoRef} autoPlay muted playsInline />
        )}
      </PreviewContainer>

      <Controls>
        <RecordingInfo>
          <Timer>
            <FaClock /> Duration: {formatTime(recordingTime)}
          </Timer>
        </RecordingInfo>

        <ButtonGroup>
          {isRecording ? (
            <StopButton onClick={stopRecording}>
              <FaStop /> Stop Interview
            </StopButton>
          ) : recordedVideo ? (
            <>
              <SaveButton onClick={handleSave}>
                <FaSave /> Save Interview
              </SaveButton>
              <CancelButton onClick={onCancel}>
                <FaTimes /> Discard
              </CancelButton>
            </>
          ) : (
            <div>Initializing recording...</div>
          )}
        </ButtonGroup>
      </Controls>
    </RecorderContainer>
  );
};

export default InterviewRecorder;
