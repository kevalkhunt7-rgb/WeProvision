import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TECH_DATA, CATEGORIES } from '../data/toolsData.jsx';

export default function ToolsTechCom() {
  const [activeTab, setActiveTab] = useState('Mobile');

  return (
    <section className="relative bg-[#07050e] py-20 px-6 sm:px-10 lg:px-12 overflow-hidden border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12 text-center">
        {/* Header Title */}
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          >
            Tools & Technologies We{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
              Specialize In
            </span>
          </motion.h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none ${isActive
                    ? 'text-white bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#EC4899] shadow-lg shadow-purple-600/30 scale-105'
                    : 'text-zinc-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Technology Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 pt-4"
          >
            {TECH_DATA[activeTab]?.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-[#0e0a1a]/80 backdrop-blur-xl border border-white/10 hover:border-[#C084FC]/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-4 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(192,132,252,0.2)]"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {tech.svg}
                </div>

                <span className="text-white font-semibold text-xs sm:text-sm tracking-wide group-hover:text-[#C084FC] transition-colors duration-200">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}