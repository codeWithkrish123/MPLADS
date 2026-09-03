import React from "react";

interface SatyamevJayateLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

/**
 * SatyamevJayateLogo Component
 * Displays the Satyamev Jayate emblem (Lion emblem of India)
 * Used app-wide as the primary logo for the MPLADS Sentinel portal
 */
export const SatyamevJayateLogo: React.FC<SatyamevJayateLogoProps> = ({
  className = "",
  size = "md",
  showText = false,
}) => {
  // Image dimensions based on size
  const dims = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }[size];

  // Use the MPLADS logo from assets/images folder
  const logoPath = new URL(
    /* @vite-ignore */
    "../../assets/images/MPLADS_logo.jpg",
    import.meta.url
  ).href;

  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
      role="img"
      aria-label="Satyamev Jayate - State Emblem of India"
    >
      <img
        src={logoPath}
        alt="MPLADS Sentinel Emblem"
        className={`${dims} object-contain rounded-full shadow-md transition-all hover:shadow-lg duration-200 opacity-100 hover:opacity-100`}
        style={{
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.3)) brightness(1.1) contrast(1.15)",
          maxWidth: "100%",
          height: "auto",
        }}
        onError={(e) => {
          console.error("Logo image failed to load:", logoPath);
          e.currentTarget.style.display = "none";
        }}
      />
      {showText && (
        <span className="text-[8px] font-black tracking-widest mt-1 text-center font-heading text-slate-700">
          सत्यमेव जयते
        </span>
      )}
    </div>
  );
};
