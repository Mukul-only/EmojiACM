import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socketService } from "../services/socket.service";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import Timer from "../components/Timer";
import Scoreboard from "../components/Scoreboard";
import GameOver from "../components/GameOver";

type PlayerRole = "guesser" | "clue-giver" | null;

interface GameState {
  isRoundActive?: boolean;
  timeLeft?: number;
  movieToGuess?: string;
  movieTitle?: string;
  emojis?: string;
  message?: string;
  currentRound?: number;
  totalRounds?: number;
}

interface Guess {
  guesserName: string;
  guess: string;
}

const TOTAL_ROUNDS = 25;

const GamePage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [myRole, setMyRole] = useState<PlayerRole>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [gameState, setGameState] = useState<GameState>({});
  const [guess, setGuess] = useState("");
  const [guessHistory, setGuessHistory] = useState<Guess[]>([]);
  const [teamScore, setTeamScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

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

        socket.on("round_start", (data) => {
          if (user._id === data.clueGiverId) setMyRole("clue-giver");
          else if (user._id === data.guesserId) setMyRole("guesser");
          setGameState({ ...data, isRoundActive: true, message: "" });
          setGuessHistory([]);
        });

        socket.on("round_end", (data) => {
          setGameState((prev) => ({ ...prev, ...data, isRoundActive: false }));
          setMyRole(null);
          if (data.teamScore !== undefined) setTeamScore(data.teamScore);
        });

        socket.on("game_over", (data) => {
          setIsGameOver(true);
          if (data.teamScore !== undefined) setTeamScore(data.teamScore);
        });

        socket.on("score_update", (data) => {
          if (data.teamScore !== undefined) setTeamScore(data.teamScore);
        });

        socket.on("guess_result", ({ correct }) => {
          if (!correct) {
            setGameState((prev) => ({ ...prev, message: "Incorrect guess!" }));
          }
        });

        socket.on("new_incorrect_guess", (data: Guess) => {
          setGuessHistory((prev) => [...prev, data]);
        });

        socket.on("timer_tick", ({ timeLeft }) =>
          setGameState((prev) => ({ ...prev, timeLeft }))
        );
        socket.on("emoji_update", ({ emojis }) =>
          setGameState((prev) => ({ ...prev, emojis }))
        );
        socket.on("error", ({ message }) => {
          setError(message);
          setTimeout(() => setError(""), 3000);
        });
      })
      .catch((err) => {
        setError(`Failed to connect to game server: ${err.message}`);
        setTimeout(() => navigate("/"), 3000);
      });

    return () => {
      socketService.disconnect();
    };
  }, [navigate, token, user]);

  const handleStartRound = () => socketService.socket?.emit("start_round");
  const handleEmojiClick = (emojiData: EmojiClickData) =>
    socketService.socket?.emit("send_emoji", { emoji: emojiData.emoji });
  const handleDeleteEmoji = () =>
    socketService.socket?.emit("delete_last_emoji");
  const handleClearEmojis = () =>
    socketService.socket?.emit("clear_all_emojis");
  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess) {
      socketService.socket?.emit("submit_guess", { guess });
      setGuess("");
    }
  };

  const handleForfeitRequest = () => setShowForfeitConfirm(true);
  const handleCancelForfeit = () => setShowForfeitConfirm(false);
  const handleConfirmForfeit = () => {
    socketService.socket?.emit("forfeit_game");
    setShowForfeitConfirm(false);
  };

  if (!isConnected && !error) {
    return (
      <Layout>
        <p className="text-lg text-cyan-glow animate-pulse">
          Connecting to Game...
        </p>
      </Layout>
    );
  }

  if (isGameOver) {
    return (
      <Layout>
        <GameOver finalScore={teamScore} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-4xl p-8 space-y-6">
          {/* Background with gradient and glass effect */}
          <div className="absolute inset-0 bg-[#161B22]/70 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#7BFF66]/5 via-transparent to-purple-500/5 rounded-3xl"></div>

          {/* Forfeit Confirmation Modal */}
          {showForfeitConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="p-8 space-y-6 text-center bg-[#161B22] border border-red-500/30 rounded-2xl shadow-2xl max-w-sm mx-auto">
                <h2 className="text-2xl font-bold text-red-400">Forfeit Game?</h2>
                <p className="text-white/70">
                  Are you sure you want to forfeit? Your team's score will be set
                  to 0 and the game will end.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCancelForfeit}
                    className="px-6 py-3 font-semibold text-white transition-colors duration-200 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmForfeit}
                    className="px-6 py-3 font-semibold text-white transition-colors duration-200 bg-red-600 rounded-xl hover:bg-red-700"
                  >
                    Confirm Forfeit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative space-y-6">
            {error && (
              <div className="p-3 text-center text-red-400 border rounded-xl bg-red-500/10 animate-pulse border-red-500/20">
                {error}
              </div>
            )}

            <header className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-white/90 bg-clip-text">
                  Emoji Movie Guesser
                </h1>
                <p className="text-white/60">
                  Challenge your movie knowledge with emojis!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-6 py-3 text-center border bg-white/5 rounded-2xl border-white/10">
                  <p className="text-sm text-white/60">Round</p>
                  <p className="text-3xl font-bold text-[#7BFF66]">
                    {gameState.currentRound || 0}
                    <span className="text-white/30">/</span>
                    {gameState.totalRounds || TOTAL_ROUNDS}
                  </p>
                </div>
                <button
                  onClick={handleForfeitRequest}
                  className="px-4 py-2 text-sm font-semibold text-red-400 transition-colors duration-200 border border-red-500/30 rounded-xl bg-red-500/10 hover:bg-red-500/20"
                  title="Forfeit Game"
                >
                  Forfeit
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Game Info Section */}
              <div className="space-y-6">
                <div className="p-6 space-y-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="space-y-2">
                    <p className="text-sm text-white/60">
                      {myRole === "clue-giver"
                        ? "Your Movie"
                        : "Movie to Guess"}
                    </p>
                    <p className="p-3 font-mono text-2xl tracking-wider text-white border rounded-xl bg-white/5 border-white/10">
                      {myRole === "clue-giver"
                        ? gameState.movieTitle
                        : gameState.movieToGuess ?? "Waiting for round..."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white/60">Emoji Clues</p>
                    <div className="w-full bg-[#0A0C10] p-4 rounded-xl min-h-[6rem] flex items-center justify-center overflow-x-auto whitespace-nowrap border border-white/10">
                      <p className="text-6xl select-none">
                        {gameState.emojis || "?"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guess History */}
                {guessHistory.length > 0 && (
                  <div className="p-6 space-y-3 border rounded-2xl bg-white/5 border-white/10">
                    <h3 className="text-sm font-medium text-white/60">
                      {myRole === "clue-giver"
                        ? "Guesser's Attempts"
                        : "Your Previous Guesses"}
                    </h3>
                    <ul className="space-y-2">
                      {guessHistory.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 border rounded-lg bg-red-500/10 border-red-500/20"
                        >
                          <span className="text-red-400 line-through">
                            {item.guess}
                          </span>
                          {myRole === "clue-giver" && (
                            <span className="text-sm text-white/40">
                              by {item.guesserName}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Game Controls Section */}
              <div className="space-y-6">
                {/* Scoreboard with modern styling */}
                <div className="p-6 border rounded-2xl bg-white/5 border-white/10">
                  <Scoreboard teamScore={teamScore} />
                </div>

                {/* Role Badge */}
                {myRole && (
                  <div
                    className={`p-4 rounded-2xl border ${
                      myRole === "guesser"
                        ? "bg-[#7BFF66]/10 border-[#7BFF66]/20 text-[#7BFF66]"
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    } text-center font-medium`}
                  >
                    You are the{" "}
                    {myRole === "guesser" ? "Guesser" : "Clue-Giver"}
                  </div>
                )}

                {/* Game Controls */}
                <div className="p-6 space-y-4 border rounded-2xl bg-white/5 border-white/10">
                  {!gameState.isRoundActive ? (
                    <button
                      onClick={handleStartRound}
                      className="w-full py-4 font-bold text-[#0A0C10] bg-[#7BFF66] rounded-xl hover:shadow-lg hover:shadow-[#7BFF66]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      Start New Round
                    </button>
                  ) : myRole === "clue-giver" ? (
                    <div className="space-y-4">
                      <div className="overflow-hidden border rounded-xl border-white/10">
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          theme={Theme.DARK}
                          height={350}
                          width="100%"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={handleDeleteEmoji}
                          className="px-4 py-3 transition-colors duration-200 border rounded-xl bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                        >
                          Delete Last
                        </button>
                        <button
                          onClick={handleClearEmojis}
                          className="px-4 py-3 text-red-400 transition-colors duration-200 border rounded-xl bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleGuess} className="space-y-4">
                      <input
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Guess the movie!"
                        className="w-full px-4 py-4 text-white bg-[#0A0C10] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BFF66]/50 focus:border-[#7BFF66]/50 transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full py-4 font-bold text-[#0A0C10] bg-[#7BFF66] rounded-xl hover:shadow-lg hover:shadow-[#7BFF66]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      >
                        Submit Guess
                      </button>
                    </form>
                  )}

                  {gameState.message && (
                    <div className="p-3 mt-4 text-center border rounded-xl bg-white/5 border-white/10">
                      <p className="text-lg font-medium text-white/80">
                        {gameState.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer with updated styling */}
        {gameState.isRoundActive && (
          <div className="fixed transform -translate-x-1/2 bottom-8 left-1/2">
            <Timer timeLeft={gameState.timeLeft ?? 60} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GamePage;
