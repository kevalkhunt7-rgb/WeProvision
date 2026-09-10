import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layout,
  Search,
  Cpu,
  Gamepad2,
  UserCheck,
  Code2,
  Film,
  Video,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { useServices } from "../context/ServicesContext";

const ServicesSection = () => {
  const { isServiceActive } = useServices();

  const services = [
    {
      id: "web-app-development",
      serviceId: "web-dev",
      title: "Web & App Development",
      description:
        "End-to-end development of modern websites and mobile applications using the latest technologies. We build responsive, high-performance, and user-centric digital solutions.",
      icon: Smartphone,
      path: "/services/web-development",
    },
    {
      id: "game-development",
      serviceId: "game-dev",
      title: "Game Development",
      description:
        "Creating engaging gaming experiences for multiple platforms using the latest game development technologies.",
      icon: Gamepad2,
      path: "/services/game-development",
    },
    {
      id: "ui-ux-design",
      serviceId: "graphics-designing",
      title: "UI/UX Designing",
      description:
        "User-centered design processes that deliver intuitive user interfaces and exceptional user experiences.",
      icon: Layout,
      path: "/services/graphics-designing",
    },
    {
      id: "seo",
      serviceId: "web-dev",
      title: "SEO Services",
      description:
        "Search engine optimization strategies to improve online visibility and drive organic traffic to your website.",
      icon: Search,
      path: "/services/web-development",
    },
    {
      id: "ar-vr-metaverse",
      serviceId: "vr-dev",
      title: "AR/VR Metaverse",
      description:
        "Immersive augmented and virtual reality solutions for entertainment, education, and business applications.",
      icon: Cpu,
      path: "/services/vr-development",
    },
    {
      id: "crm-development",
      serviceId: "web-dev",
      title: "CRM Development",
      description:
        "Custom CRM solutions tailored to optimize customer relationships, sales tracking, and business intelligence.",
      icon: UserCheck,
      path: "/services/web-development",
    },
    {
      id: "software-development",
      serviceId: "software-dev",
      title: "Software Development",
      description:
        "End-to-end software development services from ideation to deployment across web, mobile, and cloud platforms.",
      icon: Code2,
      path: "/services/software-development",
    },
    {
      id: "2d-3d-animation",
      serviceId: "3d-modeling",
      title: "2D & 3D Animation",
      description:
        "Engaging 2D and 3D animations for storytelling, marketing, games, and explainer videos.",
      icon: Film,
      path: "/services/3d-modeling",
    },
    {
      id: "cgi-video",
      serviceId: "3d-modeling",
      title: "CGI Video",
      description:
        "High-quality CGI video production for cinematic effects, product visualization, and virtual environments.",
      icon: Video,
      path: "/services/3d-modeling",
    },
  ].filter((s) => isServiceActive(s.serviceId));


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-28 bg-[#090611] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#6b21a8]/20 via-[#a855f7]/10 to-[#ec4899]/15 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#C084FC]">
              Services
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal">
            We deliver innovative solutions and exceptional experiences across a
            range of specialized services.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.id} variants={cardVariants} className="h-full">
                <Link to={service.path} className="block h-full group focus:outline-none">
                  <div className="relative h-full rounded-2xl bg-[#120a20]/90 border border-white/[0.08] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#A855F7]/40 hover:bg-[#170e28] hover:shadow-[0_0_35px_rgba(168,85,247,0.18)]">
                    
                    {/* Top Content */}
                    <div>
                      {/* Icon */}
                      <div className="mb-6 text-[#C084FC] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F472B6]">
                        <Icon size={32} strokeWidth={1.75} />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 tracking-wide transition-colors group-hover:text-white">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal mb-8">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Action Link */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#C084FC] group-hover:text-[#F472B6] transition-colors">
                      <span>Learn More</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;