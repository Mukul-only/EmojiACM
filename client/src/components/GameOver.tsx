import React from "react";
import { useNavigate } from "react-router-dom";

interface GameOverProps {
  finalScore: number;
}

const GameOver: React.FC<GameOverProps> = ({ finalScore }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md p-8 space-y-6 text-center border shadow-lg bg-slate-medium/50 backdrop-blur-xl rounded-2xl border-cyan-glow/20">
      <h2 className="text-4xl font-bold text-white">Game Over!</h2>
      <div>
        <p className="text-lg text-cyan-glow">Your Final Team Score</p>
        <p className="text-6xl font-bold text-white">{finalScore}</p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="w-full py-3 font-bold transition-all rounded-lg text-slate-dark bg-cyan-glow hover:scale-105 hover:shadow-lg hover:shadow-cyan-glow/30"
      >
        Exit to Lobby
      </button>
    </div>
  );
};

export default GameOver;
