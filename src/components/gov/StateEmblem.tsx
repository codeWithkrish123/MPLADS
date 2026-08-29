import React from "react";

interface StateEmblemProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light" | "gold";
}

export const StateEmblem: React.FC<StateEmblemProps> = ({
  className = "",
  size = "md",
  theme = "gold",
}) => {
  // Dimensions based on size
  const dims = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }[size];

  // Colors based on theme
  const fillClass = {
    gold: "url(#gold-gradient)",
    dark: "#1e293b",
    light: "#ffffff",
  }[theme];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        className={`${dims}`}
        viewBox="0 0 100 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="State Emblem of India"
      >
        <defs>
          <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DFB15B" />
            <stop offset="50%" stopColor="#B48A30" />
            <stop offset="100%" stopColor="#8F6815" />
          </linearGradient>
        </defs>

        {/* 1. Lion Pillars Top Outline */}
        <g fill={fillClass}>
          {/* Central Lion Head silhouette */}
          <path d="M50 8 C44 8, 38 11, 38 18 C38 22, 40 25, 42 27 C41 29, 39 31, 39 34 C39 37, 41 39, 43 40 C42 41, 41 43, 41 45 C41 48, 43 51, 46 52 C45 54, 45 57, 47 59 C49 61, 51 61, 53 59 C55 61, 57 61, 59 59 C61 57, 61 54, 60 52 C63 51, 65 48, 65 45 C65 43, 64 41, 63 40 C65 39, 67 37, 67 34 C67 31, 65 29, 64 27 C66 25, 68 22, 68 18 C68 11, 62 8, 56 8 C53 8, 51 9, 50 10 C49 9, 47 8, 50 8 Z" />
          {/* Left profile lion head silhouette */}
          <path d="M35 15 C30 15, 26 18, 26 24 C26 27, 28 30, 30 32 C28 34, 27 36, 27 39 C27 42, 29 44, 31 45 C29 47, 29 49, 29 51 C29 54, 31 56, 34 57 C33 59, 34 61, 36 63 C38 65, 40 65, 42 63 C42 61, 41 59, 39 57 C41 56, 42 54, 42 51" />
          {/* Right profile lion head silhouette */}
          <path d="M65 15 C70 15, 74 18, 74 24 C74 27, 72 30, 70 32 C72 34, 73 36, 73 39 C73 42, 71 44, 69 45 C71 47, 71 49, 71 51 C71 54, 69 56, 66 57 C67 59, 66 61, 64 63 C62 65, 60 65, 58 63 C58 61, 59 59, 61 57 C59 56, 58 54, 58 51" />
          
          {/* Manes Details & Fur Accents */}
          <path d="M44 22 H56 V26 H44 Z" />
          <path d="M42 29 H58 V32 H42 Z" />
          <path d="M41 35 H59 V38 H41 Z" />
          <path d="M43 41 H57 V44 H43 Z" />
          <path d="M46 47 H54 V50 H46 Z" />
          
          {/* Central Pillar Capital Abacus base */}
          <rect x="25" y="65" width="50" height="12" rx="2" />
          
          {/* Ashoka Chakra Wheel in the center of the abacus */}
          <circle cx="50" cy="71" r="5" fill="none" stroke={fillClass} strokeWidth="1.5" />
          <circle cx="50" cy="71" r="1" fill={fillClass} />
          {/* Spokes of the Ashoka Chakra */}
          <line x1="50" y1="66" x2="50" y2="76" stroke={fillClass} strokeWidth="0.8" />
          <line x1="45" y1="71" x2="55" y2="71" stroke={fillClass} strokeWidth="0.8" />
          <line x1="46.5" y1="67.5" x2="53.5" y2="74.5" stroke={fillClass} strokeWidth="0.6" />
          <line x1="46.5" y1="74.5" x2="53.5" y2="67.5" stroke={fillClass} strokeWidth="0.6" />

          {/* Left Bull Profile Silhouette on abacus */}
          <path d="M33 73 C31 73, 29 71, 29 69 C29 67, 31 67, 33 67 C35 67, 36 69, 36 71 Z" />
          {/* Right Galloping Horse Silhouette on abacus */}
          <path d="M67 73 C65 73, 63 71, 63 69 C63 67, 65 67, 67 67 C69 67, 71 69, 71 71 Z" />

          {/* Bell-shaped inverted lotus base representing support of the capital */}
          <path d="M28 78 C28 78, 30 94, 50 94 C70 94, 72 78, 72 78" stroke={fillClass} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 78 L35 91 M38 78 L40 93 M44 78 L45 94 M50 78 L50 94 M56 78 L55 94 M62 78 L60 93 M68 78 L65 91" stroke={fillClass} strokeWidth="1.5" />
        </g>
      </svg>
      {/* State Motto */}
      <span className={`text-[8px] font-black tracking-widest mt-1 text-center font-heading ${theme === "light" ? "text-white" : "text-slate-800"}`}>
        सत्यमेव जयते
      </span>
    </div>
  );
};
