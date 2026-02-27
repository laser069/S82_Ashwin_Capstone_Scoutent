import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage"
import SignUpPage from "./pages/signup";
import LoginPage from "./pages/loginpage";
import PlayerHomePage from "./pages/playerHomepage";
import ScoutHomePage from "./pages/scoutHomepage";
import ScoutDashboardPage from "./pages/scoutDashboard";
import MessagesPage from "./pages/MessagesPage";
import ScoutPointPage from "./pages/scoutpoint";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/playerhomepage" element={<PlayerHomePage />} />
        {/* Scout dashboard — no upload, scout-appropriate cards */}
        <Route path="/scouthomepage" element={<ScoutDashboardPage />} />
        {/* Scout discovery feed */}
        <Route path="/feed" element={<ScoutHomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:userId" element={<MessagesPage />} />
        <Route path="/scoutpoint" element={<ScoutPointPage />} />
      </Routes>
    </Router>
  );
}

export default App;
