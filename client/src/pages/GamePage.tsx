import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socketService } from "../services/socket.service";
import { useAuth } from "../hooks/useAuth";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
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

// New Timer component for the HUD
const HudTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const percentage = (timeLeft / 60) * 100;
  const color = percentage > 50 ? "bg-green-500" : percentage > 25 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="w-24 h-full flex items-center justify-center">
      <div className="w-full bg-white/10 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="ml-3 font-mono text-lg font-bold">{timeLeft}s</span>
    </div>
  );
};

// New Guess History Log
const GuessHistoryLog: React.FC<{ history: Guess[] }> = ({ history }) => {
  const logRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 w-64 h-3/4 bg-black/30 backdrop-blur-sm rounded-lg p-3 overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-white/50 border-b border-white/10 pb-2 mb-2">Guess History</h3>
      <ul ref={logRef} className="flex-grow overflow-y-auto space-y-2 pr-2">
        {history.map((item, index) => (
          <li key={index} className="text-sm text-red-400/80 line-through bg-red-500/10 rounded-md px-2 py-1">
            {item.guess}
          </li>
        ))}
      </ul>
    </div>
  );
};

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
          setShowEmojiPicker(false);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg text-cyan-400 animate-pulse">Connecting to Game...</p>
      </div>
    );
  }

  if (isGameOver) {
    return <GameOver finalScore={teamScore} />;
  }

  const renderActionArea = () => {
    if (!gameState.isRoundActive) {
      return (
        <button
          onClick={handleStartRound}
          className="w-full max-w-md py-4 font-bold text-gray-900 bg-green-400 rounded-xl text-xl hover:bg-green-300 transition-all duration-300 shadow-lg shadow-green-400/20"
        >
          Start New Round
        </button>
      );
    }

    if (myRole === "clue-giver") {
      return (
        <div className="flex items-center gap-4">
          <button onClick={() => setShowEmojiPicker(true)} className="px-6 py-3 font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors">Add Emoji</button>
          <button onClick={handleDeleteEmoji} className="px-6 py-3 font-semibold text-white bg-white/10 rounded-xl hover:bg-white/20 transition-colors">Delete Last</button>
          <button onClick={handleClearEmojis} className="px-6 py-3 font-semibold text-white bg-red-500/80 rounded-xl hover:bg-red-600 transition-colors">Clear All</button>
        </div>
      );
    }

    if (myRole === "guesser") {
      return (
        <form onSubmit={handleGuess} className="w-full max-w-lg flex gap-2">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Guess the movie..."
            className="w-full px-4 py-4 text-white bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
          />
          <button
            type="submit"
            className="px-8 py-4 font-bold text-gray-900 bg-green-400 rounded-xl hover:bg-green-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!guess.trim()}
          >
            Submit
          </button>
        </form>
      );
    }

    return null;
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black"></div>
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-green-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

      {/* Forfeit Modal */}
      {showForfeitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="p-8 space-y-6 text-center bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-red-400">Forfeit Game?</h2>
            <p className="text-gray-300">
              Are you sure you want to forfeit? Your team's score will be set to 0 and the game will end.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancelForfeit} className="px-6 py-3 font-semibold text-white transition-colors duration-200 border border-white/20 rounded-xl bg-white/10 hover:bg-white/20">Cancel</button>
              <button onClick={handleConfirmForfeit} className="px-6 py-3 font-semibold text-white transition-colors duration-200 bg-red-600 rounded-xl hover:bg-red-700">Confirm Forfeit</button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowEmojiPicker(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-t-2xl">
            <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} height={350} width="100%" />
          </div>
        </div>
      )}

      {/* Top HUD */}
      <header className="relative w-full px-6 h-20 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Emoji Guesser</h1>
          <button onClick={handleForfeitRequest} className="px-3 py-1 text-xs font-semibold text-red-400 transition-colors duration-200 border border-red-500/30 rounded-lg bg-red-500/10 hover:bg-red-500/20" title="Forfeit Game">Forfeit</button>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-xs text-white/60">SCORE</p>
            <p className="text-2xl font-bold text-green-400">{teamScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60">ROUND</p>
            <p className="text-2xl font-bold">{gameState.currentRound || 0}<span className="text-white/30">/{gameState.totalRounds || TOTAL_ROUNDS}</span></p>
          </div>
          {gameState.isRoundActive && <HudTimer timeLeft={gameState.timeLeft ?? 60} />}
        </div>
      </header>

      {/* Main Game Board */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        {myRole === 'clue-giver' && (
          <div className="absolute top-4 text-center">
            <p className="text-sm text-white/60">Your movie to describe:</p>
            <p className="text-2xl font-bold text-yellow-400">{gameState.movieTitle}</p>
          </div>
        )}

        <div className="text-center">
          <p className="font-mono text-3xl tracking-widest text-white/80 mb-4">
            {myRole !== 'clue-giver' ? (gameState.movieToGuess ?? '...') : ' '}
          </p>
          <div className="w-full bg-black/20 p-8 rounded-xl min-h-[8rem] flex items-center justify-center border border-white/10">
            <p className="text-7xl select-none tracking-wider">
              {gameState.emojis || <span className="text-white/20">Waiting for clues...</span>}
            </p>
          </div>
        </div>

        {gameState.message && (
          <div className="p-3 mt-4 text-center border rounded-xl bg-white/5 border-white/10">
            <p className="text-lg font-medium text-white/80">{gameState.message}</p>
          </div>
        )}
      </main>

      {/* Guess History Log */}
      {guessHistory.length > 0 && <GuessHistoryLog history={guessHistory} />}

      {/* Bottom Action Bar */}
      <footer className="relative w-full h-24 flex items-center justify-center bg-black/20 backdrop-blur-md border-t border-white/10 z-10">
        {renderActionArea()}
      </footer>
    </div>
  );
};

export default GamePage;