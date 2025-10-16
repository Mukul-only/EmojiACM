import React from "react";

interface RuleCardProps {
  ruleNumber: number;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  emoji: string;
  imagePath?: string;
}

const RuleCard: React.FC<RuleCardProps> = ({
  ruleNumber,
  title,
  description,
  backgroundColor,
  textColor,
  emoji,
  imagePath,
}) => {
  return (
    <div className="aspect-square">
      <div
        className={`${backgroundColor} ${textColor} w-full h-full rounded-2xl p-4 flex flex-col group relative overflow-hidden`}
      >
        {/* Image/Emoji Container */}
        <div className="flex items-center justify-center flex-shrink-0 mb-3 h-1/2">
          {imagePath ? (
            <div className="relative w-full h-full">
              <img
                src={imagePath}
                alt={`Rule ${ruleNumber} illustration`}
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <span className="text-5xl">{emoji}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-start flex-1 text-center">
          <h3 className="text-base font-bold mb-1.5">{title}</h3>
          <p className="text-xs leading-relaxed text-gray-300 line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;
