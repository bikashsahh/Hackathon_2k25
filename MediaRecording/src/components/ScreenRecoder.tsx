import React, { useState, useRef, useEffect } from "react";

const ScreenRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && recording) {
        const confirmExit = window.confirm(
          "Exiting fullscreen will stop the recording. Do you want to proceed?"
        );

        if (confirmExit) {
          stopRecording();
        } else {
          // Re-enter fullscreen if the user cancels
          enterFullscreen();
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [recording]);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document.documentElement as any).webkitRequestFullscreen) {
      (document.documentElement as any).webkitRequestFullscreen();
    }
  };

  const startRecording = async () => {
    try {
      // Request screen recording permissions
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: { echoCancellation: true },
      });

      // Request camera and microphone permissions
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 200, height: 150 },
        audio: true,
      });

      // Merge screen and camera streams
      const finalStream = new MediaStream([
        ...screenStream.getTracks(),
        ...cameraStream.getTracks(),
      ]);

      // Enter Fullscreen Mode
      enterFullscreen();

      // Show camera preview in video element
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = cameraStream;
        await videoPreviewRef.current.play();
      }

      // Start recording
      mediaRecorder.current = new MediaRecorder(finalStream);
      recordedChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        setVideoURL(URL.createObjectURL(blob));
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);

    // Exit Fullscreen Mode
    if (document.exitFullscreen) {
      document.exitFullscreen();
      mediaRecorder.current?.stop();
      setRecording(false);
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Screen & Camera Recorder</h2>

      {recording ? (
        <button onClick={stopRecording} style={styles.stopButton}>
          ⏹ Stop Recording
        </button>
      ) : (
        <button onClick={startRecording} style={styles.startButton}>
          🎥 Start Recording (Fullscreen)
        </button>
      )}

      {videoURL && (
        <div style={{ marginTop: "20px" }}>
          <h3>Recorded Video:</h3>
          <video src={videoURL} controls width="600" />
          <br />
          <a
            href={videoURL}
            download="recording.webm"
            style={styles.downloadButton}
          >
            📥 Download Video
          </a>
        </div>
      )}

      {/* Live Camera Preview */}
      <video
        ref={videoPreviewRef}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "200px",
          height: "150px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}
        autoPlay
        muted
      />
    </div>
  );
};

const styles = {
  startButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  stopButton: {
    backgroundColor: "#E74C3C",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  downloadButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
};

export default ScreenRecorder;
