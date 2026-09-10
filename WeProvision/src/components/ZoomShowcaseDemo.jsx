import React from 'react';
import ZoomScrollContainer from './ZoomScrollContainer';
import ZoomSection from './ZoomSection';
import { Shield, Sparkles, Cpu, Layers, Rocket, Globe, Smartphone, Eye } from 'lucide-react';

const ZoomShowcaseDemo = () => {
  return (
    <ZoomScrollContainer enableLenis={true}>
      {/* SECTION 1: HERO SHOWCASE - IMMERSIVE DIGITAL EXPERIENCE */}
      <ZoomSection
        scaleTo={1.9}
        fadeStart={0.65}
        pinDistance="140%"
        zIndex={10}
        bgContent={
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.15),transparent_70%)] flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" />
          </div>
        }
        overlayContent={
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Scroll Down to Explore Zoom Effect
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-purple-200/90">
              Next-Generation Digital Craftsmanship
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Notice how the central showcase container scales up smooth 60fps as you scroll, seamlessly fading to reveal the next section.
            </p>
          </div>
        }
      >
        {/* Main Central Visual Container */}
        <div className="relative w-full max-w-4xl h-[65vh] rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-2xl shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden group">
          {/* Top Decorative Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-purple-300/60 uppercase tracking-widest">
              Section 01 // Immersive Zoom
            </span>
          </div>

          {/* Hero Core Visual */}
          <div className="my-auto text-center space-y-6">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
              <div className="relative px-8 py-6 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-center space-x-4">
                <Cpu className="w-12 h-12 text-purple-400 animate-spin-slow" />
                <div className="text-left">
                  <h1 className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-400">
                    WEPROVISION
                  </h1>
                  <p className="text-xs text-purple-300 font-mono tracking-wider">
                    SCROLL-DRIVEN ZOOM TRANSITION ENGINE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-white">60 FPS</div>
              <div className="text-[10px] text-gray-400 uppercase">GPU Accelerated</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-purple-400">1.8x</div>
              <div className="text-[10px] text-gray-400 uppercase">Zoom Scale</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-pink-400">Pinned</div>
              <div className="text-[10px] text-gray-400 uppercase">GSAP Scrub</div>
            </div>
          </div>
        </div>
      </ZoomSection>

      {/* SECTION 2: SPATIAL COMPUTING & VR CORE */}
      <ZoomSection
        scaleTo={2.1}
        fadeStart={0.7}
        pinDistance="150%"
        zIndex={20}
        bgContent={
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] flex items-center justify-center">
            <div className="w-[700px] h-[700px] bg-blue-600/10 rounded-full filter blur-[100px]" />
          </div>
        }
        overlayContent={
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Rocket className="w-3.5 h-3.5" /> Spatial Computing
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-100">
              Boundary-Pushing VR & 3D Environments
            </h3>
          </div>
        }
      >
        <div className="relative w-full max-w-4xl h-[65vh] rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-950/40 via-purple-950/20 to-black/60 backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              Section 02 // Spatial Tech
            </span>
            <span className="flex items-center gap-2 text-xs text-blue-300/80">
              <Eye className="w-4 h-4 text-blue-400" /> Interactive Canvas
            </span>
          </div>

          {/* Center Graphic */}
          <div className="my-auto flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-1 shadow-[0_0_40px_rgba(59,130,246,0.4)] animate-pulse">
              <div className="w-full h-full rounded-full bg-black/90 flex flex-col items-center justify-center text-center p-4">
                <Layers className="w-10 h-10 text-cyan-400 mb-2" />
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  VR Core
                </span>
              </div>
            </div>
            <p className="text-center text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed">
              Elevating web experiences with interactive 3D WebGL models, dynamic lighting shaders, and hardware-accelerated scroll triggers.
            </p>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-500/20 text-xs">
            <div className="p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/20 text-center">
              <span className="text-blue-300 font-bold block">Three.js</span> WebGL 3D
            </div>
            <div className="p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/20 text-center">
              <span className="text-cyan-300 font-bold block">React Fiber</span> Canvas Engine
            </div>
            <div className="p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/20 text-center">
              <span className="text-purple-300 font-bold block">GSAP</span> ScrollTrigger
            </div>
            <div className="p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/20 text-center">
              <span className="text-pink-300 font-bold block">Lenis</span> Smooth Motion
            </div>
          </div>
        </div>
      </ZoomSection>

      {/* SECTION 3: NEXT-GEN SHOWCASE / CTA */}
      <ZoomSection
        scaleTo={1.7}
        fadeStart={0.8}
        pinDistance="120%"
        zIndex={30}
        bgContent={
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.15),transparent_70%)] flex items-center justify-center">
            <div className="w-[600px] h-[600px] bg-pink-600/10 rounded-full filter blur-[100px]" />
          </div>
        }
        overlayContent={
          <div className="space-y-3">
            <h4 className="text-lg font-mono text-pink-400 uppercase tracking-widest">
              Ready to elevate your landing page?
            </h4>
          </div>
        }
      >
        <div className="relative w-full max-w-4xl h-[65vh] rounded-3xl border border-pink-500/20 bg-gradient-to-b from-pink-950/30 via-purple-950/20 to-black/80 backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.2)]">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
            <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
              Section 03 // Production Ready
            </span>
            <Globe className="w-4 h-4 text-pink-400" />
          </div>

          <div className="my-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 mb-2">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Apple-Style Seamless Zoom
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto">
              Fully responsive, memory-safe, and ready to drop into any React & Tailwind CSS codebase.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-pink-500/25 cursor-pointer">
                Explore Demo
              </button>
              <button className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition cursor-pointer">
                View Documentation
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-pink-500/20 text-center text-xs text-gray-400">
            Powered by GSAP ScrollTrigger & Tailwind CSS
          </div>
        </div>
      </ZoomSection>
    </ZoomScrollContainer>
  );
};

export default ZoomShowcaseDemo;
