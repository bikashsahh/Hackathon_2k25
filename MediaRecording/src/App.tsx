// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import InterviewSetup from "./components/InterviewSetup";
// import InterviewRecorder from "./components/InterviewRecorder";
// import GlobalStyles from "./GlobalStyles";
// import InterviewRecordings from "./components/InterviewRecording";

// const AppContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;
//   background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//   font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
// `;

// const Header = styled.header`
//   padding: 1.5rem;
//   text-align: center;
//   background: rgba(255, 255, 255, 0.2);
//   backdrop-filter: blur(10px);
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   border-bottom: 1px solid rgba(0, 0, 0, 0.1);
// `;

// const Title = styled.h1`
//   margin: 0;
//   color: #2c3e50;
//   font-size: 2rem;
//   font-weight: 600;
// `;

// const Main = styled.main`
//   flex: 1;
//   padding: 2rem;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const Footer = styled.footer`
//   padding: 1rem;
//   text-align: center;
//   background: rgba(255, 255, 255, 0.2);
//   backdrop-filter: blur(10px);
//   font-size: 0.9rem;
//   color: #7f8c8d;
// `;

// export interface InterviewRecording {
//   id: string;
//   candidateName: string;
//   position: string;
//   date: Date;
//   videoUrl: string;
//   thumbnailUrl: string;
//   duration: number;
// }

// export type InterviewMode = "setup" | "recording" | "recordings";

// const App: React.FC = () => {
//   const [mode, setMode] = useState<InterviewMode>("setup");
//   const [recordings, setRecordings] = useState<InterviewRecording[]>([]);
//   const [interviewDetails, setInterviewDetails] = useState({
//     candidateName: "",
//     position: "",
//   });

//   useEffect(() => {
//     const savedRecordings = localStorage.getItem("interviewRecordings");
//     if (savedRecordings) {
//       try {
//         const parsed: InterviewRecording[] = JSON.parse(savedRecordings);
//         setRecordings(
//           parsed.map((r) => ({
//             ...r,
//             date: new Date(r.date),
//           }))
//         );
//       } catch (err) {
//         console.error("Error loading recordings:", err);
//       }
//     }
//   }, []);

//   const saveRecording = (recording: InterviewRecording) => {
//     const updatedRecordings = [recording, ...recordings];
//     setRecordings(updatedRecordings);
//     localStorage.setItem(
//       "interviewRecordings",
//       JSON.stringify(updatedRecordings)
//     );
//   };

//   const deleteRecording = (id: string) => {
//     const updated = recordings.filter((r) => r.id !== id);
//     setRecordings(updated);
//     localStorage.setItem("interviewRecordings", JSON.stringify(updated));
//   };

//   return (
//     <>
//       <GlobalStyles />
//       <AppContainer>
//         <Header>
//           <Title>Interview Recording System</Title>
//         </Header>
//         <Main>
//           {mode === "setup" && (
//             <InterviewSetup
//               onStart={(details) => {
//                 setInterviewDetails(details);
//                 setMode("recording");
//               }}
//               onViewRecordings={() => setMode("recordings")}
//             />
//           )}
//           {mode === "recording" && (
//             <InterviewRecorder
//               candidateName={interviewDetails.candidateName}
//               position={interviewDetails.position}
//               onSave={saveRecording}
//               onCancel={() => setMode("setup")}
//             />
//           )}
//           {mode === "recordings" && (
//             <InterviewRecordings
//               recordings={recordings}
//               onBack={() => setMode("setup")}
//               onDelete={deleteRecording}
//             />
//           )}
//         </Main>
//         <Footer>
//           <p>
//             © {new Date().getFullYear()} Interview Recording System |
//             Professional Edition
//           </p>
//         </Footer>
//       </AppContainer>
//     </>
//   );
// };

// export default App;

import ScreenRecorder from "./components/ScreenRecoder";
function App() {
  return (
    <div>
      <ScreenRecorder />
    </div>
  );
}

export default App;
