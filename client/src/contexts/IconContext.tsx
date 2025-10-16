import React, { createContext, useContext, useState } from "react";
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

interface IconContextType {
  icons: string[];
  addIcon: (iconKey: string) => void;
  removeLastIcon: () => void;
  clearIcons: () => void;
  renderIcon: (iconKey: string, props?: any) => React.ReactNode;
}

const IconContext = createContext<IconContextType | null>(null);

export const IconProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [icons, setIcons] = useState<string[]>([]);

  const addIcon = (iconKey: string) => {
    setIcons((prev) => [...prev, iconKey]);
  };

  const removeLastIcon = () => {
    setIcons((prev) => prev.slice(0, -1));
  };

  const clearIcons = () => {
    setIcons([]);
  };

  const renderIcon = (iconKey: string, props = {}) => {
    const [setName, iconName] = iconKey.split(".");
    // @ts-ignore
    const IconSet = iconSets[setName];
    // @ts-ignore
    const Icon = IconSet[iconName];
    return Icon ? <Icon {...props} /> : null;
  };

  return (
    <IconContext.Provider
      value={{ icons, addIcon, removeLastIcon, clearIcons, renderIcon }}
    >
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error("useIcons must be used within an IconProvider");
  }
  return context;
};
