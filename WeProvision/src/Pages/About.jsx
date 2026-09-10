import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Target, Eye, UserCheck, Award, ArrowRight, Plus } from 'lucide-react';
import ourStoryImg from '../assets/our_story_team.png';
import blacksteelImg from '../assets/blacksteel_fintech.png';

const EASE = [0.16, 1, 0.3, 1];

const STORY_MILESTONES = [
  {
    year: '2015',
    title: 'Founded with a vision',
    text: "Weprovision Infotech started with a vision to bridge the gap between cutting-edge technology and practical business solutions — a small team of developers and designers.",
  },
  {
    year: 'Growth',
    title: 'Continuous learning',
    text: "Our journey has been defined by continuous learning, adaptation, and a relentless pursuit of excellence, growing into a full-service IT company.",
  },
  {
    year: 'Today',
    title: 'AR/VR and beyond',
    text: "We've expanded into emerging technologies like AR/VR while maintaining our commitment to web development, design, and digital marketing.",
  },
  {
    year: 'Now',
    title: 'Across industries',
    text: 'We serve clients across multiple industries and regions, helping them navigate the digital landscape and achieve their business objectives.',
  },
];

const CORE_VALUES = [
  {
    icon: Target,
    title: 'Innovation',
    description: "We constantly push the boundaries of what's possible, embracing new technologies and approaches to deliver cutting-edge solutions.",
  },
  {
    icon: Eye,
    title: 'Quality',
    description: "We're committed to excellence in everything we do, from code quality to design aesthetics and user experience.",
  },
  {
    icon: UserCheck,
    title: 'Client Focus',
    description: 'We put our clients at the center of our work, ensuring their goals and expectations drive our project approach.',
  },
  {
    icon: Award,
    title: 'Integrity',
    description: 'We operate with transparency, honesty, and responsibility in all our client and team interactions.',
  },
];

export default function About() {
  const prefersReducedMotion = useReducedMotion();
  const [openValue, setOpenValue] = useState(0);

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.75', 'end 0.4'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative bg-[#07050e] text-white selection:bg-[#F472B6] min-h-screen overflow-x-hidden pt-28 md:pt-36">
      {/* Background ambient lighting accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-900/15 blur-[160px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[500px] h-[500px] bg-pink-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-10 w-[600px] h-[600px] bg-violet-950/20 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 space-y-28 md:space-y-36">
        {/* ============================================================
         * SECTION 1: HERO — one orchestrated entrance instead of a
         * simple fade: headline masks upward, the subtitle settles in
         * after, with a soft glow pulse behind it.
         * ============================================================ */}
        <section className="relative text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F472B6]/10 to-[#C084FC]/10 blur-3xl rounded-full"
          />

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
            >
              About Weprovision Infotech
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="text-zinc-300 text-base sm:text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed"
          >
            We're a team of passionate technologists dedicated to creating innovative digital solutions that drive business growth.
          </motion.p>
        </section>

        {/* ============================================================
         * SECTION 2: OUR STORY — now a real timeline instead of three
         * stacked paragraphs, since founding → growth → today is
         * genuinely sequential. The connector line fills in as you
         * scroll through it; the image anchors the top of the line.
         * ============================================================ */}
        <section ref={timelineRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-5 relative"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
              Our Story
            </h2>

            <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-950/40 group">
              <img
                src={ourStoryImg}
                alt="Weprovision Infotech Team Collaboration"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#7c3aed] via-[#9333ea] to-[#c084fc] flex flex-col items-center justify-center text-white shadow-xl shadow-purple-600/50 border-4 border-[#07050e] transform transition-transform hover:scale-110">
              <span className="text-xs sm:text-sm font-medium tracking-wide opacity-90">Since</span>
              <span className="text-lg sm:text-xl font-black leading-tight">2015</span>
            </div>
          </motion.div>

          <div className="lg:col-span-7 relative pl-10 pt-16 lg:pt-20">
            <div className="absolute left-[3px] top-16 lg:top-20 bottom-2 w-px bg-white/10" />
            <motion.div
              style={{ scaleY: prefersReducedMotion ? 1 : lineScale }}
              className="absolute left-[3px] top-16 lg:top-20 bottom-2 w-px bg-gradient-to-b from-[#F472B6] to-[#C084FC] origin-top"
            />

            <div className="space-y-10">
              {STORY_MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className="relative"
                >
                  <span className="absolute -left-10 top-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#F472B6] to-[#C084FC] ring-4 ring-[#07050e]" />
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#C084FC]">
                      {m.year}
                    </span>
                    <h3 className="text-lg font-bold text-white">{m.title}</h3>
                  </div>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light max-w-lg">
                    {m.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 3: OUR CORE VALUES — an interactive accordion list
         * in place of four identical static cards. Only the active
         * item is expanded, so the motion here answers the reader's
         * own click rather than firing automatically on scroll.
         * ============================================================ */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#C084FC]">
                Core Values
              </span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light">
              These values guide our approach to work, team culture, and client relationships.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0e071a]/60 backdrop-blur-xl overflow-hidden divide-y divide-white/10">
            {CORE_VALUES.map((item, index) => {
              const Icon = item.icon;
              const isOpen = openValue === index;
              return (
                <div key={item.title}>
                  <button
                    onClick={() => setOpenValue(isOpen ? -1 : index)}
                    className="w-full flex items-center gap-5 px-6 sm:px-8 py-6 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C084FC] group"
                  >
                    <div
                      className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen
                          ? 'bg-[#C084FC] border-[#C084FC] text-white'
                          : 'bg-purple-950/60 border-purple-500/30 text-[#C084FC] group-hover:border-[#C084FC]/60'
                        }`}
                    >
                      <Icon size={20} />
                    </div>

                    <span className="text-lg sm:text-xl font-bold text-white tracking-wide flex-1">
                      {item.title}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="shrink-0 text-zinc-400"
                    >
                      <Plus size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 sm:px-8 pb-6 pl-[4.75rem] pr-8 text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
         * SECTION 4: WHAT CUSTOMERS SAY ABOUT US — image and quote now
         * share one panel with the image bleeding to the edge, rather
         * than sitting in its own separately-framed card beside text.
         * ============================================================ */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              What Customers{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#C084FC]">
                Say About Us
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative bg-[#0d0718]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch relative z-10">
              <div className="lg:col-span-5 relative min-h-[280px]">
                <img
                  src={blacksteelImg}
                  alt="Blacksteel Fintech Website Development"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d0718]/90" />
              </div>

              <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 space-y-6 flex flex-col justify-center">
                <span className="text-6xl leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#C084FC]">
                  "
                </span>
                <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light -mt-6">
                  <p>
                    Working with Weprovision Infotech has been transformative for our business. Their team's technical expertise and innovative approach helped us modernize our entire digital infrastructure.
                  </p>
                  <p>
                    What truly sets them apart is their attention to detail and commitment to understanding our unique needs. They didn't just deliver a solution; they became a strategic partner in our digital transformation journey.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-white font-bold text-base sm:text-lg tracking-wide">
                    Blacksteel Fintech Website Development
                  </h4>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================
         * SECTION 5: CTA BANNER — unchanged in spirit, tightened
         * entrance so it feels like one deliberate reveal.
         * ============================================================ */}
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4c1d95] via-[#581c87] to-[#701a75] p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl shadow-purple-950/60 border border-white/15"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Transform Your Digital Presence?
            </h2>

            <p className="text-purple-100/90 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Contact us today to discuss how our team can help you achieve your business goals through innovative technology solutions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#contact"
                className="px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm shadow-lg hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get in Touch
              </a>

              <a
                href="/services/web-development"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
              >
                <span>View Our Services</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}