import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const AUTOPLAY_MS = 5000;

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Their web development team created a beautiful, responsive website that has significantly increased our conversions. Highly recommend their services!",
    client: "Selesta Cosmetic 2021",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 2,
    quote: "The game our company developed with Weprovision exceeded all expectations. Their creative approach and technical skills made our vision come to life.",
    client: "Top Dev - Crafting a Distinctive Brand Identity",
    avatar: "https://i.pravatar.cc/150?img=33"
  },
  {
    id: 3,
    quote: "Working with the UI/UX design team was a game-changer for our app. They transformed our user interface and the results speak for themselves.",
    client: "Blacksteel Fintech Website Development",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 4,
    quote: "Weprovision delivered our 3D product showcase on time with breathtaking visual quality. Their attention to detail is second to none.",
    client: "Apex 3D Interactive Studio",
    avatar: "https://i.pravatar.cc/150?img=68"
  },
  {
    id: 5,
    quote: "The VR training simulation they built reduced our employee onboarding time by 40%. Outstanding technical expertise and execution.",
    client: "Vanguard Immersive Tech",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    scale: 0.96
  })
};

export default function TestimonialsCom() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  }, []);

  const goTo = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Auto-slide — restarts on any manual navigation, pauses on hover.
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(TESTIMONIALS[(currentIndex + i) % TESTIMONIALS.length]);
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="relative bg-[#07050e] py-20 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-white/5">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-900/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          >
            What Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#EC4899]">
              Clients Say
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-zinc-400 text-sm sm:text-base font-light"
          >
            Don't just take our word for it — here's what our clients have to say about working with us.
          </motion.p>
        </div>

        {/* Testimonials Slider Wrapper */}
        <div
          className="relative px-2 sm:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Testimonials"
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#120a24]/90 border border-white/15 text-zinc-300 hover:text-white hover:border-[#C084FC] hover:bg-[#C084FC]/20 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Testimonials"
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#120a24]/90 border border-white/15 text-zinc-300 hover:text-white hover:border-[#C084FC] hover:bg-[#C084FC]/20 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md"
          >
            <ChevronRight size={22} />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <AnimatePresence mode="popLayout" custom={direction}>
              {visibleItems.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${currentIndex}-${idx}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 hover:border-[#C084FC]/50 rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:-translate-y-1.5 transition-all duration-300 shadow-2xl min-h-[300px] overflow-hidden"
                >
                  {/* Gradient accent line on top edge */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Oversized watermark quote mark */}
                  <Quote
                    size={110}
                    className="absolute -top-4 -right-4 text-[#C084FC]/[0.06] rotate-180 fill-current pointer-events-none"
                  />

                  <div className="relative space-y-4">
                    <div className="text-purple-400/70 group-hover:text-[#C084FC] transition-colors duration-300">
                      <Quote size={34} className="transform rotate-180 fill-current opacity-90" />
                    </div>

                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Client Info Footer */}
                  <div className="relative flex items-center gap-3.5 pt-4 border-t border-white/5">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-purple-500/40 shrink-0 shadow-md group-hover:border-[#C084FC] transition-colors duration-300">
                      <img
                        src={item.avatar}
                        alt={item.client}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="text-white font-bold text-xs sm:text-sm tracking-wide leading-tight group-hover:text-purple-200 transition-colors">
                      {item.client}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Pagination Dots — active dot fills as a progress bar
            timed to the autoplay interval, pauses while hovered. */}
        <div className="flex items-center justify-center gap-2.5 pt-4">
          {TESTIMONIALS.map((_, dotIdx) => {
            const isActive = dotIdx === currentIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => goTo(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                  isActive ? 'w-8 h-2.5 bg-white/15' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                }`}
              >
                {isActive && (
                  <motion.span
                    key={`${currentIndex}-${isPaused}`}
                    initial={{ width: '0%' }}
                    animate={{ width: isPaused ? '0%' : '100%' }}
                    transition={{ duration: isPaused ? 0.2 : AUTOPLAY_MS / 1000, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}