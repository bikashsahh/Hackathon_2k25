import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import LoginPage from "./components/LoginPage";
import { globalStyles } from "./styles/Global";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <Router>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Routes>
    </Router>
    // <ProfilePage />
    // <DashboardPage />
  );
}
export default App;
