import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { IconProvider } from "./contexts/IconContext";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <IconProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </IconProvider>
    </AuthProvider>
  );
}

export default App;
