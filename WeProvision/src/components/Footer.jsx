import React from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import logo from '../assets/sitelogo.png';
import { useServices } from '../context/ServicesContext';

export default function Footer() {
  const { isServiceActive } = useServices();

  const servicesCol1 = [
    { serviceId: '3d-modeling', label: '2D & 3D Animation', href: '/services/3d-modeling' },
    { serviceId: '3d-modeling', label: 'CGI Video', href: '/services/3d-modeling' },
    { serviceId: 'software-dev', label: 'Software Development', href: '/services/web-development' },
    { serviceId: 'web-dev', label: 'CRM Development', href: '/services/web-development' },
    { serviceId: 'game-dev', label: 'Game Development', href: '/services/game-development' }
  ].filter((item) => isServiceActive(item.serviceId));

  const servicesCol2 = [
    { serviceId: 'vr-dev', label: 'AR/VR & Metaverse', href: '/services/vr-development' },
    { serviceId: 'web-dev', label: 'Web Development', href: '/services/web-development' },
    { serviceId: 'web-dev', label: 'Mobile Development', href: '/services/web-development' },
    { serviceId: 'graphics-designing', label: 'UI/UX Designing', href: '/services/graphics-designing' },
    { serviceId: 'web-dev', label: 'SEO Services', href: '/services/web-development' }
  ].filter((item) => isServiceActive(item.serviceId));


  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Team', href: '/about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="relative bg-[#07050e] text-white pt-16 pb-8 px-6 sm:px-10 lg:px-12 border-t border-white/10 overflow-hidden">
      {/* Background subtle purple glow accent */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-purple-950/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Logo & Slogan */}
          <div className="lg:col-span-3 space-y-2">
            <a href="/" className="inline-block">
              <img
                src={logo}
                alt="WEPROVISION INFOTECH"
                className="h-48  sm:h-48 md:h-64 w-auto max-w-full object-contain -ml-3 transition-transform duration-300 hover:scale-105"
              />
            </a>

          </div>

          {/* Column 2: Our Services (Split into 2 Sub-Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Our Services
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <ul className="space-y-2.5">
                {servicesCol1.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#C084FC] transition-colors duration-200"
                    >
                      <ArrowRight size={13} className="text-zinc-500 group-hover:text-[#C084FC] group-hover:translate-x-0.5 transition-all" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2.5">
                {servicesCol2.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#C084FC] transition-colors duration-200"
                    >
                      <ArrowRight size={13} className="text-zinc-500 group-hover:text-[#C084FC] group-hover:translate-x-0.5 transition-all" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Quick Links
            </h3>

            <ul className="space-y-2.5 pt-1">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#C084FC] transition-colors duration-200"
                  >
                    <ArrowRight size={13} className="text-zinc-500 group-hover:text-[#C084FC] group-hover:translate-x-0.5 transition-all" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Get In Touch
            </h3>

            <div className="space-y-4 text-sm text-zinc-300 font-light pt-1">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-950/60 border border-purple-500/30 shrink-0 flex items-center justify-center text-[#C084FC] mt-0.5 shadow-sm">
                  <MapPin size={17} />
                </div>
                <span className="leading-snug text-xs sm:text-sm text-zinc-300">
                  708, Blue Corporate House, Sarthana, Surat Gujarat 394101
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-950/60 border border-purple-500/30 shrink-0 flex items-center justify-center text-[#C084FC] shadow-sm">
                  <Phone size={16} />
                </div>
                <a
                  href="tel:+919316766858"
                  className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  +91 93167 66858
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-950/60 border border-purple-500/30 shrink-0 flex items-center justify-center text-[#C084FC] shadow-sm">
                  <Mail size={16} />
                </div>
                <a
                  href="mailto:weprovisioninfotech@gmail.com"
                  className="text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors break-all"
                >
                  weprovisioninfotech@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-light">
          <p>© 2026 Weprovision Infotech. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
