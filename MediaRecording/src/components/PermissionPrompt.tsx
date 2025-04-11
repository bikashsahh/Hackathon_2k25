// import React, { useState } from "react";
// import styled from "styled-components";
// import { FaCamera, FaMicrophone, FaCheck, FaDesktop } from "react-icons/fa";

// const PermissionContainer = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 2rem;
//   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//   max-width: 500px;
//   width: 100%;
//   text-align: center;
// `;

// const Title = styled.h2`
//   color: #2c3e50;
//   margin-bottom: 1.5rem;
// `;

// const Description = styled.p`
//   color: #7f8c8d;
//   margin-bottom: 2rem;
//   line-height: 1.6;
// `;

// const PermissionItem = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 1rem;
//   padding: 1rem;
//   background: #f8f9fa;
//   border-radius: 8px;
//   transition: all 0.3s ease;

//   &.granted {
//     background: #e8f5e9;
//     color: #2e7d32;
//   }
// `;

// const PermissionText = styled.span`
//   margin-left: 1rem;
//   font-weight: 500;
// `;

// const StartButton = styled.button`
//   background: #3498db;
//   color: white;
//   border: none;
//   padding: 1rem 2rem;
//   font-size: 1rem;
//   border-radius: 50px;
//   margin-top: 1.5rem;
//   font-weight: 600;
//   width: 100%;
//   max-width: 300px;
//   box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);

//   &:disabled {
//     background: #bdc3c7;
//     cursor: not-allowed;
//     box-shadow: none;
//   }
// `;

// interface PermissionPromptProps {
//   onPermissionGranted: () => void;
// }

// const PermissionPrompt: React.FC<PermissionPromptProps> = ({
//   onPermissionGranted,
// }) => {
//   const [cameraPermission, setCameraPermission] = useState(false);
//   const [microphonePermission, setMicrophonePermission] = useState(false);
//   const [isRequesting, setIsRequesting] = useState(false);
//   const [screenSharePermission, setScreenSharePermission] = useState(false);

//   //   const requestPermissions = async () => {
//   //     setIsRequesting(true);
//   //     try {
//   //       const stream = await navigator.mediaDevices.getUserMedia({
//   //         video: true,
//   //         audio: true,
//   //       });

//   //       // Check if we actually got the permissions
//   //       const videoTracks = stream.getVideoTracks();
//   //       const audioTracks = stream.getAudioTracks();

//   //       setCameraPermission(videoTracks.length > 0);
//   //       setMicrophonePermission(audioTracks.length > 0);

//   //       // Stop all tracks
//   //       stream.getTracks().forEach((track) => track.stop());

//   //       if (videoTracks.length > 0 && audioTracks.length > 0) {
//   //         onPermissionGranted();
//   //       }
//   //     } catch (err) {
//   //       console.error("Error requesting permissions:", err);
//   //       alert(
//   //         "Failed to get permissions. Please allow camera and microphone access."
//   //       );
//   //     } finally {
//   //       setIsRequesting(false);
//   //     }
//   //   };
//   const requestPermissions = async () => {
//     setIsRequesting(true);
//     try {
//       // Request camera and microphone
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       // Check permissions
//       const videoTracks = mediaStream.getVideoTracks();
//       const audioTracks = mediaStream.getAudioTracks();

//       setCameraPermission(videoTracks.length > 0);
//       setMicrophonePermission(audioTracks.length > 0);

//       // Try to get screen share permissions (doesn't actually request until used)
//       try {
//         // This is just to check if the API is available
//         // In a real app, you would call navigator.mediaDevices.getDisplayMedia()
//         // when you want to start screen sharing
//         const check = navigator.mediaDevices.getDisplayMedia;
//         setScreenSharePermission(true);
//       } catch {
//         setScreenSharePermission(false);
//       }

//       // Stop tracks
//       mediaStream.getTracks().forEach((track) => track.stop());

//       if (videoTracks.length > 0 && audioTracks.length > 0) {
//         onPermissionGranted();
//       }
//     } catch (err) {
//       console.error("Error requesting permissions:", err);
//     } finally {
//       setIsRequesting(false);
//     }
//   };
//   return (
//     <PermissionContainer>
//       <Title>Permissions Needed</Title>
//       <Description>
//         To start recording, we need access to your camera and microphone. Please
//         grant permissions when prompted.
//       </Description>

//       <PermissionItem className={cameraPermission ? "granted" : ""}>
//         {cameraPermission ? <FaCheck /> : <FaCamera />}
//         <PermissionText>
//           {cameraPermission ? "Camera Access Granted" : "Camera Access Needed"}
//         </PermissionText>
//       </PermissionItem>

//       <PermissionItem className={microphonePermission ? "granted" : ""}>
//         {microphonePermission ? <FaCheck /> : <FaMicrophone />}
//         <PermissionText>
//           {microphonePermission
//             ? "Microphone Access Granted"
//             : "Microphone Access Needed"}
//         </PermissionText>
//       </PermissionItem>

//       <PermissionItem className={screenSharePermission ? "granted" : ""}>
//         {screenSharePermission ? <FaCheck /> : <FaDesktop />}
//         <PermissionText>
//           {screenSharePermission
//             ? "Screen Share Available"
//             : "Screen Share Not Available"}
//         </PermissionText>
//       </PermissionItem>

//       <StartButton onClick={requestPermissions} disabled={isRequesting}>
//         {isRequesting ? "Requesting..." : "Grant Permissions"}
//       </StartButton>
//     </PermissionContainer>
//   );
// };

// export default PermissionPrompt;
import React, { useState } from "react";
import styled from "styled-components";
import { FaCamera, FaMicrophone, FaCheck, FaDesktop } from "react-icons/fa";

const PermissionContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &.granted {
    background: #e8f5e9;
    color: #2e7d32;
  }
`;

const PermissionText = styled.span`
  margin-left: 1rem;
  font-weight: 500;
`;

const StartButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  border-radius: 50px;
  margin-top: 1.5rem;
  font-weight: 600;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

interface PermissionPromptProps {
  onPermissionGranted: () => void;
}

const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  onPermissionGranted,
}) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [screenSharePermission, setScreenSharePermission] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermissions = async () => {
    setIsRequesting(true);
    try {
      // Request camera and microphone
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Check permissions
      const videoTracks = mediaStream.getVideoTracks();
      const audioTracks = mediaStream.getAudioTracks();

      setCameraPermission(videoTracks.length > 0);
      setMicrophonePermission(audioTracks.length > 0);

      // Check screen share availability
      try {
        try {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
          setScreenSharePermission(true);
        } catch {
          setScreenSharePermission(false);
        }
        setScreenSharePermission(true);
      } catch {
        setScreenSharePermission(false);
      }

      // Stop tracks
      mediaStream.getTracks().forEach((track) => track.stop());

      if (videoTracks.length > 0 && audioTracks.length > 0) {
        onPermissionGranted();
      }
    } catch (err) {
      console.error("Error requesting permissions:", err);
      alert(
        "Failed to get permissions. Please allow camera and microphone access."
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <PermissionContainer>
      <Title>Permissions Needed</Title>
      <Description>
        To start recording, we need access to your camera and microphone. Please
        grant permissions when prompted.
      </Description>

      <PermissionItem className={cameraPermission ? "granted" : ""}>
        {cameraPermission ? <FaCheck /> : <FaCamera />}
        <PermissionText>
          {cameraPermission ? "Camera Access Granted" : "Camera Access Needed"}
        </PermissionText>
      </PermissionItem>

      <PermissionItem className={microphonePermission ? "granted" : ""}>
        {microphonePermission ? <FaCheck /> : <FaMicrophone />}
        <PermissionText>
          {microphonePermission
            ? "Microphone Access Granted"
            : "Microphone Access Needed"}
        </PermissionText>
      </PermissionItem>

      <PermissionItem className={screenSharePermission ? "granted" : ""}>
        {screenSharePermission ? <FaCheck /> : <FaDesktop />}
        <PermissionText>
          {screenSharePermission
            ? "Screen Share Available"
            : "Screen Share Not Available"}
        </PermissionText>
      </PermissionItem>

      <StartButton onClick={requestPermissions} disabled={isRequesting}>
        {isRequesting ? "Requesting..." : "Grant Permissions"}
      </StartButton>
    </PermissionContainer>
  );
};

export default PermissionPrompt;
