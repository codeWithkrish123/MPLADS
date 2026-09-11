import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react";
import emblemOfIndia from "../../assets/images/Emblem_of_India.svg";

export interface CarouselSlide {
  id: string;
  type: "image" | "video";
  url: string;
  poster?: string;
  title: string;
  altText: string;
}

export interface TrustPoint {
  icon?: "check" | "mappin" | "phone" | "mail" | "clock";
  text: string;
}

export interface GovernmentCarouselProps {
  heading: string;
  description: string;
  trustPoints: TrustPoint[];
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "slide-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=80",
    title: "Parliament House of India",
    altText: "New Parliament House of India illuminated at dusk"
  },
  {
    id: "slide-2",
    type: "image",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1400&q=80",
    title: "Infrastructure Development",
    altText: "Modern highway and infrastructure development in India"
  },
  {
    id: "slide-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1400&q=80",
    title: "Government Administration",
    altText: "Ministry administrative headquarters and public governance office"
  },
  {
    id: "slide-4",
    type: "image",
    url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=80",
    title: "Rural & Constituency Progress",
    altText: "Community development and rural electrification projects"
  },
  {
    id: "slide-5",
    type: "image",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    title: "Citizen Welfare & Transparency",
    altText: "Digital transparency initiative and constituency project inspection"
  }
];

export const GovernmentCarousel: React.FC<GovernmentCarouselProps> = ({
  heading,
  description,
  trustPoints
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Touch Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diffX > minSwipeDistance) {
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const renderIcon = (type?: string) => {
    switch (type) {
      case "mappin":
        return <MapPin className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />;
      case "phone":
        return <Phone className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />;
      case "mail":
        return <Mail className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />;
      case "clock":
        return <Clock className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />;
      case "check":
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div
      className="relative w-full h-full min-h-[580px] lg:min-h-full overflow-hidden select-none group bg-[#0B1F4D]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Government Progress Carousel"
    >
      {/* Background Slides */}
      {DEFAULT_SLIDES.map((slide, index) => {
        const isActive = index === currentSlideIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.url}
              alt={slide.altText}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        );
      })}

      {/* Dark Navy Gradient Overlay (Per Spec) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(11, 31, 77, 0.70) 0%, rgba(10, 49, 112, 0.92) 100%)"
        }}
      />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Foreground Content Container */}
      <div className="relative z-30 flex flex-col justify-between h-full p-6 sm:p-8 md:p-10 text-white">
        {/* Top Header: National Emblem + Government Badge & Portal Title */}
        <div className="space-y-6">
          <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 shadow-lg max-w-max">
            {/* National Emblem of India with Saffron Motto */}
            <div className="flex flex-col items-center justify-center shrink-0 pr-1.5 border-r border-white/20">
              <img
                src={emblemOfIndia}
                alt="National Emblem of India"
                className="h-9 w-auto object-contain filter brightness-0 invert"
              />
              <span className="text-[7px] font-extrabold tracking-widest text-[#FF9933] mt-0.5 uppercase">
                सत्यमेव जयते
              </span>
            </div>

            {/* Official Title & Tricolor Indicator Strip */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-[#93C5FD] uppercase block">
                  GOVERNMENT OF INDIA
                </span>
                {/* Micro Tricolor Pill */}
                <div className="flex h-1.5 w-6 rounded-full overflow-hidden shrink-0 border border-white/20">
                  <div className="flex-1 bg-[#FF9933]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#138808]" />
                </div>
              </div>
              <span className="text-xs font-black tracking-wider text-white uppercase block mt-0.5">
                MPLADS PORTAL <span className="text-[10px] font-normal text-slate-300 font-mono">(e-SAKSHI)</span>
              </span>
            </div>
          </div>

          {/* Dynamic Serif Heading & Subtext with Tricolor Line Accent */}
          <div className="max-w-md pt-2 space-y-3">
            <h1
              className="text-2xl sm:text-[28px] font-semibold text-white leading-tight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {heading}
            </h1>

            {/* Elegant Tricolor Accent Bar */}
            <div className="flex h-1 w-24 rounded-full overflow-hidden shadow-sm my-2">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#138808]" />
            </div>

            <p className="text-[13px] text-[#C9D6EC] leading-relaxed font-sans font-normal">
              {description}
            </p>
          </div>
        </div>


        {/* Bottom Panel: Trust Points / Contact Details + Pagination Dots */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          {/* Trust Points / Contact Details */}
          <div className="space-y-3">
            {trustPoints.map((tp, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[#E2E8F0] font-sans">
                {renderIcon(tp.icon)}
                <span className="leading-snug">{tp.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Center Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {DEFAULT_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? "w-6 bg-white shadow-sm"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Next/Prev Arrow Controls (Visible on Hover) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
