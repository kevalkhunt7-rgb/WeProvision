import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const DEFAULT_STATUS_MESSAGES = [
  'Preparing your experience',
  'Loading assets',
  'Almost there',
];

const easeOutExpo = [0.16, 1, 0.3, 1];

export default function BrandOrbsLoader({
  statusMessages = DEFAULT_STATUS_MESSAGES,
  onComplete,
  duration = 2800,
}) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    let raf;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsCompleted(true), 350);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * statusMessages.length),
      statusMessages.length - 1
    );
    setStatusIndex(idx);
  }, [progress, statusMessages]);

  const handleExitComplete = () => {
    document.body.style.overflow = '';
    setShouldRender(false);
    if (onComplete) onComplete();
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isCompleted && (
        <motion.div
          key="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#07060B] select-none text-white"
        >
          {/* Subtle dark ambient vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="relative z-10 flex flex-col items-center justify-center px-6"
          >
            {/* Animated Logo Container */}
            <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 mb-10">
              
              {/* 1. Diffuse colored backlight glow that breathes */}
              <motion.div
                className="absolute inset-[-12%] rounded-[48px] blur-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(59, 130, 246, 0.35) 45%, transparent 75%)',
                }}
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.55, 0.9, 0.55],
                }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* 2. Card shell with rotating perimeter border beam */}
              <div className="relative w-full h-full p-[2.5px] rounded-[42px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {/* Rotating Conic Gradient Beam */}
                <motion.div
                  className="absolute -inset-[100%] w-[300%] h-[300%]"
                  style={{
                    background:
                      'conic-gradient(from 0deg at 50% 50%, transparent 0%, #3B82F6 25%, #8B5CF6 50%, #EC4899 75%, transparent 100%)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Card Inner Face */}
                <div className="relative w-full h-full rounded-[40px] bg-[#0E0C17]/95 backdrop-blur-xl flex items-center justify-center p-6 border border-white/5">
                  {/* Subtle inner top-edge glass highlight */}
                  <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  {/* Logo Image */}
                  <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(168,85,247,0.3)]"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Status Line */}
            <div className="h-5 mb-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                  className="text-xs sm:text-sm font-medium tracking-wide text-white/60"
                >
                  {statusMessages[statusIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-44 sm:w-56 h-[3px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)',
                  width: `${progress}%`,
                }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>

            {/* Percentage counter */}
            <div className="mt-3 text-[11px] font-mono tracking-[0.25em] text-white/30 tabular-nums">
              {String(progress).padStart(3, '0')}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}