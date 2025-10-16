import React from "react";

interface ScoreboardProps {
  teamScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teamScore }) => {
  return (
    <div className="flex items-center justify-center p-6 rounded-xl bg-white/5">
      <div className="text-center">
        <p className="text-sm text-white/60 mb-2">Team Score</p>
        <p className="text-4xl font-bold text-[#7BFF66]">{teamScore}</p>
      </div>
    </div>
  );
};

export default Scoreboard;
