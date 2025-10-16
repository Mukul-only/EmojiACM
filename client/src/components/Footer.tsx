import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiAcm } from "react-icons/si";
import { HiCode, HiHeart } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="w-full px-4 py-12 border-t bg-[#0A0C10]/90 backdrop-blur-xl border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex items-center mb-4 space-x-3">
              <HiCode className="text-3xl text-[#7BFF66]" />
              <span className="text-2xl font-bold text-white">
                Emoji Charades
              </span>
            </div>
            <p className="text-gray-400">
              An exciting game that combines creativity with movie knowledge.
            </p>
          </div>

          {/* Event Info */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-4 space-x-2">
              <SiAcm className="text-2xl text-[#7BFF66]" />
              <h3 className="text-xl font-semibold text-white">INFOTREK'25</h3>
            </div>
            <p className="text-gray-400">Department of Computer Applications</p>
            <p className="text-gray-400">NIT Trichy</p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="mb-4 text-xl font-semibold text-white">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 transition-colors rounded-lg hover:bg-[#7BFF66]/10 text-gray-400 hover:text-[#7BFF66]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-2xl" />
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-lg hover:bg-[#7BFF66]/10 text-gray-400 hover:text-[#7BFF66]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-2xl" />
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-lg hover:bg-[#7BFF66]/10 text-gray-400 hover:text-[#7BFF66]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center pt-8 mt-8 border-t border-white/10 md:flex-row md:justify-between">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">
            © 2025 ACM Student Chapter, NIT Trichy. All rights reserved.
          </p>
          <p className="flex items-center text-sm text-gray-400">
            Made with <HiHeart className="mx-1 text-[#7BFF66]" /> for emoji
            lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
