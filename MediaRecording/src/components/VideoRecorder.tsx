import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaVideo,
  FaStop,
  FaSave,
  FaList,
  FaDesktop,
  FaTimes,
} from "react-icons/fa";
import { Recording } from "../App";

const RecorderContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
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
  width: 30%;
  max-width: 300px;
  height: 30%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
  object-fit: cover;
`;

const Controls = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? "#3498db" : "#95a5a6")};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  min-width: 180px;
  justify-content: center;

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const RecordingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  text-align: center;
`;

// Define the VideoRecorderProps interface
interface VideoRecorderProps {
  onNewRecording: (recording: Recording) => void;
  onViewRecordings: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onNewRecording,
  onViewRecordings,
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
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setCameraStream(stream);
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
        }
        if (mainVideoRef.current && !screenStream) {
          mainVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    initCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startScreenShare = async () => {
    try {
      const getDisplayMedia =
        navigator.mediaDevices.getDisplayMedia ||
        navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);

      const stream = await getDisplayMedia({
        video: true,
        audio: true,
      });

      setScreenStream(stream);
      if (mainVideoRef.current) {
        mainVideoRef.current.srcObject = stream;
      }

      // Handle when user stops screen share
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        if (mainVideoRef.current && cameraStream) {
          mainVideoRef.current.srcObject = cameraStream;
        }
      };
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  const startRecording = async () => {
    if (!cameraStream) return;

    // Enter fullscreen
    try {
      if (mainVideoRef.current?.requestFullscreen) {
        await mainVideoRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error("Error entering fullscreen:", err);
    }

    // Create canvas to combine streams
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions (HD resolution)
    canvas.width = 1280;
    canvas.height = 720;

    // Create stream from canvas
    const canvasStream = canvas.captureStream(30);
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    // Add audio tracks
    if (cameraStream.getAudioTracks().length > 0) {
      const cameraAudioSource = audioContext.createMediaStreamSource(
        new MediaStream(cameraStream.getAudioTracks())
      );
      cameraAudioSource.connect(destination);
    }

    if (screenStream && screenStream.getAudioTracks().length > 0) {
      const screenAudioSource = audioContext.createMediaStreamSource(
        new MediaStream(screenStream.getAudioTracks())
      );
      screenAudioSource.connect(destination);
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
      setRecordingTime(0);

      // Exit fullscreen
      if (isFullscreen && document.exitFullscreen) {
        document.exitFullscreen();
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

  const saveRecording = () => {
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

    const newRecording: Recording = {
      id: Date.now().toString(),
      name: `Recording ${new Date().toLocaleString()}`,
      date: new Date(),
      videoUrl: recordedVideo,
      thumbnailUrl: thumbnailUrl,
    };

    onNewRecording(newRecording);
    setRecordedVideo(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <RecorderContainer>
      <PreviewContainer>
        {recordedVideo ? (
          <MainVideo src={recordedVideo} controls />
        ) : (
          <>
            <MainVideo ref={mainVideoRef} autoPlay muted playsInline />
            {cameraStream && screenStream && (
              <CameraPreview ref={cameraVideoRef} autoPlay muted playsInline />
            )}
          </>
        )}
      </PreviewContainer>

      <Controls>
        {isRecording && (
          <>
            <RecordingIndicator>
              <IndicatorDot />
              <span>Recording</span>
            </RecordingIndicator>
            <Timer>{formatTime(recordingTime)}</Timer>
          </>
        )}

        <ButtonGroup>
          {!isRecording && !recordedVideo && (
            <>
              {!screenStream ? (
                <ActionButton onClick={startScreenShare}>
                  <FaDesktop /> Share Screen
                </ActionButton>
              ) : (
                <ActionButton
                  onClick={() => {
                    screenStream?.getTracks().forEach((track) => track.stop());
                    setScreenStream(null);
                  }}
                  style={{ background: "#e74c3c" }}
                >
                  <FaTimes /> Stop Sharing
                </ActionButton>
              )}

              <ActionButton
                primary
                onClick={startRecording}
                disabled={!cameraStream}
              >
                <FaVideo /> Start Recording
              </ActionButton>
            </>
          )}

          {isRecording && (
            <ActionButton primary onClick={stopRecording}>
              <FaStop /> Stop Recording
            </ActionButton>
          )}

          {recordedVideo && (
            <>
              <ActionButton primary onClick={saveRecording}>
                <FaSave /> Save Recording
              </ActionButton>
              <ActionButton onClick={() => setRecordedVideo(null)}>
                Discard
              </ActionButton>
            </>
          )}

          <ActionButton onClick={onViewRecordings}>
            <FaList /> View Recordings
          </ActionButton>
        </ButtonGroup>
      </Controls>
    </RecorderContainer>
  );
};

export default VideoRecorder;
