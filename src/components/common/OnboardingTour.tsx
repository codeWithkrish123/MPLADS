import React from "react";
import {
  Shield,
  Sparkles,
  Search,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  HelpCircle,
  Clock,
} from "lucide-react";

export interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  targetHint: string;
  badge: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "National Command & Role Perspectives",
    subtitle: "Multi-Role Institutional Workspaces",
    description:
      "Switch between Ministry (MoSPI), State Nodal Authority, District Magistrate (DM/DC), and Member of Parliament (MP) views at any time via the top header.",
    icon: <Shield className="w-5 h-5 text-amber-400" />,
    targetHint: "Header / Role Switcher",
    badge: "1. Navigation",
  },
  {
    title: "Global Command Palette (⌘K / Ctrl+K)",
    subtitle: "Instant Universal Search",
    description:
      "Press ⌘K anywhere on the platform to instantly look up Work IDs, district profiles, statutory compliance rules, or active risk signals.",
    icon: <Search className="w-5 h-5 text-blue-400" />,
    targetHint: "Header Search Bar",
    badge: "2. Fast Lookup",
  },
  {
    title: "Works Intelligence Ledger & Batch Actions",
    subtitle: "Comprehensive Anomaly Matrix",
    description:
      "Filter, sort, and batch-select project records. Export filtered datasets or selected batches directly to CSV for offline reporting.",
    icon: <Layers className="w-5 h-5 text-emerald-400" />,
    targetHint: "Works Ledger View",
    badge: "3. Data Matrix",
  },
  {
    title: "Explainable AI & Interactive Gantt Timeline",
    subtitle: "Why Flagged & Schedule Forecasts",
    description:
      "Click 'Explain' on any project record to view itemized risk factor scorecards, statutory citations, and an interactive Gantt-style milestone schedule.",
    icon: <Clock className="w-5 h-5 text-amber-400" />,
    targetHint: "Why Flagged Drawer",
    badge: "4. Explainability",
  },
  {
    title: "Ask MPLADS AI & Policy Engine",
    subtitle: "Grounded Decision Support",
    description:
      "Converse with the Gemini-powered decision support engine for instant policy clarifications, CAG audit guidance, and district-level risk synthesis.",
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    targetHint: "AI Assistant View",
    badge: "5. AI Support",
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  currentStep,
  onStepChange,
}) => {
  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep] || TOUR_STEPS[0];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div
      id="mplads-onboarding-tour-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
              {step.icon}
            </div>
            <div>
              <span className="px-2 py-0.5 bg-blue-950 text-blue-300 text-[10px] font-bold rounded font-mono uppercase border border-blue-800/60">
                {step.badge}
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                {step.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-amber-400 font-mono">
            {step.subtitle} • [{step.targetHint}]
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {step.description}
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onStepChange(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-6 bg-amber-400"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Go to Step ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] text-slate-400 font-mono ml-2">
              {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Got it, let&apos;s start!
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
