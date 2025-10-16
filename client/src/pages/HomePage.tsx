import { useAuth } from "../hooks/useAuth";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";
import RuleCard from "../components/RuleCard";

// Import rule images
import rule1Image from "../assets/rules/rule1.png";
import rule2Image from "../assets/rules/rule2.png";
import rule3Image from "../assets/rules/rule3.png";
import rule4Image from "../assets/rules/rule4.png";

import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  user: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark">
      {/* Background Elements - Dark Theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>

        {/* Metallic Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      </div>

      <NavBar />

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 space-y-8">
              {/* Floating Badge - Apple Glass Effect */}
              <div className="inline-flex items-center px-6 py-3 border rounded-full shadow-2xl bg-white/10 backdrop-blur-xl border-white/20">
                <div className="w-2 h-2 mr-3 rounded-full shadow-lg bg-emerald-400 animate-pulse shadow-emerald-400/50"></div>
                <span className="text-sm font-medium text-white/90">
                  Live & Interactive
                </span>
              </div>

              {/* Main Title with Metallic Gradient */}
              <div className="space-y-6">
                <h1 className="font-black leading-tight text-7xl md:text-8xl">
                  <span className="text-text-primary drop-shadow-2xl">
                    Emoji
                  </span>
                  <br />
                  <span className="text-primary drop-shadow-2xl">Charades</span>
                </h1>

                <p className="max-w-lg text-xl leading-relaxed text-gray-300">
                  Where emojis speak louder than words. Experience the future of
                  <span className="font-semibold text-primary">
                    {" "}
                    interactive gaming
                  </span>
                  .
                </p>
              </div>

              {/* CTA Buttons - Metallic Design */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    if (user) {
                      navigate("/lobby");
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="relative px-8 py-4 text-lg font-semibold transition-all duration-300 border shadow-2xl group bg-[#7BFF66] text-[#0A0C10] rounded-2xl border-white/10 hover:shadow-[#7BFF66]/25 hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span className="text-2xl group-hover:animate-bounce">
                      🎮
                    </span>
                    <span>{user ? "Start Playing" : "Login to Play"}</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 backdrop-blur-xl rounded-2xl group-hover:opacity-100"></div>
                </button>

                <button className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl hover:bg-white/20 hover:shadow-lg hover:scale-105 hover:-translate-y-1">
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">📖</span>
                    <span>Learn More</span>
                  </span>
                </button>
              </div>

              {/* Stats - Dark Theme */}
              <div className="flex items-center pt-8 space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Active Players</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-gray-400">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Rules - Apple Glass Container */}
            <div className="relative">
              {/* Apple Glass Container */}
              <div className="relative p-8 overflow-hidden border shadow-2xl bg-white/5 backdrop-blur-2xl rounded-3xl border-white/10">
                {/* Metallic Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10"></div>

                <div className="relative z-10 space-y-8">
                  <div className="text-center">
                    <h2 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-white to-purple-400 bg-clip-text">
                      Game Rules
                    </h2>
                    <p className="text-gray-400">
                      Master the art of emoji communication
                    </p>
                  </div>

                  {/* Modern Rules Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <RuleCard
                      ruleNumber={1}
                      title="Team Size"
                      description="2 players per team - team up for double the fun!"
                      backgroundColor="bg-[#161B22]"
                      textColor="text-white"
                      emoji=""
                      imagePath={rule1Image}
                    />

                    <RuleCard
                      ruleNumber={2}
                      title="Game Flow"
                      description="One teammate sends emojis, the other guesses movie names."
                      backgroundColor="bg-[#161B22]"
                      textColor="text-white"
                      emoji=""
                      imagePath={rule2Image}
                    />

                    <RuleCard
                      ruleNumber={3}
                      title="Time Limit"
                      description="30-45 minutes per team, depending on rounds."
                      backgroundColor="bg-[#161B22]"
                      textColor="text-white"
                      emoji=""
                      imagePath={rule3Image}
                    />

                    <RuleCard
                      ruleNumber={4}
                      title="Core Rule"
                      description="Only emojis allowed - no words, letters, or numbers!"
                      backgroundColor="bg-[#161B22]"
                      textColor="text-white"
                      emoji=""
                      imagePath={rule4Image}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Judging & Prizes Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-white to-[#7BFF66] bg-clip-text">
              Event Details & Prizes
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-300">
              Speak fluent Emoji – Guess it right, win it bright! 🎉
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Judging Criteria */}
            <div className="relative group">
              <div className="h-full p-8 transition-all duration-300 border bg-[#161B22] rounded-3xl border-white/10">
                <div className="flex items-center justify-center w-16 h-16 mb-6 transition-transform border rounded-2xl bg-[#1C2128] border-white/10">
                  <span className="text-3xl">⚖️</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Judging Criteria
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Number of correct guesses
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Time taken per guess
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Emoji creativity
                  </li>
                </ul>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="relative group">
              <div className="h-full p-8 transition-all duration-300 border bg-[#161B22] rounded-3xl border-white/10">
                <div className="flex items-center justify-center w-16 h-16 mb-6 transition-transform border rounded-2xl bg-[#1C2128] border-white/10">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Prize Pool
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2">🥇</span>
                    Prizes for top 3 teams
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🎁</span>
                    Special creativity awards
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🌟</span>
                    Participation certificates
                  </li>
                </ul>
              </div>
            </div>

            {/* Why Participate */}
            <div className="relative group">
              <div className="h-full p-8 transition-all duration-300 border bg-[#161B22] rounded-3xl border-white/10">
                <div className="flex items-center justify-center w-16 h-16 mb-6 transition-transform border rounded-2xl bg-[#1C2128] border-white/10">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Why Participate?
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2">💪</span>
                    Break from technical stress
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🎯</span>
                    Test communication skills
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🎬</span>
                    Show off movie knowledge
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 overflow-hidden border shadow-2xl bg-[#161B22] backdrop-blur-2xl rounded-3xl border-white/10">
            <div className="relative z-10">
              <h2 className="mb-6 text-5xl font-bold text-white">
                Event Information
              </h2>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="p-6 text-left border bg-[#1C2128] rounded-2xl border-white/10">
                  <div className="flex items-center mb-4">
                    <span className="mr-3 text-2xl">📅</span>
                    <h3 className="text-xl font-bold text-white">
                      Date & Time
                    </h3>
                  </div>
                  <p className="text-gray-300">Date: T.B.A</p>
                  <p className="text-gray-300">Time: T.B.A</p>
                  <p className="text-gray-300">
                    Duration: 30-45 minutes per team
                  </p>
                </div>

                <div className="p-6 text-left border bg-[#1C2128] rounded-2xl border-white/10">
                  <div className="flex items-center mb-4">
                    <span className="mr-3 text-2xl">👥</span>
                    <h3 className="text-xl font-bold text-white">
                      Eligibility
                    </h3>
                  </div>
                  <p className="text-gray-300">• Open to all students</p>
                  <p className="text-gray-300">• Register in teams of 2</p>
                  <p className="text-gray-300">• No prior experience needed</p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <p className="mb-8 text-xl text-white/90">
                  Join us for INFOTREK'25, the annual inter-departmental
                  technical fest by ACM Student Chapter, Department of Computer
                  Applications (MCA), NIT Trichy.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (user) {
                        navigate("/lobby");
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="px-8 py-4 text-lg font-semibold bg-[#7BFF66] text-[#0A0C10] rounded-xl hover:shadow-[#7BFF66]/25 hover:scale-105 transition-all duration-300"
                  >
                    {user ? "Enter Game Lobby" : "Register Now"} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Dark Theme */}
      <footer className="px-4 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center mb-4 space-x-3 md:mb-0">
              <span className="text-2xl">🎭</span>
              <span className="text-xl font-bold text-white">
                Emoji Charades
              </span>
            </div>

            <div className="text-center md:text-right">
              <p className="mb-2 text-gray-400">infotrek'25, ACM NITT</p>
              <p className="text-sm text-gray-500">
                Made with ❤️ for emoji lovers everywhere
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const HomePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-b-2 border-[#7BFF66] rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return <LandingPage user={user} />;
};

export default HomePage;
