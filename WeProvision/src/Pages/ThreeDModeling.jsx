import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Box,
  Layers,
  Compass,
  Home,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  Cpu
} from 'lucide-react';
import ThreeDModelingCanvas from '../components/ThreeDModelingCanvas';

const EASE = [0.16, 1, 0.3, 1];

export default function ThreeDModeling() {
  const pageRef = useRef(null);

  return (
    <div
      ref={pageRef}
      className="relative bg-[#05020a] text-white selection:bg-[#F472B6] min-h-screen overflow-x-hidden"
    >
      {/* Fixed Background 3D Viewport Layer (z-0) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ThreeDModelingCanvas pageRef={pageRef} />
        {/* Cyber Ambient Radial Glow Shader */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#9333ea]/15 via-[#00f0ff]/10 to-[#ec4899]/15 blur-[180px] rounded-full pointer-events-none" />
      </div>

      {/* Scrollytelling HTML Content Layer (z-10) */}
      <div className="relative z-10">

        {/* ============================================================
         * SECTION 1: HERO (3D Suitcase Product Showcase)
         * Left-aligned Content (Columns 1-7) & Right-aligned 3D Suitcase Model (Columns 8-12)
         * ============================================================ */}
        <section className="min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left 7 Columns: Left-aligned Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="lg:col-span-7 flex flex-col items-start text-left space-y-6 pointer-events-auto"
            >
              {/* Pill Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#A855F7]/30 text-xs font-mono uppercase tracking-widest text-[#F472B6] backdrop-blur-md shadow-lg shadow-purple-950/40">
                <Sparkles size={14} className="animate-pulse text-[#F472B6]" />
                <span>3D CGI & SPATIAL ASSET STUDIO</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                Immersive 3D{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                  Ecosystem
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-300 text-base sm:text-lg font-light leading-relaxed max-w-xl">
                Photorealistic hard-surface asset pipelines, product visualizers, sci-fi interior environments, and real-time interactive 3D WebGL experiences.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#drone-section"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#9333EA] to-[#db2777] text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(219,39,119,0.35)] hover:shadow-[0_0_35px_rgba(219,39,119,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <span>Explore 3D Pipeline</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 rounded-xl bg-[#0e071a]/80 border border-white/15 hover:border-purple-500/50 text-zinc-200 hover:text-white font-semibold text-sm tracking-wide uppercase shadow-lg hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
                >
                  Request Custom 3D Model
                </a>
              </div>

              {/* Scroll Indicator Prompt */}
              <div className="pt-6 flex items-center gap-3 text-zinc-500 text-xs font-mono uppercase tracking-widest">
                <div className="w-5 h-8 border-2 border-purple-500/40 rounded-full flex justify-center pt-1.5">
                  <div className="w-1.5 h-2 bg-[#F472B6] rounded-full animate-pulse" />
                </div>
                <span>Scroll to navigate 3D space</span>
              </div>
            </motion.div>

            {/* Right 5 Columns: Reserved Space for 3D Suitcase Model */}
            <div className="hidden lg:block lg:col-span-5 pointer-events-none min-h-[500px]" />

          </div>
        </section>

        {/* ============================================================
         * SECTION 2: PRECISION DRONE MODELING (Left Content, Right Drone)
         * Left Text Box: "Precision Drone Modeling"
         * 3D Action: Drone flies upward/outward, scales to 1.2x, shifts right with 360 rotation
         * ============================================================ */}
        <section id="drone-section" className="min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left 5 Columns: Content Text Box */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative overflow-hidden lg:col-span-5 backdrop-blur-xl bg-[#0e071a]/85 border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl shadow-purple-950/40 space-y-6 pointer-events-auto"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#818CF8] via-[#EC4899] to-[#F472B6]" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#F472B6] text-xs font-mono uppercase tracking-wider">
                <Box size={14} /> HARD-SURFACE CGI PIPELINE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F472B6] leading-tight">
                Precision Drone{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                  Modeling
                </span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Industrial hard-surface CAD precision meets optimized low-polygon real-time asset topology. We sculpt high-frequency mechanical details, bake 8K PBR maps, and optimize geometry for zero-latency WebGL viewports.
              </p>

              {/* Feature Sub-cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[#C084FC] font-bold text-sm mb-1 flex items-center gap-2">
                    <Layers size={16} className="text-[#F472B6]" />
                    <span>Sub-D Topology</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Clean quad-based edge flow, sharp bevel baking, and zero shading artifacts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[#00F0FF] font-bold text-sm mb-1 flex items-center gap-2">
                    <Zap size={16} className="text-[#00F0FF]" />
                    <span>8K PBR Textures</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Substance Painter materials, wear-and-tear weathering, and emissive glow maps.
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F472B6] shrink-0" />
                  <span>Real-time Draco compressed GLTF / GLB exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F472B6] shrink-0" />
                  <span>Procedural mechanical animations & thrust particle setups</span>
                </li>
              </ul>
            </motion.div>

            {/* Right 7 Columns: Transparent Space Reserved for 3D Cyber-Drone */}
            <div className="hidden lg:block lg:col-span-7 pointer-events-none min-h-[500px]" />

          </div>
        </section>

        {/* ============================================================
         * SECTION 3: INSIDE THE ENVIRONMENT (Right Content, Left Environment)
         * Right Text Box: "Inside the Environment"
         * 3D Action: Drone shifts left/back; sci-fi room moves into focus
         * ============================================================ */}
        <section className="min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left 6 Columns: Space Reserved for 3D Cyber Room Focus */}
            <div className="hidden lg:block lg:col-span-6 pointer-events-none min-h-[500px]" />

            {/* Right 6 Columns: Content Text Box */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative overflow-hidden lg:col-span-6 backdrop-blur-xl bg-[#0e071a]/85 border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl shadow-pink-950/40 space-y-6 pointer-events-auto"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#C084FC] text-xs font-mono uppercase tracking-wider">
                <Compass size={14} /> SPATIAL & ARCHITECTURAL 3D
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Inside the{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#00F0FF]">
                  Environment
                </span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Designing expansive sci-fi interiors, volumetric lighting setups, and dynamic environment art. We construct full 3D spatial worlds with custom WebGL camera paths, realistic occlusion, and atmospheric shaders.
              </p>

              {/* Feature Sub-cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[#C084FC] font-bold text-sm mb-1 flex items-center gap-2">
                    <Globe size={16} className="text-[#C084FC]" />
                    <span>Sci-Fi World Bakes</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Complex modular interior kits, emissive neon panels, and metallic surfaces.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                  <div className="text-[#F472B6] font-bold text-sm mb-1 flex items-center gap-2">
                    <Cpu size={16} className="text-[#F472B6]" />
                    <span>Volumetric Lighting</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Custom GLSL light bloom, fog shaders, and baked Global Illumination (GI).
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#C084FC] shrink-0" />
                  <span>Real-time raycast bounds & camera collision detection</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#C084FC] shrink-0" />
                  <span>Optimized draw calls & occlusion culling for high FPS</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </section>

        {/* ============================================================
         * SECTION 4: CLIMAX - ZOOM INSIDE THE HOUSE (Welcome Inside)
         * Centered Heading: "Welcome Inside"
         * 3D Action: House scales up dramatically (4.5x+) with camera zoom inside
         * ============================================================ */}
        <section className="min-h-screen flex items-center justify-center px-6 sm:px-12 max-w-7xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden w-full max-w-3xl backdrop-blur-xl bg-[#0e071a]/85 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl shadow-purple-950/50 text-center space-y-6 pointer-events-auto"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9333EA] via-[#C026D3] to-[#EC4899]" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#F472B6] text-xs font-mono uppercase tracking-widest">
              <Home size={14} /> ARCHITECTURAL DEEP INTERIOR EXPLORATION
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Welcome{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                Inside
              </span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
              You are now inside the interactive 3D space. Partner with our CGI engineering studio to build photorealistic models, spatial environments, and interactive WebGL experiences.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#9333EA] to-[#db2777] text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(219,39,119,0.35)] hover:shadow-[0_0_35px_rgba(219,39,119,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <span>Launch Production Build</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#drone-section"
                className="px-8 py-4 rounded-xl bg-white/[0.05] border border-white/15 text-zinc-200 hover:text-white font-semibold text-sm tracking-wide uppercase hover:bg-white/[0.1] transition-all backdrop-blur-md"
              >
                Replay 3D Choreography
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
