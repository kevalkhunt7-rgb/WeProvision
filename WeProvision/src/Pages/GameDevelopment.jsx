import React, { useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Sparkles, ArrowRight, Zap, Trophy, Users, Code2, Cpu, Terminal, Compass, Layers, Shield, Smartphone,
  Glasses,
  Globe,
  Laptop
} from 'lucide-react';
import GameDevCanvas, {
  MobileControllerCanvas,
  MobilePortalCanvas,
  MobileDroneCanvas,
  MobileHologramCanvas,
} from '../components/GameDevCanvas';
import logo from '../assets/sitelogo.png';

const EASE = [0.16, 1, 0.3, 1];

export default function GameDevelopment({ onReset, handleLinkClick }) {
  const scrollRef = useRef(null);
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const features = [
    {
      icon: Trophy,
      title: 'Award-Winning Design',
      description:
        'Our games have received recognition for their innovative gameplay and captivating visual aesthetics.',
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description:
        'We ensure that all our games run smoothly with optimized code and efficient resource management.',
    },
    {
      icon: Users,
      title: 'User-Centered Design',
      description:
        'We build games with the player in mind, creating intuitive interfaces and engaging experiences.',
    },
    {
      icon: Code2,
      title: 'Clean Code Architecture',
      description:
        'Our development practices focus on maintainable code that can evolve with your game\'s success.',
    },
  ];

  const gameCategories = [
    {
      icon: Smartphone,
      title: 'Mobile Games',
      description:
        'Engaging games for iOS and Android platforms, optimized for touch controls and mobile performance.',
      tags: [
        'Casual & Hyper-casual',
        'Puzzle & Strategy',
        'RPG & Adventure',
        'Multiplayer & Online',
        'AR Mobile Games',
        'Game Monetization',
      ],
    },
    {
      icon: Glasses,
      title: 'AR/VR Games',
      description:
        'Immersive experiences that blend digital content with the real world or transport players to entirely new virtual environments.',
      tags: [
        'Oculus & HTC Vive',
        'AR for iOS & Android',
        'Mixed Reality Experiences',
        'Meta Quest Development',
        'Immersive 3D Worlds',
        'Interactive VR Experiences',
      ],
    },
    {
      icon: Code2,
      title: 'Unity-based Games',
      description:
        'Cross-platform games with stunning visuals and physics-based gameplay, powered by the versatile Unity engine.',
      tags: [
        '2D Platformers',
        '3D Action Adventures',
        'Simulation Games',
        'Unity 3D Development',
        'Physics-based Gameplay',
        'Cross-platform Games',
      ],
    },
    {
      icon: Globe,
      title: 'Web Games',
      description:
        'Browser-based games that work across devices with no downloads required, perfect for maximum accessibility.',
      tags: [
        'HTML5 & WebGL',
        'Social & Casual Games',
        'Educational Games',
        'Three.js & 3D Games',
        'Browser Multiplayer',
        'Web-based Game Engines',
      ],
    },
    {
      icon: Users,
      title: 'Multiplayer Games',
      description:
        'Competitive and cooperative experiences that connect players in real-time with robust networking.',
      tags: [
        'Battle Royale',
        'Co-op Experiences',
        'MMO Games',
        'Real-time Multiplayer',
        'Matchmaking Systems',
        'Online Leaderboards',
      ],
    },
    {
      icon: Laptop,
      title: 'PC & Console Games',
      description:
        'High-fidelity gaming experiences designed for the latest console and PC hardware.',
      tags: [
        'PlayStation & Xbox',
        'Nintendo Switch',
        'PC & Mac',
        'High-Fidelity Graphics',
        'Steam Game Development',
        'Console Optimization',
      ],
    },
  ];

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    scrollProgressRef.current = latest;
  });

  return (
    <div ref={scrollRef} className="relative bg-[#05020a] text-white selection:bg-[#F472B6] overflow-x-hidden">

      {/* Desktop Fixed Background 3D Viewport (>= 1024px) */}
      <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none">
        <GameDevCanvas scrollProgress={scrollProgressRef} />
        {/* Glow Shaders */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#9333ea]/15 via-[#00f0ff]/10 to-[#ec4899]/15 blur-[180px] rounded-full pointer-events-none" />
      </div>

      {/* Mobile Ambient Glow Background (< 1024px) */}
      <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#9333ea]/15 via-[#00f0ff]/10 to-[#ec4899]/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Scrollytelling & Content Sections */}
      <div className="relative z-10">

        {/* SECTION 1: HERO */}
        <section className="min-h-0 lg:min-h-screen flex items-center px-4 sm:px-8 lg:px-12 max-w-8xl mx-auto py-12 lg:py-0">
          <div className="flex flex-col lg:grid lg:grid-cols-10 gap-8 items-center w-full">
            
            {/* 1. Controller Model (Top Box on Mobile) */}
            <div className="lg:hidden w-full h-[280px] sm:h-[360px] relative flex items-center justify-center pointer-events-none overflow-hidden my-2">
              <MobileControllerCanvas />
            </div>

            {/* 2. Hero Content (Below Controller Model on Mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="lg:col-span-7 max-w-xl w-full text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#A855F7]/30 text-xs font-mono uppercase tracking-widest text-[#F472B6] mb-6">
                <Sparkles size={13} /> Next-Gen Game Studio
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] sm:leading-[1.05] mb-6">
                Bringing Your Game <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                  Ideas to Life
                </span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                We craft immersive gaming experiences that captivate players and deliver exceptional gameplay across mobile, console, and web platforms.
              </p>

              <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
                <a
                  href="/contact"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white font-medium rounded-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Start Your Project
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: WHY CHOOSE US */}
        <section className="min-h-0 lg:min-h-screen flex items-center px-4 sm:px-8 lg:px-12 max-w-8xl mx-auto py-12 lg:py-20">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center w-full">
            {/* Left 5 columns: 3D model space on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="hidden lg:block lg:col-span-5 pointer-events-none min-h-[400px]"
            />

            {/* 3. Portal Model (Top Box in Section 2 on Mobile) */}
            <div className="lg:hidden w-full h-[280px] sm:h-[360px] relative flex items-center justify-center pointer-events-none overflow-hidden my-2">
              <MobilePortalCanvas />
            </div>

            {/* 4. Second Content (Below Portal Model on Mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="lg:col-span-7 w-full p-6 sm:p-10 rounded-3xl bg-[#0e071a]/85 border border-white/10 backdrop-blur-xl shadow-2xl text-white"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                Why Choose Our{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C084FC] to-[#E879F9]">
                  Game
                </span>{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#C084FC]">
                  Development
                </span>{' '}
                Services?
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
                Our passionate team of game developers blends creativity with technical
                expertise to create unique gaming experiences that stand out in a
                competitive market. We focus on engaging gameplay, stunning visuals, and
                seamless performance across all platforms.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3.5">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-base font-bold mb-1.5 text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: GAME CATEGORIES */}
        <section className="min-h-0 lg:min-h-screen flex items-center px-4 sm:px-8 lg:px-12 max-w-8xl mx-auto py-12 lg:py-20">
          <div className="flex flex-col lg:grid lg:grid-cols-15 gap-8 items-center w-full">
            
            {/* 5. Drone Model (Top Box in Section 3 on Mobile) */}
            <div className="lg:hidden w-full h-[260px] sm:h-[340px] relative flex items-center justify-center pointer-events-none overflow-hidden my-2">
              <MobileDroneCanvas />
            </div>

            {/* 6. Third Content (Shifted to Left 8 Columns on Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="lg:col-span-8 w-full text-white"
            >
              {/* Category Grid: 2 columns on desktop/tablet to keep right side clear for Drone model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-items-center sm:justify-items-stretch">
                {gameCategories.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="relative w-full max-w-sm sm:max-w-none min-h-[360px] p-6 rounded-2xl bg-[#0e071a]/85 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-pink-500/40 hover:bg-[#130b24]/90 transition-all flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Gradient Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#818CF8] via-[#EC4899] to-[#F472B6]" />

                      <div>
                        <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3.5">
                          <Icon size={22} />
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
                          {item.description}
                        </p>
                      </div>

                      {/* Sub-tags list */}
                      <ul className="space-y-2.5 border-t border-white/5 pt-3.5 mt-auto">
                        {item.tags.map((tag, tagIdx) => (
                          <li
                            key={tagIdx}
                            className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>{tag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right 4 columns: Open space on desktop for 3D Cyber Drone model */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="hidden lg:block lg:col-span-4 pointer-events-none min-h-[400px]"
            />
          </div>
        </section>

        {/* SECTION 4: HOLOGRAPHIC MAP / STRATEGY */}
        <section className="min-h-0 lg:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 max-w-8xl mx-auto py-12 lg:py-20">
          {/* 7. Hologram Model (Top Box in Section 4 on Mobile) */}
          <div className="lg:hidden w-full h-[280px] sm:h-[360px] relative flex items-center justify-center pointer-events-none overflow-hidden my-2">
            <MobileHologramCanvas />
          </div>

          {/* 8. Fourth Content (Below Hologram Model on Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-20% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="w-full max-w-lg md:max-w-xl p-6 sm:p-10 rounded-3xl bg-[#0e071a]/75 border border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl"
          >
            {/* Top Glow Accent */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/20 blur-3xl pointer-events-none rounded-full" />

            {/* Logo / Brand Header */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onReset?.();
                handleLinkClick?.('#home');
              }}
              className="inline-flex items-center justify-center mb-4 sm:mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] rounded-xl p-1 group"
            >
              <img
                src={logo}
                alt="WEPROVISION INFOTECH"
                className="h-32 sm:h-48 md:h-64 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            {/* Title */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 -mt-4 sm:-mt-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] via-[#C084FC] to-[#00F0FF]">
                World Matrix
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-zinc-300/90 text-sm sm:text-base leading-relaxed mb-8 max-w-sm sm:max-w-md">
              Real-time biome tessellation and dynamic network topologies built for scalable multiplayer deployments.
            </p>

            {/* CTA Button */}
            <button className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[#9333EA] via-[#C026D3] to-[#EC4899] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all">
              <span>Launch Production Build</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
}