import React from "react";
import { socketService } from "../services/socket.service";
import { MdSwapHoriz } from "react-icons/md";

interface GameBoardProps {
  gameState: {
    isRoundActive?: boolean;
    movieToGuess?: string;
    timeLeft?: number;
    currentRound?: number;
    totalRounds?: number;
    icons?: string[];
  };
  myRole: "clue-giver" | "guesser" | null;
  onSubmitGuess: (guess: string) => void;
  teamScore: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  myRole,
  teamScore,
}) => {
  const handleSwitchRoles = () => {
    socketService.socket?.emit("switch_roles");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-6 p-6">
      {/* Game Status */}
      <div className="flex items-center justify-between w-full p-4 border rounded-xl bg-gray-800/50 border-white/20">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-medium text-white/60">Round</p>
            <p className="text-2xl font-bold">
              {gameState.currentRound}/{gameState.totalRounds}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">Score</p>
            <p className="text-2xl font-bold text-green-400">{teamScore}</p>
          </div>
        </div>

        {/* Role Badge and Switch Button */}
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              myRole === "clue-giver"
                ? "bg-blue-500/20 text-blue-300"
                : "bg-green-500/20 text-green-300"
            }`}
          >
            {myRole === "clue-giver" ? "🎨 Clue Giver" : "🔍 Guesser"}
          </div>
          {!gameState.isRoundActive && (
            <button
              onClick={handleSwitchRoles}
              className="flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 border rounded-full text-white/90 bg-gray-700/50 border-white/20 hover:bg-gray-600/50"
              title="Switch Roles"
            >
              <MdSwapHoriz className="text-xl" />
              <span>Switch Roles</span>
            </button>
          )}
        </div>
      </div>

      {/* Timer */}
      {gameState.isRoundActive && (
        <div className="w-full">
          {/* <Timer timeLeft={gameState.timeLeft || 0} /> */}
        </div>
      )}

      {/* Emoji Display Area */}
      <div className="w-full p-8 border rounded-xl bg-gray-800/50 border-white/20">
        <div className="flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
          {gameState.icons?.map((icon, index) => (
            <span
              key={index}
              className="text-5xl transition-transform duration-200 hover:scale-110"
            >
              {icon}
            </span>
          ))}
        </div>
      </div>

      {/* Movie to Guess Display */}
      {myRole === "guesser" && gameState.movieToGuess && (
        <div className="w-full p-6 text-center border rounded-xl bg-gray-800/50 border-white/20">
          <p className="text-2xl font-mono tracking-wider">
            {gameState.movieToGuess}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
