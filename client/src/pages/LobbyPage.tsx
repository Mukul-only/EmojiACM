import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socketService } from "../services/socket.service";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { FaUser } from "react-icons/fa";

interface Player {
  id: string;
  username: string;
  email: string;
  name: string;
  rollNumber: string;
  teamName?: string;
  isOnline: boolean;
  isReady?: boolean;
}

interface LobbyState {
  players: Player[];
  roomId: string;
  isHost: boolean;
  canStartGame: boolean;
  teamName?: string;
}

const LobbyPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [lobbyState, setLobbyState] = useState<LobbyState>({
    players: [],
    roomId: "",
    isHost: false,
    canStartGame: false,
    teamName: "",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      setError("User data is missing. Please log in again.");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    socketService
      .connect("/game", token)
      .then((socket) => {
        setIsConnected(true);

        // Listen for lobby updates
        socket.on("lobby_update", (data) => {
          setLobbyState(data);
        });

        // Listen for game start
        socket.on("game_start", () => {
          navigate("/game");
        });

        // Listen for player left
        socket.on("player_left", ({ username }) => {
          setLobbyState((prev) => ({
            ...prev,
            players: prev.players.filter((p) => p.username !== username),
            canStartGame: false,
          }));
        });

        // Listen for errors
        socket.on("error", ({ message }) => {
          setError(message);
          setTimeout(() => setError(""), 3000);
        });

        // Wait for the server to be ready, then request to join the lobby
        socket.on("ready_to_join", () => {
          socket.emit("join_lobby");
        });
      })
      .catch((err) => {
        setError(`Failed to connect to lobby: ${err.message}`);
        setTimeout(() => navigate("/"), 3000);
      });

    return () => {
      socketService.disconnect();
    };
  }, [navigate, token, user]);

  const handleStartGame = () => {
    if (lobbyState.canStartGame) {
      socketService.socket?.emit("start_game");
    }
  };

  const handleLeaveLobby = () => {
    socketService.socket?.emit("leave_lobby");
    navigate("/");
  };

  // --- NEW LOGIC ---
  // Identify the current user and the other player from the lobby state.
  // This is more reliable than using array indices.
  const currentPlayer = lobbyState.players.find(
    (p) => p.username === user?.username
  );
  const otherPlayer = lobbyState.players.find(
    (p) => p.username !== user?.username
  );
  // --- END NEW LOGIC ---

  if (!isConnected && !error) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BFF66] mx-auto mb-4"></div>
            <p className="text-lg text-cyan-glow">Connecting to Lobby...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="relative p-8 bg-[#161B22]/70 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7BFF66]/5 via-transparent to-purple-500/5 rounded-3xl"></div>
            <div className="relative space-y-8">
              {error && (
                <div className="p-4 text-center text-red-400 rounded-xl bg-red-500/10 animate-pulse">
                  {error}
                </div>
              )}
              <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-white/90 bg-clip-text">
                  Team Lobby
                </h1>
                <div className="space-y-2">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5">
                    <div className="w-2 h-2 bg-[#7BFF66] rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-white/80">
                      Team:{" "}
                      {lobbyState.teamName || user?.teamName || "Waiting..."}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">
                    Room ID: {lobbyState.roomId}
                  </div>
                </div>
              </div>

              {/* Players List */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                  {/* Player 1 (Current User) */}
                  <div className="flex justify-center text-center">
                    <div className="text-white">
                      <div
                        className={`flex items-center justify-center w-32 h-32 mb-2 rounded-full bg-white/10 border-4 transition-all duration-300 ${
                          currentPlayer?.isOnline
                            ? "border-[#7BFF66]"
                            : "border-transparent"
                        }`}
                      >
                        {currentPlayer ? (
                          <span className="text-4xl">
                            {(currentPlayer.name || "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        ) : (
                          <FaUser className="w-12 h-12 text-white/30" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-medium">
                          {currentPlayer?.name || "You"}
                        </p>
                        <p className="text-sm text-white/60">
                          Roll: {currentPlayer?.rollNumber || "-"}
                        </p>
                        {currentPlayer?.isOnline && (
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-[#7BFF66] rounded-full"></div>
                            <p className="text-sm text-[#7BFF66]">Ready</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Player 2 (Other Player) */}
                  <div className="flex justify-center text-center">
                    <div className="text-white">
                      <div
                        className={`flex items-center justify-center w-32 h-32 mb-2 rounded-full bg-white/10 border-4 transition-all duration-300 ${
                          otherPlayer?.isOnline
                            ? "border-[#7BFF66]"
                            : "border-transparent"
                        }`}
                      >
                        {otherPlayer ? (
                          <span className="text-4xl">
                            {(otherPlayer.name || "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        ) : (
                          <FaUser className="w-12 h-12 text-white/30" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-medium">
                          {otherPlayer?.name || "Waiting..."}
                        </p>
                        <p className="text-sm text-white/60">
                          Roll: {otherPlayer?.rollNumber || "-"}
                        </p>
                        {otherPlayer?.isOnline && (
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-[#7BFF66] rounded-full"></div>
                            <p className="text-sm text-[#7BFF66]">Ready</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Controls */}
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                {lobbyState.canStartGame && (
                  <button
                    onClick={handleStartGame}
                    className="px-8 py-4 font-bold text-[#0A0C10] bg-[#7BFF66] rounded-xl hover:shadow-lg hover:shadow-[#7BFF66]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Start Game
                  </button>
                )}
                <button
                  onClick={handleLeaveLobby}
                  className="px-8 py-4 font-bold text-white transition-all duration-300 bg-white/10 rounded-xl hover:bg-white/20"
                >
                  Leave Lobby
                </button>
              </div>

              {/* Status Message */}
              <div className="text-center">
                {lobbyState.players.length === 2 ? (
                  <p className="text-lg text-[#7BFF66]">Ready to start!</p>
                ) : (
                  <p className="text-lg text-white/60">
                    Waiting for your teammate...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LobbyPage;
