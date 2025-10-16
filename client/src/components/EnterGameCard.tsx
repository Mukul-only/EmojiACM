import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const EnterGameCard = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleEnterGame = async () => {
    setIsLoading(true);
    setStatusMessage("");
    try {
      // Navigate directly to lobby instead of checking eligibility
      navigate("/lobby");
    } catch (error: any) {
      setStatusMessage(
        error.response?.data?.message || "Failed to enter lobby."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Welcome, {user?.username}!</h2>
      <p>Ready to guess the movie from emojis?</p>
      <button
        onClick={handleEnterGame}
        disabled={isLoading}
        className="w-full px-4 py-3 text-lg font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? "Loading..." : "Join Lobby"}
      </button>
      {statusMessage && <p className="mt-4 text-red-500">{statusMessage}</p>}
      <button
        onClick={logout}
        className="mt-4 text-sm text-gray-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default EnterGameCard;
