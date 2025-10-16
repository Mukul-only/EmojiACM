import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { getMe } from "../api/auth.api";
import { getGameStats, type GameStats } from "../api/game.api";
import type { User } from "../types";
import TeamMember from "../components/TeamMember";

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<{
    user: User;
    teamMembers?: User[];
  } | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First try to fetch profile data
        const profileResult = await getMe();
        setProfileData(profileResult);

        try {
          // Then try to fetch game stats
          const statsResult = await getGameStats();
          setGameStats(statsResult);
        } catch (statsError: any) {
          console.error(
            "Failed to fetch game stats:",
            statsError.response?.data || statsError.message
          );
          // Don't fail the whole profile load if just stats fail
          setGameStats({
            gamesPlayed: 0,
            totalScore: 0,
            averageScore: 0,
            winRate: 0,
            bestScore: 0,
            totalRoundsPlayed: 0,
            averageRoundsPerGame: 0,
            totalPlayTime: 0,
            averagePlayTime: 0,
            recentGames: [],
          });
        }
      } catch (error: any) {
        console.error(
          "Failed to fetch profile data:",
          error.response?.data || error.message
        );
        // Handle authentication errors
        if (error.response?.status === 401) {
          // Redirect to login or handle unauthorized state
          window.location.href = "/login";
        }
      }
    };

    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  if (!authUser || !profileData) {
    return (
      <Layout>
        <div className="text-center text-white">Loading profile...</div>
      </Layout>
    );
  }

  const { user, teamMembers } = profileData;
  const gamesPlayed = gameStats?.gamesPlayed || 0;
  const totalScore = gameStats?.totalScore || 0;
  const winRate = gameStats?.winRate || 0;
  const bestScore = gameStats?.bestScore || 0;

  return (
    <Layout>
      <div className="min-h-screen text-white bg-[#0A0C10] pt-44 pb-44">
        {/* Metallic Grid Pattern Background */}
        <div className="fixed inset-0 z-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(123, 255, 102, 0.15) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        {/* Profile Header - Glass Card */}
        <div className="relative z-10 max-w-6xl px-4 mx-auto">
          <div className="relative p-8 mb-8 overflow-hidden border shadow-2xl bg-[#161B22]/80 backdrop-blur-xl rounded-3xl border-white/10">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7BFF66]/10 to-purple-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-[#7BFF66]/10 blur-3xl"></div>

            <div className="relative flex flex-col items-center md:flex-row md:items-start md:space-x-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6 md:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-40 h-40 text-6xl font-bold uppercase rounded-2xl bg-gradient-to-br from-[#7BFF66] to-[#5BDF46] text-[#0A0C10] shadow-lg shadow-[#7BFF66]/20">
                    {user.username.charAt(0)}
                  </div>
                  <div className="absolute -bottom-3 -right-3 p-3 rounded-full bg-[#1C2128] border border-[#7BFF66]/20 shadow-lg">
                    <span className="text-3xl">🎮</span>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-5xl font-bold tracking-tight">
                  {user.username}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 mb-4 md:justify-start">
                  <p className="px-4 py-1 text-sm font-medium rounded-full bg-[#7BFF66]/10 text-[#7BFF66] border border-[#7BFF66]/20">
                    Level {Math.floor(totalScore / 100)}
                  </p>
                  <p className="px-4 py-1 text-sm font-medium text-purple-400 border rounded-full bg-purple-500/10 border-purple-500/20">
                    Emoji Master
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
                  <div className="p-4 transition-all rounded-xl bg-[#1C2128]/50 hover:bg-[#1C2128]/70">
                    <p className="text-sm text-gray-400">Games Played</p>
                    <p className="text-2xl font-bold text-[#7BFF66]">
                      {gamesPlayed}
                    </p>
                  </div>
                  <div className="p-4 transition-all rounded-xl bg-[#1C2128]/50 hover:bg-[#1C2128]/70">
                    <p className="text-sm text-gray-400">Total Score</p>
                    <p className="text-2xl font-bold text-[#7BFF66]">
                      {totalScore}
                    </p>
                  </div>
                  <div className="p-4 transition-all rounded-xl bg-[#1C2128]/50 hover:bg-[#1C2128]/70">
                    <p className="text-sm text-gray-400">Best Score</p>
                    <p className="text-2xl font-bold text-[#7BFF66]">
                      {bestScore}
                    </p>
                  </div>
                  <div className="p-4 transition-all rounded-xl bg-[#1C2128]/50 hover:bg-[#1C2128]/70">
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-[#7BFF66]">
                      {winRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section with Glass Effect */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="relative p-8 mb-8 overflow-hidden border shadow-xl bg-[#161B22]/80 backdrop-blur-xl rounded-3xl border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7BFF66]/5 to-purple-500/5"></div>
              <div className="relative">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                  <span className="p-2 rounded-lg bg-[#1C2128]">👥</span>
                  Your Team
                </h2>
                <div className="grid gap-6">
                  {teamMembers.map((member) => (
                    <TeamMember key={member._id} member={member} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Section */}
          <div className="relative p-8 overflow-hidden border shadow-xl bg-[#161B22]/80 backdrop-blur-xl rounded-3xl border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-[#7BFF66]/5"></div>
            <div className="relative">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="p-2 rounded-lg bg-[#1C2128]">🏆</span>
                Achievements
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {user.achievements?.length ? (
                  user.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 transition-all border rounded-xl bg-[#1C2128]/50 border-white/5 hover:border-[#7BFF66]/20"
                    >
                      <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-lg bg-[#7BFF66]/10">
                        {achievement.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{achievement}</p>
                        <p className="text-sm text-gray-400">
                          Achievement Unlocked
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center text-gray-400 border rounded-xl bg-[#1C2128]/50 border-white/5">
                    <p className="mb-2 text-3xl">🎯</p>
                    <p>Complete challenges to earn achievements!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
