import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Zap, Layers } from 'lucide-react';
import videoSrc from '../assets/hero-bg.mp4'; // Replace with your high-res 3D rendered clip

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoHero() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure metadata is loaded to calculate frame durations
    const onLoadedMetadata = () => {
      const videoDuration = video.duration || 5;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=350%', // Scroll depth determines scrubbing speed
          pin: true,
          scrub: 1.2, // Smooth interpolation lag
        },
      });

      // 1. Scrub video playback from 0s to end
      tl.to(video, {
        currentTime: videoDuration,
        ease: 'none',
      }, 0);

      // 2. Animate Chapter 1 text (Fades out quickly)
      tl.to(text1Ref.current, {
        opacity: 0,
        y: -60,
        filter: 'blur(10px)',
        duration: 0.8,
      }, 0.2);

      // 3. Animate Chapter 2 floating card (Fades in, holds, fades out)
      tl.fromTo(
        text2Ref.current,
        { opacity: 0, y: 80, filter: 'blur(10px)', scale: 0.9 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1 },
        1.2
      );
      tl.to(text2Ref.current, {
        opacity: 0,
        y: -60,
        filter: 'blur(10px)',
        scale: 1.05,
        duration: 0.8,
      }, 2.4);

      // 4. Animate Chapter 3 final CTA
      tl.fromTo(
        text3Ref.current,
        { opacity: 0, y: 80, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1 },
        2.8
      );
    };

    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black text-white">
      
      {/* Scroll-Scrubbed Background 3D Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Cyber/Dark Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07040d] via-black/30 to-black/60 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[#3b0764]/15 mix-blend-color pointer-events-none z-[1]" />

      {/* ================= CHAPTER 1 (Initial Viewport) ================= */}
      <div
        ref={text1Ref}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-[#F472B6] mb-6 shadow-[0_0_25px_rgba(244,114,182,0.4)]">
          <Sparkles size={13} />
          Cinematic Real-Time Engine
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl">
          CREATIVE <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-[#C084FC] to-[#F472B6]">
            DIGITAL EXPERIENCES
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-zinc-300 max-w-xl">
          Scroll down to initiate volumetric camera travel through immersive digital space.
        </p>

        <div className="mt-8 flex items-center gap-2 text-xs font-mono tracking-widest text-[#00F0FF] uppercase animate-pulse">
          <span>↓ SCRUB TO NAVIGATE</span>
        </div>
      </div>

      {/* ================= CHAPTER 2 (Middle Scrub Hologram Card) ================= */}
      <div
        ref={text2Ref}
        className="absolute inset-0 flex items-center justify-center px-6 z-10 pointer-events-none opacity-0"
      >
        <div className="max-w-md w-full bg-[#120824]/80 backdrop-blur-xl border border-[#C084FC]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
          <div className="flex items-center gap-2 text-[#00F0FF] text-xs font-mono uppercase tracking-widest mb-3">
            <Zap size={14} /> SYSTEM ENVIRONMENT
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            High-Fidelity Virtual Realism
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
            Pre-computed path tracing fused with real-time browser shaders delivers 120 FPS immersion without client hardware constraints.
          </p>
          <div className="h-1 w-full bg-gradient-to-r from-[#00F0FF] to-[#EC4899] rounded-full" />
        </div>
      </div>

      {/* ================= CHAPTER 3 (End of Scrubbing Hero) ================= */}
      <div
        ref={text3Ref}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 opacity-0"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
          Ready to Build Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#00F0FF]">
            Next Dimension?
          </span>
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base max-w-lg mb-8">
          Combine WebGL hardware acceleration, video-scrub cinematic timelines, and custom physics.
        </p>

        <a
          href="#contact"
          className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Start Project</span>
          <ArrowRight size={15} />
        </a>
      </div>

    </div>
  );
}