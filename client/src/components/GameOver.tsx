import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaHome } from "react-icons/fa";

interface GameOverProps {}

const GameOver: React.FC<GameOverProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(123, 255, 102, 0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      {/* Content Card */}
      <div className="relative w-full max-w-lg p-8 mx-4 space-y-8 text-center border shadow-2xl bg-brand-dark/80 backdrop-blur-xl rounded-3xl border-[#7BFF66]/20">
        {/* Trophy Icon with Glow */}
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-[#7BFF66]/20"></div>
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto border-2 rounded-full border-[#7BFF66]/30 bg-[#7BFF66]/10">
            <FaTrophy className="text-5xl text-[#7BFF66]" />
          </div>
        </div>

        {/* Title with Animation */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-[#7BFF66] to-white bg-clip-text animate-pulse">
            Game Over!
          </h2>
          <p className="text-2xl font-medium text-white/80">
            Thank you for playing!
          </p>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center gap-4 p-4 mx-auto border rounded-2xl bg-brand-dark/60 border-[#7BFF66]/10">
          <div className="p-3 rounded-xl bg-[#7BFF66]/10">
            <FaTrophy className="text-3xl text-[#7BFF66]" />
          </div>
          <div className="text-left">
            <p className="text-lg font-semibold text-white">
              Game Completed Successfully!
            </p>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-full gap-2 px-8 py-4 text-lg font-semibold transition-all duration-300 transform border shadow-2xl group text-brand-dark bg-[#7BFF66] rounded-2xl border-[#7BFF66]/10 hover:shadow-[#7BFF66]/25 hover:scale-105 hover:-translate-y-1"
        >
          <FaHome className="text-xl" />
          <span>Exit to Lobby</span>
        </button>
      </div>
    </div>
  );
};

export default GameOver;
