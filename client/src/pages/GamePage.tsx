import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socketService } from "../services/socket.service";
import { useAuth } from "../hooks/useAuth";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { Categories } from "emoji-picker-react";
import {
  MdDelete,
  MdDeleteSweep,
  MdAddCircleOutline,
  MdLocalMovies,
  MdFlag,
  MdPlayArrow,
  MdClose,
  MdMenu,
  MdLightbulb,
} from "react-icons/md";
import GameOver from "../components/GameOver";
// Import rule images
import rule1Image from "../assets/rules/rule1.png";
import rule2Image from "../assets/rules/rule2.png";
import rule3Image from "../assets/rules/rule3.png";
import rule4Image from "../assets/rules/rule4.png";

type PlayerRole = "guesser" | "clue-giver" | null;

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  genre: string[];
  difficulty: "easy" | "medium" | "hard";
  description?: string;
}

interface GameState {
  isRoundActive?: boolean;
  timeLeft?: number;
  movieToGuess?: string;
  movieTitle?: string;
  movieData?: Movie;
  icons?: string[];
  message?: string;
  currentRound?: number;
  totalRounds?: number;
}

interface Guess {
  guesserName: string;
  guess: string;
}

const TOTAL_ROUNDS = 14;

// Enhanced Timer component with circular progress (supports 120 seconds)
const HudTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const percentage = (timeLeft / 120) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Updated color thresholds for 120 seconds
  const color =
    percentage > 50 ? "#10b981" : percentage > 25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-mono text-lg font-bold">{timeLeft}s</span>
    </div>
  );
};

// Enhanced Guess History with animations and open/close functionality
const GuessHistoryLog: React.FC<{
  history: Guess[];
  isRoundActive: boolean;
}> = ({ history, isRoundActive }) => {
  const logRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history]);

  // Hide when round ends
  if (!isRoundActive || history.length === 0) return null;

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed p-3 transition-all duration-200 border shadow-2xl top-28 left-6 rounded-xl bg-gray-900/95 backdrop-blur-xl border-white/10 hover:bg-gray-800/95 hover:scale-105"
          title="Show Incorrect Guesses"
        >
          <MdMenu className="text-2xl text-white" />
        </button>
      )}

      {/* Guess History Panel */}
      {isOpen && (
        <div className="fixed top-28 left-6 w-72 max-h-[60vh] overflow-hidden rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-slideIn">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              INCORRECT GUESSES
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 transition-all duration-200 rounded-lg hover:bg-white/10"
              title="Close"
            >
              <MdClose className="text-xl text-white/70 hover:text-white" />
            </button>
          </div>
          <ul
            ref={logRef}
            className="p-4 space-y-2 overflow-y-auto max-h-96 custom-scrollbar"
          >
            {history.map((item, index) => (
              <li
                key={index}
                className="px-3 py-2 text-sm font-medium text-red-300 line-through transition-all duration-200 border rounded-lg bg-red-500/10 border-red-500/20 animate-fadeIn"
              >
                {item.guess}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

// Enhanced Emoji Display with better styling and intelligent scrolling
const EmojiDisplay: React.FC<{ icons: string[] }> = ({ icons }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden border shadow-2xl bg-gray-800/80 backdrop-blur-xl rounded-3xl border-white/10">
        <div className="p-8 max-h-[40vh] overflow-y-auto emoji-scrollbar">
          {icons && icons.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-4 min-h-[150px]">
              {icons.map((icon, index) => (
                <span
                  key={index}
                  className="text-6xl transition-transform duration-200 hover:scale-110 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {icon}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-xl text-white/30 animate-pulse">
                Waiting for clues...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Rules Carousel Component
const RulesCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const rules = [
    {
      image: rule1Image,
      title: "Team Size",
      description: "2 players per team - team up for double the fun!",
    },
    {
      image: rule2Image,
      title: "Game Flow",
      description: "One teammate sends emojis, the other guesses movie names.",
    },
    {
      image: rule3Image,
      title: "Time Limit",
      description: "120 seconds per round to guess the movie!",
    },
    {
      image: rule4Image,
      title: "Core Rule",
      description: "Only emojis allowed - no words, letters, or numbers!",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rules.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [rules.length]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative p-8 overflow-hidden border shadow-2xl bg-gray-800/50 backdrop-blur-2xl rounded-3xl border-white/10">
        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-white to-[#7BFF66] bg-clip-text">
          Game Rules
        </h2>

        {/* Carousel */}
        <div className="relative h-80">
          {rules.map((rule, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative w-48 h-48 overflow-hidden border-4 rounded-2xl border-[#7BFF66]/30">
                  <img
                    src={rule.image}
                    alt={rule.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-center">
                  <h3 className="mb-3 text-2xl font-bold text-white">
                    {rule.title}
                  </h3>
                  <p className="max-w-md text-lg text-gray-300">
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {rules.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#7BFF66] w-8"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Auto-start Countdown Timer Component
const AutoStartCountdown: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onStart();
    }
  }, [countdown, onStart]);

  const percentage = (countdown / 10) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#7BFF66"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-5xl font-bold text-[#7BFF66]">{countdown}</div>
          <div className="text-sm text-white/60">seconds</div>
        </div>
      </div>
      <p className="text-xl font-semibold text-white/90">
        Next round starting...
      </p>
      <button
        onClick={onStart}
        className="flex items-center gap-2 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 transform bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
      >
        <MdPlayArrow className="text-2xl" />
        <span>Start Now</span>
      </button>
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
  const [showIconPicker, setShowIconPicker] = useState(false);

  console.log(teamScore);

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
          setGameState((prev) => ({
            ...prev,
            ...data,
            isRoundActive: true,
            message: "",
            icons: [], // Clear emojis when new round starts
          }));
          setGuessHistory([]);
          setShowIconPicker(false);
        });

        socket.on("clue_giver_data", (data) => {
          setGameState((prev) => ({
            ...prev,
            movieTitle: data.movieTitle,
            movieData: data.movieData,
          }));
        });

        socket.on("round_end", (data) => {
          setGameState((prev) => ({
            ...prev,
            ...data,
            isRoundActive: false,
            movieTitle: "",
            movieData: null,
          }));
          setMyRole(null);
          if (data.teamScore !== undefined) setTeamScore(data.teamScore);
        });

        socket.on("game_over", () => {
          setIsGameOver(true);
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
        socket.on("icon_update", ({ icons }) =>
          setGameState((prev) => ({ ...prev, icons }))
        );
        socket.on("roles_switched", ({ clueGiverId, guesserId }) => {
          if (user._id === clueGiverId) setMyRole("clue-giver");
          else if (user._id === guesserId) setMyRole("guesser");
        });
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

  // FIXED: Don't close picker after selecting emoji
  const handleIconClick = (emojiData: EmojiClickData) => {
    setGameState((prev) => ({
      ...prev,
      icons: [...(prev.icons || []), emojiData.emoji],
    }));
    socketService.socket?.emit("send_icon", { icon: emojiData.emoji });
    // Removed setShowIconPicker(false) so modal stays open
  };

  const handleDeleteIcon = () => socketService.socket?.emit("delete_last_icon");
  const handleClearIcons = () => socketService.socket?.emit("clear_all_icons");
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
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-xl font-semibold text-white animate-pulse">
            Connecting to Game...
          </p>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return <GameOver />;
  }

  const renderActionArea = () => {
    if (!gameState.isRoundActive) {
      // Show auto-start countdown if game has started (currentRound > 0)
      if (gameState.currentRound && gameState.currentRound > 0) {
        return <AutoStartCountdown onStart={handleStartRound} />;
      }
      // Show manual start button for first round
      return (
        <button
          onClick={handleStartRound}
          className="relative flex items-center gap-3 px-12 py-4 overflow-hidden text-xl font-bold text-white transition-all duration-300 transform bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 group"
        >
          <MdPlayArrow className="text-3xl" />
          <span className="relative z-10">Start Game</span>
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:opacity-100"></div>
        </button>
      );
    }

    if (myRole === "clue-giver") {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIconPicker(true)}
            className="flex items-center gap-2 px-8 py-3 font-semibold transition-all duration-200 transform border text-white/90 bg-gray-800/80 rounded-xl hover:bg-gray-700/80 hover:border-white/50 hover:scale-105 border-white/30"
            title="Add Emoji"
          >
            <MdAddCircleOutline className="text-xl" />
            <span>Add Emoji</span>
          </button>
          <button
            onClick={handleDeleteIcon}
            className="flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 transform border text-white/90 bg-gray-800/80 rounded-xl hover:bg-gray-700/80 hover:border-white/50 hover:scale-105 border-white/30"
            title="Delete Last Emoji"
          >
            <MdDelete className="text-xl" />
            <span>Delete Last</span>
          </button>
          <button
            onClick={handleClearIcons}
            className="flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 transform border text-white/90 bg-gray-800/80 rounded-xl hover:bg-gray-700/80 hover:border-white/50 hover:scale-105 border-white/30"
            title="Clear All Emojis"
          >
            <MdDeleteSweep className="text-xl" />
            <span>Clear All</span>
          </button>
        </div>
      );
    }

    if (myRole === "guesser") {
      return (
        <form onSubmit={handleGuess} className="flex w-full max-w-2xl gap-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your movie guess..."
            className="flex-1 px-6 py-4 text-lg text-white transition-all duration-200 border-2 bg-white/5 backdrop-blur-sm border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 placeholder:text-white/40"
            autoFocus
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 text-lg font-semibold transition-all duration-200 transform border text-white/90 bg-gray-800/80 rounded-xl hover:bg-gray-700/80 hover:border-white/50 hover:scale-105 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!guess.trim()}
          >
            <MdLightbulb className="text-2xl" />
            <span>Guess</span>
          </button>
        </form>
      );
    }

    return null;
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden font-sans text-white bg-gray-950">
      {/* Forfeit Modal */}
      {showForfeitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md p-8 mx-4 space-y-6 text-center bg-gray-900 border shadow-2xl border-red-500/30 rounded-3xl animate-scaleIn">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/20">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-bold text-red-400">Forfeit Game?</h2>
            <p className="text-lg text-gray-300">
              Your team's score will be set to 0 and the game will end
              immediately.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={handleCancelForfeit}
                className="px-8 py-3 font-semibold text-white transition-all duration-200 transform border-2 border-white/30 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmForfeit}
                className="px-8 py-3 font-semibold text-white transition-all duration-200 transform bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
              >
                Confirm Forfeit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED: Emoji Picker Modal with Emoji Display */}
      {showIconPicker && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-end p-4 pb-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowIconPicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl flex flex-col gap-4 max-h-[calc(100vh-3rem)]"
          >
            {/* Current Emojis Display */}
            <div className="flex-shrink-0 animate-slideDown">
              <EmojiDisplay icons={gameState.icons || []} />
            </div>

            {/* Emoji Picker */}
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-900 rounded-2xl animate-slideUp">
              <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">
                  Choose Emojis
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIcon();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-200 border rounded-lg text-white/90 border-white/30 bg-gray-800/80 hover:bg-gray-700/80 hover:border-white/50 hover:scale-105"
                    title="Delete Last Emoji"
                  >
                    <MdDelete className="text-lg" />
                    <span>Delete Last</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearIcons();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-200 border rounded-lg text-white/90 border-white/30 bg-gray-800/80 hover:bg-gray-700/80 hover:border-white/50 hover:scale-105"
                    title="Clear All Emojis"
                  >
                    <MdDeleteSweep className="text-lg" />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={() => setShowIconPicker(false)}
                    className="px-4 py-2 text-sm font-semibold text-white transition-all duration-200 border rounded-lg border-white/20 bg-white/10 hover:bg-white/20"
                  >
                    Done
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <EmojiPicker
                  onEmojiClick={handleIconClick}
                  theme={Theme.DARK}
                  height="100%"
                  width="100%"
                  categories={[
                    {
                      category: Categories.SMILEYS_PEOPLE,
                      name: "Recently Used",
                    },
                    {
                      category: Categories.SMILEYS_PEOPLE,
                      name: "Smileys & People",
                    },
                    {
                      category: Categories.ANIMALS_NATURE,
                      name: "Animals & Nature",
                    },
                    {
                      category: Categories.FOOD_DRINK,
                      name: "Food & Drink",
                    },
                    {
                      category: Categories.TRAVEL_PLACES,
                      name: "Travel & Places",
                    },
                    {
                      category: Categories.ACTIVITIES,
                      name: "Activities",
                    },
                    {
                      category: Categories.OBJECTS,
                      name: "Objects",
                    },
                    {
                      category: Categories.FLAGS,
                      name: "Flags",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top HUD */}
      <header className="relative z-10 flex items-center justify-between w-full px-8 py-4 border-b bg-gray-900/50 backdrop-blur-xl border-white/10">
        <div className="flex items-center gap-6">
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <MdLocalMovies className="text-3xl text-[#7BFF66]" />
            <span>Emoji Guesser</span>
          </h1>
          <button
            onClick={handleForfeitRequest}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 transition-all duration-200 border-2 rounded-lg border-red-500/30 bg-red-500/10 backdrop-blur-sm hover:bg-red-500/20 hover:scale-105"
          >
            <MdFlag className="text-lg" />
            <span>Forfeit Game</span>
          </button>
        </div>
        <div className="flex items-center gap-10">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-white/50">
              ROUND
            </p>
            <p className="text-3xl font-bold">
              {gameState.currentRound || 0}
              <span className="text-xl text-white/30">
                /{gameState.totalRounds || TOTAL_ROUNDS}
              </span>
            </p>
          </div>
          {gameState.isRoundActive && (
            <HudTimer timeLeft={gameState.timeLeft ?? 90} />
          )}
        </div>
      </header>

      {/* Main Game Board */}
      <main className="relative flex flex-col items-center flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Show Rules Carousel when game hasn't started */}
        {!gameState.isRoundActive &&
          (!gameState.currentRound || gameState.currentRound === 0) && (
            <div className="w-full animate-fadeIn">
              <RulesCarousel />
            </div>
          )}

        {/* Role Badge */}
        {myRole && (
          <div
            className={`px-6 py-2 rounded-full font-semibold text-sm backdrop-blur-sm border-2 ${
              myRole === "clue-giver"
                ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                : "bg-green-500/20 border-green-400/50 text-green-300"
            }`}
          >
            {myRole === "clue-giver" ? "🎨 Clue Giver" : "🔍 Guesser"}
          </div>
        )}

        {/* Clue Giver's Movie - Poster and Details Separately */}
        {myRole === "clue-giver" && gameState.movieData && (
          <div className="w-full max-w-6xl px-4 animate-fadeIn">
            <p className="mb-6 text-sm font-semibold tracking-wider text-center text-white/60">
              YOUR MOVIE
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Movie Poster */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm overflow-hidden border shadow-2xl rounded-2xl border-white/20 bg-gradient-to-br from-slate-900 to-slate-800">
                  <div className="relative aspect-[2/3] w-full">
                    <img
                      src={gameState.movieData.posterUrl}
                      alt={`${gameState.movieData.title} movie poster`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        // Set canvas size (2:3 aspect ratio)
                        canvas.width = 600;
                        canvas.height = 900;

                        if (ctx) {
                          // Create gradient background
                          const gradient = ctx.createLinearGradient(
                            0,
                            0,
                            0,
                            canvas.height
                          );
                          gradient.addColorStop(0, "#1a1a2e");
                          gradient.addColorStop(1, "#16213e");
                          ctx.fillStyle = gradient;
                          ctx.fillRect(0, 0, canvas.width, canvas.height);

                          // Add decorative elements
                          ctx.strokeStyle = "rgba(123, 255, 102, 0.2)";
                          ctx.lineWidth = 4;
                          ctx.beginPath();
                          ctx.moveTo(50, 50);
                          ctx.lineTo(canvas.width - 50, 50);
                          ctx.lineTo(canvas.width - 50, canvas.height - 50);
                          ctx.lineTo(50, canvas.height - 50);
                          ctx.lineTo(50, 50);
                          ctx.stroke();

                          // Add main title text
                          ctx.fillStyle = "#7BFF66";
                          ctx.font = "bold 60px sans-serif";
                          ctx.textAlign = "center";
                          ctx.fillText(
                            "INFOTREK'25",
                            canvas.width / 2,
                            canvas.height / 2 - 60
                          );

                          ctx.fillStyle = "white";
                          ctx.font = "bold 48px sans-serif";
                          ctx.fillText(
                            "NITT",
                            canvas.width / 2,
                            canvas.height / 2
                          );

                          ctx.fillStyle = "#7BFF66";
                          ctx.font = "bold 36px sans-serif";
                          ctx.fillText(
                            "EmojiCharades",
                            canvas.width / 2,
                            canvas.height / 2 + 60
                          );

                          // Add movie title
                          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                          ctx.font = "24px sans-serif";

                          // Word wrap the movie title
                          const words = gameState.movieData?.title.split(" ");
                          let line = "";
                          let y = canvas.height / 2 + 150;
                          words?.forEach((word) => {
                            const testLine = line + word + " ";
                            const metrics = ctx.measureText(testLine);
                            if (metrics.width > canvas.width - 100) {
                              ctx.fillText(line, canvas.width / 2, y);
                              line = word + " ";
                              y += 30;
                            } else {
                              line = testLine;
                            }
                          });
                          ctx.fillText(line, canvas.width / 2, y);

                          // Add emoji decoration
                          ctx.font = "40px sans-serif";
                          ctx.fillText(
                            "🎬 🎭 🎪",
                            canvas.width / 2,
                            canvas.height - 100
                          );
                        }

                        target.src = canvas.toDataURL();
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="flex flex-col justify-center p-6 space-y-6 border bg-gray-800/50 backdrop-blur-xl rounded-2xl border-white/10">
                <div>
                  <h2 className="mb-2 text-4xl font-bold text-white">
                    {gameState.movieData.title}
                  </h2>
                  <div className="flex items-center gap-3 text-lg text-white/80">
                    <span className="px-3 py-1 rounded-full bg-white/20">
                      {gameState.movieData.year}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        gameState.movieData.difficulty === "easy"
                          ? "bg-green-500/20 text-green-400"
                          : gameState.movieData.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {gameState.movieData.difficulty.charAt(0).toUpperCase() +
                        gameState.movieData.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold tracking-wider text-white/60">
                    GENRES
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gameState.movieData.genre.map((genre, index) => (
                      <span
                        key={index}
                        className="text-sm bg-[#7BFF66]/20 text-[#7BFF66] px-3 py-1 rounded-full font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {gameState.movieData.description && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold tracking-wider text-white/60">
                      DESCRIPTION
                    </h3>
                    <p className="text-base leading-relaxed text-white/80">
                      {gameState.movieData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Emoji Display - SHOWN FOR BOTH ROLES */}
        {gameState.isRoundActive && !showIconPicker && (
          <div className="w-full max-w-4xl animate-fadeIn">
            <EmojiDisplay icons={gameState.icons || []} />
          </div>
        )}

        {/* Hidden Letters Display for Guesser */}
        {myRole === "guesser" && gameState.isRoundActive && (
          <div className="text-center animate-fadeIn">
            <p className="mb-2 text-sm font-semibold tracking-wider text-white/60">
              GUESS THE MOVIE
            </p>
            <p className="font-mono text-5xl font-bold tracking-widest text-white/90">
              {gameState.movieToGuess ?? "..."}
            </p>
          </div>
        )}

        {/* Status Message */}
        {gameState.message && (
          <div className="px-6 py-3 border-2 bg-white/5 backdrop-blur-sm border-white/20 rounded-2xl animate-fadeIn">
            <p className="text-lg font-semibold text-white/90">
              {gameState.message}
            </p>
          </div>
        )}
      </main>

      {/* Guess History */}
      <GuessHistoryLog
        history={guessHistory}
        isRoundActive={gameState.isRoundActive || false}
      />

      {/* Bottom Action Bar */}
      <footer className="relative z-10 flex items-center justify-center w-full py-6 border-t bg-gray-900/50 backdrop-blur-xl border-white/10">
        {renderActionArea()}
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .emoji-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .emoji-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin: 8px;
        }
        .emoji-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(123, 255, 102, 0.4), rgba(123, 255, 102, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .emoji-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(123, 255, 102, 0.6), rgba(123, 255, 102, 0.8));
        }
      `}</style>
    </div>
  );
};

export default GamePage;
