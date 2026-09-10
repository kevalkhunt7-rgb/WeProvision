import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, ArrowRight, X, Layers, Code, Box, Eye, CheckCircle2 } from 'lucide-react';
import blacksteelImg from '../assets/blacksteel_fintech.png';
import ourStoryImg from '../assets/our_story_team.png';
import Footer from '../components/Footer';

const EASE = [0.16, 1, 0.3, 1];

const CATEGORIES = [
  'All Work',
  'Web Development',
  '3D & CGI Modeling',
  'VR & Metaverse',
  'Game Development',
  'Graphics & Branding'
];

const PROJECTS = [
  {
    id: 1,
    title: 'BlackSteel Fintech Analytics Suite',
    category: 'Web Development',
    image: blacksteelImg,
    subtitle: 'Next-Gen Financial Dashboard & Real-Time Trading Platform',
    description: 'A enterprise-grade fintech dashboard built for real-time financial data visualization, automated portfolio rebalancing, and secure transaction execution.',
    techStack: ['React', 'Next.js 14', 'Tailwind CSS', 'Node.js', 'Recharts'],
    metrics: [
      { label: 'Lighthouse Performance', value: '100/100' },
      { label: 'Page Load Speed', value: '3x Faster' },
      { label: 'Active Users', value: '50K+' }
    ],
    features: [
      'Real-time WebSocket data streaming for instant price ticks',
      'Glassmorphic dark theme UI designed for extended viewing sessions',
      'End-to-end encrypted transaction flow and session management'
    ]
  },
  {
    id: 2,
    title: 'Cybernetic Walking Mech 3D Asset',
    category: '3D & CGI Modeling',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'High-Poly Photorealistic Rigged Sci-Fi Character',
    description: 'A fully rigged, PBR-textured sci-fi walking robot engineered for real-time WebGL viewports, cinematic renders, and Unreal Engine 5 games.',
    techStack: ['Blender', 'ZBrush', 'Substance Painter', 'GLTF / WebGL'],
    metrics: [
      { label: 'Texture Resolution', value: '8K PBR' },
      { label: 'Polygon Count', value: '45K Polys' },
      { label: 'Frame Rate', value: '60 FPS WebGL' }
    ],
    features: [
      'Complete skeleton rigging with inverse kinematics (IK)',
      'Substance Painter PBR material maps for roughness, metallic, and normal details',
      'Optimized geometry LODs for smooth in-browser WebGL rendering'
    ]
  },
  {
    id: 3,
    title: 'NeoVerse Spatial VR Simulator',
    category: 'VR & Metaverse',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Immersive Industrial Training & 6DOF Collaborative Environment',
    description: 'A spatial virtual reality simulation platform designed for enterprise engineering teams to conduct interactive safety drills and 3D CAD reviews.',
    techStack: ['Unity', 'Meta Quest 3', 'WebXR', 'C#', 'OpenXR'],
    metrics: [
      { label: 'Target Frame Rate', value: '90 FPS Stable' },
      { label: 'Tracking Mode', value: '6DOF Spatial' },
      { label: 'Multiplayer Capacity', value: '32 Users' }
    ],
    features: [
      'Haptic feedback integration for realistic tool handling',
      'Real-time voice chat and multiplayer avatar synchronization',
      'Cross-platform support for Meta Quest, HTC Vive, and Apple Vision Pro'
    ]
  },
  {
    id: 4,
    title: 'Phantom Realm Action RPG',
    category: 'Game Development',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Fast-Paced Hack-and-Slash Action RPG with Shader FX',
    description: 'An action-packed 3D RPG featuring dynamic combat combos, custom HLSL shaders, particle magic effects, and rich fantasy environments.',
    techStack: ['Unity', 'C#', 'Shader Graph', 'Cinemachine', 'Post-Processing'],
    metrics: [
      { label: 'Console Performance', value: '60 FPS' },
      { label: 'Levels Built', value: '12 Maps' },
      { label: 'Combat Mechanics', value: 'Fluid Combo FX' }
    ],
    features: [
      'Custom Shader Graph VFX for elemental spells and blade trails',
      'Dynamic Cinemachine camera tracking for cinematic boss encounters',
      'Adaptive AI enemy behaviors and pathfinding algorithms'
    ]
  },
  {
    id: 5,
    title: 'Aura Vision Brand Identity & UI Kit',
    category: 'Graphics & Branding',
    image: ourStoryImg,
    subtitle: 'Comprehensive Design System & Premium Brand Assets',
    description: 'A complete brand identity redesign including logo mark, typography guidelines, iconography set, and a 30+ view UI component design system.',
    techStack: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Design Tokens'],
    metrics: [
      { label: 'UI Views Designed', value: '30+ Screens' },
      { label: 'Component Tokens', value: '150+ Tokens' },
      { label: 'Brand Guidelines', value: 'Complete' }
    ],
    features: [
      'Flexible dark/light design token palette with accessibility compliance',
      'Vector icon pack tailored for web, iOS, and Android applications',
      'Comprehensive brand book detailing logo usage, typography scale, and color rules'
    ]
  },
  {
    id: 6,
    title: 'HyperDrive CGI Cinematic Commercial',
    category: '3D & CGI Modeling',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Photorealistic Automotive Visual Effects Commercial',
    description: 'A 4K ray-traced CGI product commercial showcasing aerodynamics, custom carbon fiber materials, and dramatic volumetric studio lighting.',
    techStack: ['Maya', 'Redshift', 'Octane Render', 'After Effects'],
    metrics: [
      { label: 'Render Resolution', value: '4K Cinema' },
      { label: 'Ray-Tracing', value: 'Path Traced' },
      { label: 'Color Grade', value: 'ACEScg' }
    ],
    features: [
      'Physically accurate optical lens dispersion and depth of field',
      'Custom procedural paint shader with multi-coat metallic flake flakes',
      'Volumetric atmospheric fog and dynamic lighting passes'
    ]
  }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All Work');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsList, setProjectsList] = useState(PROJECTS);

  React.useEffect(() => {
    const fetchLivePortfolio = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/portfolio');
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
          setProjectsList(data);
        }
      } catch (err) {
        console.warn('Using default portfolio projects fallback:', err.message);
      }
    };
    fetchLivePortfolio();
  }, []);

  const filteredProjects = projectsList.filter((project) => {
    if (activeCategory === 'All Work') return true;
    return project.category === activeCategory;
  });

  return (
    <div className="relative bg-[#07050e] text-white selection:bg-[#C084FC] selection:text-white min-h-screen pt-28 overflow-x-hidden">
      
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/15 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-16 pb-24">

        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[#C084FC] font-mono text-xs font-bold tracking-wider w-fit shadow-lg shadow-purple-950/40 mx-auto">
            <Sparkles size={14} />
            <span>OUR WORK & CASE STUDIES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Transformative Digital{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#00F0FF]">
              Projects
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            Explore our showcase of web platforms, 3D modeling assets, immersive VR/AR experiences, CGI animation, and high-performance applications built for global brands.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-lg shadow-purple-950/60'
                    : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9333ea] via-[#c026d3] to-[#ec4899]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid Showcase */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="group relative bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 hover:border-[#C084FC]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
              >
                <div>
                  {/* Image Container with Hover Zoom */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-purple-950/40">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e071a] via-transparent to-transparent opacity-80" />

                    {/* Category Badge overlay */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-purple-300">
                      {project.category}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#C084FC] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-purple-300/80 font-medium">
                        {project.subtitle}
                      </p>
                    </div>

                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer / Details Button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-3 rounded-xl bg-purple-950/60 hover:bg-[#C026D3]/30 border border-purple-500/30 hover:border-[#C026D3] text-white text-xs font-bold tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                  >
                    <span>View Case Study</span>
                    <Eye size={15} className="text-[#C084FC]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4c1d95] via-[#581c87] to-[#701a75] p-8 sm:p-12 text-center text-white shadow-2xl border border-white/15 mt-16"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Have a Project in Mind?
            </h2>
            <p className="text-purple-100/90 text-sm sm:text-base font-light leading-relaxed">
              Let's collaborate to bring your vision to life with world-class engineering and breathtaking design.
            </p>
            <div className="pt-2">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-zinc-950 font-bold text-sm shadow-xl hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative w-full max-w-3xl bg-[#0e071a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Cover Image */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-purple-950/40">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e071a] via-[#0e071a]/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 space-y-1">
                  <span className="px-3 py-1 rounded-full bg-[#C026D3]/80 text-white text-xs font-mono font-semibold">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight pt-1">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                  {selectedProject.metrics.map((metric) => (
                    <div key={metric.label} className="text-center space-y-0.5">
                      <div className="text-lg font-extrabold text-[#C084FC]">
                        {metric.value}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Highlights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider">
                    Key Features & Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle2 size={16} className="text-[#C084FC] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Link Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <a
                    href="/contact"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    Request Similar Project
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
