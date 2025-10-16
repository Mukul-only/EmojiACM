import React, { useMemo } from "react";

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const timerClasses = useMemo(() => {
    let classes =
      "fixed bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 flex items-center justify-center text-4xl font-bold rounded-full shadow-lg transition-all duration-500 ";
    if (timeLeft <= 5) {
      classes +=
        "bg-red-500/80 text-white animate-heartbeat border-4 border-red-300";
    } else if (timeLeft <= 10) {
      classes +=
        "bg-yellow-500/80 text-slate-dark animate-heartbeat border-4 border-yellow-300";
    } else {
      classes += "bg-cyan-glow/80 text-slate-dark border-4 border-cyan-300";
    }
    return classes;
  }, [timeLeft]);

  return <div className={timerClasses}>{timeLeft}</div>;
};

export default Timer;
