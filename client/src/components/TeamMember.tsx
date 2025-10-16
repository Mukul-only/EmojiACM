import React from "react";
import type { User } from "../types";

interface TeamMemberProps {
  member: User;
}

const TeamMember: React.FC<TeamMemberProps> = ({ member }) => {
  return (
    <div className="p-6 transition-all duration-300 border bg-[#161B22] rounded-2xl border-white/10 hover:border-[#7BFF66]/50">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex items-center justify-center w-12 h-12 text-xl font-bold uppercase rounded-full bg-[#7BFF66] text-[#0A0C10]">
          {member.name?.charAt(0) || member.username.charAt(0)}
        </div>

        {/* Member Details */}
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-white">
            {member.name || member.username}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">
              <span className="inline-block w-24 text-gray-500">Username:</span>
              {member.username}
            </p>
            {member.rollNumber && (
              <p className="text-sm text-gray-400">
                <span className="inline-block w-24 text-gray-500">
                  Roll Number:
                </span>
                {member.rollNumber}
              </p>
            )}
            {member.email && (
              <p className="text-sm text-gray-400">
                <span className="inline-block w-24 text-gray-500">Email:</span>
                {member.email}
              </p>
            )}
            <p className="text-sm text-gray-400">
              <span className="inline-block w-24 text-gray-500">Games:</span>
              {member.gamesPlayed || 0}
            </p>
            <p className="text-sm text-gray-400">
              <span className="inline-block w-24 text-gray-500">Score:</span>
              {member.totalScore || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
