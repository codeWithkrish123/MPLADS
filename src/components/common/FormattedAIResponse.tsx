import React from "react";
import { Cpu, Sparkles, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";

interface FormattedAIResponseProps {
  text: string;
  isStreaming?: boolean;
}

export const FormattedAIResponse: React.FC<FormattedAIResponseProps> = ({ text, isStreaming = false }) => {
  if (!text) return null;

  const lines = text.split("\n");

  // Helper to format inline markdown like **bold text**
  const parseInline = (content: string) => {
    let processedContent = content;
    const matchCount = (content.match(/\*\*/g) || []).length;
    if (matchCount % 2 !== 0 && isStreaming) {
      processedContent += "**";
    }

    const parts = processedContent.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        const cleanText = part.slice(2, -2);
        return (
          <span
            key={index}
            className="font-bold text-amber-200 bg-amber-500/15 border border-amber-400/30 px-1.5 py-0.5 rounded text-[11px] font-mono mx-0.5 inline-block shadow-2xs"
          >
            {cleanText}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3 text-xs font-sans leading-relaxed text-slate-100">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Section Headings: ### Title
        if (trimmed.startsWith("### ")) {
          const headingText = trimmed.replace("### ", "");
          return (
            <div
              key={lineIdx}
              className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider mt-4 mb-2 font-mono border-b border-slate-700/80 pb-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span>{headingText}</span>
            </div>
          );
        }

        // Horizontal Dividers: ---
        if (trimmed === "---") {
          return (
            <div
              key={lineIdx}
              className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-3.5"
            />
          );
        }

        // Bullet Points: - or •
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const bulletText = trimmed.replace(/^- |^• /, "");
          return (
            <div
              key={lineIdx}
              className="flex items-start gap-2.5 my-2 pl-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-1.5 shrink-0 shadow-xs shadow-amber-500/50" />
              <div className="flex-1 text-slate-200 text-xs leading-relaxed">{parseInline(bulletText)}</div>
            </div>
          );
        }

        // Key Value Pairs or Regular Paragraphs
        return (
          <p key={lineIdx} className="text-slate-200 text-xs leading-relaxed">
            {parseInline(trimmed)}
          </p>
        );
      })}

      {/* Streaming Beam Cursor Indicator */}
      {isStreaming && (
        <span className="inline-flex items-center gap-2 text-amber-300 font-mono text-xs font-bold animate-pulse mt-3 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded-md">
          <span className="w-2 h-4 bg-[#FF9933] rounded-xs shadow-sm shadow-amber-400" />
          <span className="text-[10px] text-amber-200 uppercase tracking-widest">Generating Official Government AI Briefing...</span>
        </span>
      )}
    </div>
  );
};
