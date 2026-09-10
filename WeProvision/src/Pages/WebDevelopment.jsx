import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Server,
  Layout,
  Rocket
} from 'lucide-react';
import WebDevCanvas from '../components/WebDevCanvas';

const EASE = [0.16, 1, 0.3, 1];

export default function WebDevelopment() {
  const pageRef = useRef(null);

  return (
    <div
      ref={pageRef}
      className="relative bg-[#05020a] text-white selection:bg-[#F472B6] min-h-screen overflow-x-hidden"
    >
      {/* Fixed Background 3D Viewport (Identical to GameDevelopment.jsx) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <WebDevCanvas pageRef={pageRef} />
        {/* Glow Shaders */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#9333ea]/15 via-[#00f0ff]/10 to-[#ec4899]/15 blur-[180px] rounded-full pointer-events-none" />
      </div>

      {/* Scrollytelling Sections Overlay */}
      <div className="relative z-10">

        {/* ============================================================
         * SECTION 1: HERO SECTION
         * ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-screen items-center px-8 md:px-16 max-w-[1500px] mx-auto pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-6 space-y-6 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#A855F7]/30 text-[#F472B6] text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-lg shadow-purple-950/40">
              <Sparkles size={14} className="animate-pulse text-[#F472B6]" /> FULL-STACK WEB ENGINEERING
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
              Architecting High-Performance,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                Scalable Web Ecosystems
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light max-w-xl">
              We design and engineer enterprise-grade React, Next.js, and Node.js applications optimized for blazing-fast speed, flawless conversion rates, and global scale.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#frontend"
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#9333EA] to-[#db2777] text-white font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(219,39,119,0.35)] hover:shadow-[0_0_35px_rgba(219,39,119,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                <span>Explore Layers</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-[#0e071a]/80 border border-white/15 hover:border-purple-500/50 text-zinc-200 hover:text-white font-semibold text-sm tracking-wide shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 backdrop-blur-md"
              >
                Start Project
              </a>
            </div>
          </motion.div>
        </section>

        {/* ============================================================
         * SECTION 2: FRONTEND LAYER (Expanded Content)
         * ============================================================ */}
        <section id="frontend" className="grid grid-cols-1 lg:grid-cols-13 min-h-screen items-center px-8 md:px-16 max-w-[1800px] mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: '-20% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden lg:col-span-6 backdrop-blur-xl bg-[#0e071a]/85 border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl shadow-purple-950/40 space-y-6 pointer-events-auto"
          >
            {/* Top Accent Gradient Line (Matching GameDev card style) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#818CF8] via-[#EC4899] to-[#F472B6]" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#F472B6] text-xs font-mono uppercase tracking-wider">
              <Layout size={14} /> Frontend Layer
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Next-Gen User Interfaces &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                Immersive Frontend Architecture
              </span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              We build lightning-fast, reactive, and pixel-perfect interfaces utilizing the latest paradigms in web engineering. By leveraging React 19, Next.js App Router, and utility-first Tailwind CSS, we ensure your application delivers buttery-smooth interactions, instant page transitions, and robust client-side state orchestration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-[#C084FC] font-bold text-sm mb-1">React 19 & Next.js Ecosystem</div>
                <p className="text-xs text-zinc-400 leading-normal">
                  Harnessing Server Components (RSC), Edge SSR, and incremental static regeneration for optimal SEO and speed.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-[#F472B6] font-bold text-sm mb-1">Tailwind CSS & WebGL</div>
                <p className="text-xs text-zinc-400 leading-normal">
                  Crafting maintainable design systems, glassmorphism layouts, and immersive 3D/kinetic motion components.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#F472B6] shrink-0" />
                <span>100/100 Lighthouse Performance & Core Web Vitals optimization</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#F472B6] shrink-0" />
                <span>Fluid, mobile-first responsive design across all viewports and devices</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#F472B6] shrink-0" />
                <span>Advanced accessibility (a11y) compliance and optimized asset delivery</span>
              </li>
            </ul>
          </motion.div>
        </section>

        {/* ============================================================
         * SECTION 3: BACKEND & DB LAYER (Expanded Content)
         * ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-11 min-h-screen items-center px-8 md:px-16 max-w-[1800px] mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: '-20% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden lg:col-start-7 lg:col-span-6 backdrop-blur-xl bg-[#0e071a]/85 border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl shadow-pink-950/40 space-y-6 pointer-events-auto"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#C084FC] text-xs font-mono uppercase tracking-wider">
              <Server size={14} /> Backend & DB Layer
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Scalable Microservices &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#00F0FF]">
                Resilient Cloud Databases
              </span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Behind every great UI is a bulletproof backend engine. We architect high-concurrency Node.js and Express services, secure GraphQL/REST endpoints, and optimized NoSQL database structures designed to absorb massive traffic spikes without latency drops or data bottlenecks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-[#C084FC] font-bold text-sm mb-1">Node.js & Express Microservices</div>
                <p className="text-xs text-zinc-400 leading-normal">
                  Building asynchronous, non-blocking APIs capable of handling thousands of concurrent requests seamlessly.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-[#00F0FF] font-bold text-sm mb-1">MongoDB & NoSQL Architecture</div>
                <p className="text-xs text-zinc-400 leading-normal">
                  High-availability schema design, aggregation pipelines, and robust indexing strategies for rapid queries.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C084FC] shrink-0" />
                <span>Automated zero-downtime CI/CD deployment pipelines</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C084FC] shrink-0" />
                <span>Enterprise-grade OAuth2 security, JWT auth, and data encryption</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C084FC] shrink-0" />
                <span>Cloud infrastructure auto-scaling configurations and real-time monitoring</span>
              </li>
            </ul>
          </motion.div>
        </section>

        {/* ============================================================
         * SECTION 4: FULL STACK CTA
         * ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-screen items-center px-8 md:px-16 max-w-7xl mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden lg:col-span-8 lg:col-start-3 backdrop-blur-xl bg-[#0e071a]/85 border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl shadow-purple-950/50 text-center space-y-6 pointer-events-auto"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9333EA] via-[#C026D3] to-[#EC4899]" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#F472B6] text-xs font-mono uppercase tracking-widest">
              <Rocket size={14} /> Full Ecosystem Integration
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to Build Your Next-Gen{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
                Web Ecosystem?
              </span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
              Partner with our elite engineering team to bring your web platform to market with speed, bulletproof reliability, and immersive 3D architecture.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#9333EA] to-[#db2777] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(219,39,119,0.35)] hover:shadow-[0_0_35px_rgba(219,39,119,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                Launch Your Project
              </a>
              <a
                href="#frontend"
                className="px-8 py-4 rounded-xl bg-white/[0.05] border border-white/15 text-zinc-200 hover:text-white font-semibold text-sm hover:bg-white/[0.1] transition-all backdrop-blur-md"
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