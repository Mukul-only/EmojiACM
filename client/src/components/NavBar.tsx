import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { HiHome, HiCode, HiLogout, HiLogin, HiUserGroup } from "react-icons/hi";
import { IoGameController } from "react-icons/io5";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLobby = () => {
    if (user) {
      navigate("/lobby");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-[#0A0C10]/70 backdrop-blur-xl border-b border-white/5"></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div
            onClick={handleHome}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#7BFF66] rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg shadow-[#7BFF66]/10">
              <span className="text-xl group-hover:scale-110 transition-transform">
                🎭
              </span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent flex items-center">
              <HiCode className="mr-2" />
              EmojiCharades
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-8">
            <button
              onClick={handleHome}
              className="px-4 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium relative group flex items-center space-x-2"
            >
              <HiHome className="text-xl" />
              <span>Home</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#7BFF66] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </button>

            <button
              onClick={handleLobby}
              className="px-4 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium relative group flex items-center space-x-2"
            >
              <IoGameController className="text-xl" />
              <span>Lobby</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#7BFF66] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 bg-[#7BFF66] rounded-full flex items-center justify-center text-[#0A0C10] font-bold text-lg uppercase hover:shadow-lg hover:shadow-[#7BFF66]/20 transition-all duration-300"
                >
                  {user.username.charAt(0)}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* Gradient background for dropdown */}
                    <div className="absolute inset-0 bg-[#161B22]/95"></div>

                    <div className="relative p-3">
                      <div className="px-3 py-2 border-b border-white/5">
                        <p className="text-sm text-white/60">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">
                          {user.username}
                        </p>
                      </div>
                      <div className="pt-2 space-y-1">
                        <Link
                          to="/profile"
                          className="block w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/5 rounded-lg transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <HiUserGroup className="text-xl" />
                            <span>View Profile</span>
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <HiLogout className="text-xl" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-6 py-2.5 bg-[#7BFF66] text-[#0A0C10] rounded-xl hover:shadow-xl hover:shadow-[#7BFF66]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <HiLogin className="text-xl" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
