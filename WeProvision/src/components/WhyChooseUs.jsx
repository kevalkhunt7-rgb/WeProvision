import React from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckSquare, SmilePlus, Building2 } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const STATS_DATA = [
  {
    id: 'experience',
    icon: Settings,
    value: '3+',
    label: 'Years Experience',
  },
  {
    id: 'projects',
    icon: CheckSquare,
    value: '250+',
    label: 'Successful Projects',
  },
  {
    id: 'clients',
    icon: SmilePlus,
    value: '250+',
    label: 'Happy Clients',
  },
  {
    id: 'industries',
    icon: Building2,
    value: '150+',
    label: 'Industries Served',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="relative bg-[#07050e] text-white py-20 px-6 sm:px-10 lg:px-12 overflow-hidden selection:bg-[#F472B6]">
      {/* Background ambient lighting accents */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-900/10 via-pink-900/15 to-purple-900/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-white">Why </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#EC4899] to-[#E056FD]">
              Choose Us?
            </span>
          </h2>
        </motion.div>

        {/* Stat Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {STATS_DATA.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[#131926]/90 backdrop-blur-xl border border-[#273248] hover:border-[#F472B6]/40 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-5 shadow-xl hover:shadow-2xl hover:shadow-pink-950/30 transition-all duration-300"
              >
                {/* Subtle card interior glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#F472B6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon Container */}
                <div className="relative p-3 rounded-xl text-[#F472B6] group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={48} strokeWidth={1.75} className="drop-shadow-[0_0_12px_rgba(244,114,182,0.3)]" />
                </div>

                {/* Big Stat Value */}
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
                  {item.value}
                </div>

                {/* Stat Label */}
                <div className="text-sm sm:text-base font-medium text-[#F472B6]/90 tracking-wide">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
