import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as HiIcons from "react-icons/hi";
import * as IoIcons from "react-icons/io5";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";

const iconSets = {
  FaIcons,
  AiIcons,
  BiIcons,
  BsIcons,
  GiIcons,
  HiIcons,
  IoIcons,
  MdIcons,
  RiIcons,
  SiIcons,
};

interface IconPickerProps {
  onIconSelect: (iconKey: string) => void;
  theme?: "dark" | "light";
  height?: number;
  width?: string | number;
}

const IconPicker: React.FC<IconPickerProps> = ({
  onIconSelect,
  theme = "dark",
  height = 350,
  width = "100%",
}) => {
  const bgColor = theme === "dark" ? "bg-[#0A0C10]" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-black";

  return (
    <div
      className={`${bgColor} rounded-xl overflow-y-auto`}
      style={{ height, width }}
    >
      <div className="p-4 grid grid-cols-8 gap-2">
        {Object.entries(iconSets).map(([setName, iconSet]) => {
          // Get all icons from each set
          const icons = Object.entries(iconSet)
            .filter(([key]) => key.match(/^[A-Z]/)) // Only get icon components
            .map(([key, Icon]) => (
              <button
                key={`${setName}_${key}`}
                onClick={() => onIconSelect(`${setName}.${key}`)}
                className={`p-2 rounded-lg ${textColor} hover:bg-white/10 transition-colors duration-200 flex items-center justify-center`}
                title={key}
              >
                {React.createElement(Icon as any, { size: 20 })}
              </button>
            ));
          return icons;
        })}
      </div>
    </div>
  );
};

export default IconPicker;
