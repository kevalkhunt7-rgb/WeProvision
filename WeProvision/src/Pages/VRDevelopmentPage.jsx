import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  Glasses,
  Cpu,
  Eye,
  Zap,
  ShieldCheck,
  Layers,
  Radio,
  Activity,
  CheckCircle2,
  Globe,
  Box,
  Compass,
} from 'lucide-react';
import VRCanvas, { SECTION_CONFIGS } from '../components/VRCanvas';

gsap.registerPlugin(ScrollTrigger);

export default function VRDevelopmentPage() {
  const pageRef = useRef(null);
  const [transformState, setTransformState] = useState(SECTION_CONFIGS[0]);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Hook
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP ScrollTrigger synchronized timeline with scrubbed 3D model interpolation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.vr-scroll-section');

      sections.forEach((section, index) => {
        if (index === sections.length - 1) return;

        const nextTransform = SECTION_CONFIGS[index + 1];

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentT = SECTION_CONFIGS[index];

            const posX = gsap.utils.interpolate(currentT.position[0], nextTransform.position[0], progress);
            const posY = gsap.utils.interpolate(currentT.position[1], nextTransform.position[1], progress);

            // Deep Z-arc: pushes 3D model up to -2.2 units back mid-transition so it passes deep behind content
            const zArc = Math.sin(progress * Math.PI) * -2.2;
            const posZ = gsap.utils.interpolate(currentT.position[2], nextTransform.position[2], progress) + zArc;

            const rotX = gsap.utils.interpolate(currentT.rotation[0], nextTransform.rotation[0], progress);
            const rotY = gsap.utils.interpolate(currentT.rotation[1], nextTransform.rotation[1], progress);
            const rotZ = gsap.utils.interpolate(currentT.rotation[2], nextTransform.rotation[2], progress);

            const scale = gsap.utils.interpolate(currentT.scale, nextTransform.scale, progress);
            const exploded = gsap.utils.interpolate(currentT.exploded, nextTransform.exploded, progress);

            setTransformState({
              position: [posX, posY, posZ],
              rotation: [rotX, rotY, rotZ],
              scale,
              exploded,
            });
          }
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative bg-[#05020a] text-white selection:bg-cyan-500 selection:text-black min-h-screen overflow-x-hidden"
    >
      {/* 1. Full-Screen Fixed 3D Canvas Viewport (z-0, pointer-events-none) */}
      <VRCanvas transformState={transformState} isMobile={isMobile} />

      {/* Cyber Background Radial Glow Lights */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#00f0ff]/15 via-[#9333ea]/15 to-[#ec4899]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[750px] h-[750px] bg-gradient-to-br from-[#ec4899]/15 via-[#00f0ff]/10 to-[#a855f7]/15 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />
      </div>

      {/* 2. Scrollable Content Sections Layer (z-10, pointer-events-auto) */}
      <div className="relative z-10 pointer-events-none">

        {/* ============================================================
         * SECTION 01: HERO SECTION
         * Left 6 columns text, Right 6 columns 3D Model Viewport Space
         * ============================================================ */}
        <section className="vr-scroll-section min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto"
            >
              {/* Status Pill Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                <Glasses size={15} className="animate-pulse text-cyan-400" />
                <span>ENTERPRISE VIRTUAL REALITY STUDIO</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                Next-Gen <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899] drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                  Virtual Reality
                </span>{' '}
                Architectures
              </h1>

              {/* Body Description */}
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-xl">
                We engineer enterprise 6DoF VR applications, Unreal & Unity simulation engines, pancake optics shaders, and sub-millimeter hand tracking platforms for medical, aerospace, and real estate industries.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#9333ea] to-[#ec4899] text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_45px_rgba(0,240,255,0.7)] hover:scale-[1.03] transition-all"
                >
                  <span>Schedule VR Demo</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#hardware"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#120a24]/90 border border-cyan-500/30 hover:border-cyan-400 text-zinc-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
                >
                  Explore VR Specs
                </a>
              </div>

              {/* Metrics Highlights Footer */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">4K / Eye</div>
                  <div className="text-[10px] sm:text-xs text-cyan-400 uppercase tracking-wider font-mono mt-1">Micro-OLED Display</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#A855F7]">&lt; 7ms</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-mono mt-1">Motion-to-Photon</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">6DoF</div>
                  <div className="text-[10px] sm:text-xs text-cyan-400 uppercase tracking-wider font-mono mt-1">Spatial Tracking</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 02: HARDWARE & ARCHITECTURE SECTION
         * Left-aligned text; 3D Model sits on the right side
         * ============================================================ */}
        <section id="hardware" className="vr-scroll-section min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-[#A855F7] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Cpu size={14} />
                <span>02. HARDWARE & SENSOR ARCHITECTURE</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Ultra-Low Latency & <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#00F0FF]">
                  Precision Spatial Sensors
                </span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Our virtual reality systems integrate multi-camera computer vision pipelines and custom silicon processing to deliver sub-millimeter positional tracking without external base stations.
              </p>

              {/* Tech Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
                <div className="p-5 rounded-2xl bg-[#120a24]/90 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-2">
                  <div className="flex items-center gap-3 text-purple-400 font-bold text-sm">
                    <Zap size={18} className="text-[#A855F7]" />
                    <span>Sub-7ms Latency</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Proprietary frame prediction algorithm eliminates motion sickness across 120Hz micro-displays.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#120a24]/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl space-y-2">
                  <div className="flex items-center gap-3 text-cyan-400 font-bold text-sm">
                    <Radio size={18} className="text-[#00F0FF]" />
                    <span>Inside-Out Tracking</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Quad infrared wide-angle sensors capture 6DoF room-scale movement effortlessly.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#120a24]/90 border border-pink-500/30 backdrop-blur-xl shadow-xl space-y-2">
                  <div className="flex items-center gap-3 text-pink-400 font-bold text-sm">
                    <Cpu size={18} className="text-[#EC4899]" />
                    <span>Edge Processing</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Dedicated NPU offloads computer vision calculation from the central rendering thread.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#120a24]/90 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-2">
                  <div className="flex items-center gap-3 text-purple-400 font-bold text-sm">
                    <ShieldCheck size={18} className="text-[#A855F7]" />
                    <span>Enterprise Security</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Hardware-level encryption for enterprise simulation data and biometric safety.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 03: OPTICS & DISPLAY (EXPLODED VIEW) SECTION
         * Right-aligned text; 3D Model sits in center with Exploded Visor
         * ============================================================ */}
        <section className="vr-scroll-section min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-start-7 lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-[#00F0FF] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Eye size={14} />
                <span>03. OPTICS & EXPLODED DISPLAY ENGINE</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Micro-OLED Optics & <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899]">
                  Exploded Engine Architecture
                </span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Experience crystal-clear edge-to-edge optical fidelity. Custom pancake lens stacks pair with dual 4K Micro-OLED panels to eliminate god rays, screen door effects, and distortion.
              </p>

              {/* Exploded Architecture Breakdown */}
              <div className="p-6 rounded-2xl bg-[#0e071c]/90 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl space-y-4 w-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase">
                    LENS & DISPLAY SPECIFICATIONS
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    Custom Optics Stack
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dual 4K Micro-OLED Displays</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">3840 x 3552 per eye resolution with 100% DCI-P3 color gamut accuracy.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Folded Pancake Optical Elements</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Reduces headset thickness by 40% while preserving a wide 110° FOV.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Eye-Tracked Foveated Shaders</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Dynamic GPU shading concentrates 80% rendering power on exact gaze point.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 04: 6DOF SPATIAL INTERACTION
         * Right-aligned text; 3D Model sits on the left
         * ============================================================ */}
        <section className="vr-scroll-section min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-start-7 lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-pink-950/80 border border-pink-500/40 text-[#EC4899] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <Activity size={14} />
                <span>04. 6DOF SPATIAL & HAND TRACKING</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Natural Gesture Controls & <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#00F0FF]">
                  Tactile Haptic Feedback
                </span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Break physical barriers with AI-driven optical hand tracking and 6DoF tactile controllers. Users interact naturally with digital objects, tools, and enterprise environments.
              </p>

              {/* Interaction Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
                <div className="p-4 rounded-xl bg-[#130d24]/80 border border-pink-500/20 backdrop-blur-md hover:border-pink-500/40 transition-all">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-sm mb-1">
                    <Compass size={16} />
                    <span>Sub-Millimeter Tracking</span>
                  </div>
                  <p className="text-xs text-zinc-400">Low-latency hand skeleton tracking with 26 joint articulation models.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#130d24]/80 border border-purple-500/20 backdrop-blur-md hover:border-purple-500/40 transition-all">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
                    <Layers size={16} />
                    <span>Physics Interaction Engine</span>
                  </div>
                  <p className="text-xs text-zinc-400">Realistic rigid body collision, soft object manipulation, and weight simulation.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#130d24]/80 border border-cyan-500/20 backdrop-blur-md hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
                    <Radio size={16} />
                    <span>Spatial HRTF Audio</span>
                  </div>
                  <p className="text-xs text-zinc-400">3D binaural directional sound propagation with real-time acoustic reverb physics.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#130d24]/80 border border-purple-500/20 backdrop-blur-md hover:border-purple-500/40 transition-all">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
                    <Globe size={16} />
                    <span>Multi-User Networking</span>
                  </div>
                  <p className="text-xs text-zinc-400">Cloud multiplayer state synchronization for collaborative enterprise training.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 05: FINAL CTA SECTION
         * Lowered Call to Action card with 3D Headset Showcase Overhead
         * ============================================================ */}
        <section id="contact" className="vr-scroll-section min-h-screen flex flex-col justify-end items-center px-6 sm:px-12 max-w-5xl mx-auto pt-56 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#13092b]/95 via-[#0a0518]/95 to-[#05020a]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-8 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>BUILD YOUR VR ECOSYSTEM</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Ready to Architect Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#EC4899]">
                Enterprise Virtual Reality?
              </span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Whether you need high-fidelity industrial training simulators, interactive VR real estate walkthroughs, or medical visualization tools, WeProvision builds world-class VR experiences tailored to your goals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
              <a
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#9333ea] to-[#ec4899] text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] hover:scale-[1.03] transition-all"
              >
                <span>Request Enterprise VR Quote</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#120a24]/90 border border-white/20 hover:border-cyan-400 text-zinc-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
              >
                View VR Case Studies
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
