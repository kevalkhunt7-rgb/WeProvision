import React, { useState, useEffect } from 'react';
import { Map, Palette, Code2, ShieldCheck, Rocket, Headphones, ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Vision Mapping",
    description: "We begin with immersive collaboration — understanding your business landscape, goals, and challenges. This strategic clarity fuels every design and code we write.",
    icon: Map
  },
  {
    id: 2,
    title: "Tailored Experience Architecture",
    description: "Our UI/UX and solution designers craft fully custom digital blueprints that combine aesthetics with functionality — built for your users, not templates.",
    icon: Palette
  },
  {
    id: 3,
    title: "Agile Innovation Cycles",
    description: "We build using an iterative, feedback-driven development model that lets us move fast, adapt quickly, and deliver excellence in phases.",
    icon: Code2
  },
  {
    id: 4,
    title: "Precision QA & Resilience Testing",
    description: "Every click, swipe, and transition is tested under real-world conditions. We guarantee a bug-free, seamless experience across all devices.",
    icon: ShieldCheck
  },
  {
    id: 5,
    title: "Smooth Launch & Scalable Rollouts",
    description: "Deployments are done with zero stress. We ensure your product goes live smoothly — with a foundation ready to scale as you grow.",
    icon: Rocket
  },
  {
    id: 6,
    title: "Beyond Launch: Continuous Partnership",
    description: "Your success doesn't end at launch. We stay onboard with ongoing technical support, optimization, and updates — like your extended tech team.",
    icon: Headphones
  }
];

export default function StrategySection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const stepsCount = steps.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stepsCount);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + stepsCount) % stepsCount);
  };

  // Robust auto-slide interval
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stepsCount);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, stepsCount]);

  const getCardTransform = (index) => {
    let diff = index - activeIndex;
    if (diff > stepsCount / 2) diff -= stepsCount;
    if (diff < -stepsCount / 2) diff += stepsCount;

    if (diff === 0) {
      return 'translate-x-0 scale-100 opacity-100 z-30 shadow-[0_0_50px_rgba(168,85,247,0.3)] border-[#A855F7]/40 bg-[#160d29]/90';
    } else if (diff === -1) {
      return '-translate-x-[75%] md:-translate-x-[90%] scale-[0.82] opacity-40 z-20 pointer-events-none -rotate-y-[25deg] bg-[#120824]/70 border-white/5';
    } else if (diff === 1) {
      return 'translate-x-[75%] md:translate-x-[90%] scale-[0.82] opacity-40 z-20 pointer-events-none rotate-y-[25deg] bg-[#120824]/70 border-white/5';
    } else {
      return 'scale-50 opacity-0 z-0 pointer-events-none';
    }
  };

  return (
    <section className="relative w-full py-24 bg-[#0a0711] overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#6b21a8]/15 via-[#a855f7]/10 to-[#ec4899]/15 blur-[130px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            From Vision to Reality
          </h2>
          <p className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] to-[#E879F9]">
            Our Process, Your Success.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#F472B6] to-[#A855F7] mx-auto mt-4 rounded-full" />
        </div>

        {/* 3D Carousel Container */}
        <div
          className="relative w-full max-w-5xl h-[380px] mx-auto flex items-center justify-center [perspective:1200px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                onClick={() => setActiveIndex(index)}
                className={`absolute w-[290px] sm:w-[360px] md:w-[390px] h-[330px] rounded-3xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-xl border transition-all duration-700 ease-out cursor-pointer ${getCardTransform(
                  index
                )}`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#C084FC] bg-white/5 border border-[#A855F7]/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] mb-5">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 tracking-wide">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-4">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-[#A855F7]/20 hover:bg-[#A855F7]/40 border border-[#A855F7]/40 flex items-center justify-center text-[#E879F9] hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
            aria-label="Previous step"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeIndex
                    ? 'w-6 bg-gradient-to-r from-[#F472B6] to-[#A855F7]'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-[#A855F7]/20 hover:bg-[#A855F7]/40 border border-[#A855F7]/40 flex items-center justify-center text-[#E879F9] hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
            aria-label="Next step"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}