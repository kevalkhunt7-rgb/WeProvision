import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../assets/sitelogo.png';
import { useServices } from '../context/ServicesContext';

const SERVICES_ITEMS = [
  { id: 'web-dev', label: 'Web Development', href: '/services/web-development' },
  { id: 'game-dev', label: 'Game Development', href: '/services/game-development' },
  { id: '3d-modeling', label: '3D Modeling', href: '/services/3d-modeling' },
  { id: 'vr-dev', label: 'VR Development', href: '/services/vr-development' },
  { id: 'graphics-designing', label: 'Graphics Designing', href: '/services/graphics-designing' },
];

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    hasDropdown: true,
    subItems: SERVICES_ITEMS,
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ onReset }) {
  const { isServiceActive } = useServices();
  const activeServices = SERVICES_ITEMS.filter((item) => isServiceActive(item.id));

  const location = useLocation();
  const currentPath = location.pathname;
  const currentHash = location.hash;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const dropdownRef = useRef(null);


  // Scroll background switch
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close everything on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setServicesDropdown(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close mobile drawer on viewport resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setMobileServicesOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setServicesDropdown(false);
  };

  // Helper to determine active tab based on react-router location
  const isLinkActive = (link) => {
    if (link.hasDropdown) {
      return currentPath.startsWith('/services');
    }
    if (link.href === '/') {
      return currentPath === '/' && (!currentHash || currentHash === '#home');
    }
    if (link.href === '/about') {
      return currentPath === '/about';
    }
    if (link.href.startsWith('/#')) {
      const targetHash = link.href.replace('/', '');
      return currentPath === '/' && currentHash === targetHash;
    }
    if (link.href.startsWith('/')) {
      return currentPath === link.href;
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-[#0d111a]/90 backdrop-blur-md shadow-lg shadow-black/40 border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-25 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            onReset && onReset();
            handleLinkClick();
          }}
          className="flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] rounded-lg py-2"
        >
          <img
            src={logo}
            alt="WEPROVISION INFOTECH"
            className="h-[70px] sm:h-[300px]  w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-white">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setServicesDropdown(true)}
                  onMouseLeave={() => setServicesDropdown(false)}
                >
                  <button
                    onClick={() => setServicesDropdown((v) => !v)}
                    aria-expanded={servicesDropdown}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 transition-colors duration-200 py-2 focus:outline-none ${
                      isActive ? 'text-[#C084FC] font-semibold' : 'text-white hover:text-[#C084FC]'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${servicesDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Active Underline for Services */}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-[#F472B6] to-[#C084FC] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 py-2 bg-[#0d111a] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl origin-top transition-all duration-200 ${
                      servicesDropdown
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                    }`}
                  >
                    {activeServices.map((subItem) => {
                      const isSubActive = currentPath === subItem.href;
                      return (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          onClick={handleLinkClick}
                          className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                            isSubActive
                              ? 'text-[#C084FC] font-semibold bg-white/10 pl-5'
                              : 'text-zinc-300 font-normal hover:text-white hover:bg-white/5 hover:pl-5'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={handleLinkClick}
                className={`relative py-2 transition-colors duration-200 focus:outline-none ${
                  isActive ? 'text-[#C084FC] font-semibold' : 'text-white hover:text-[#C084FC]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-[#F472B6] to-[#C084FC] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden p-2 text-white hover:text-[#C084FC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="relative block w-6 h-6">
            <Menu
              size={24}
              className={`absolute inset-0 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <X
              size={24}
              className={`absolute inset-0 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0d111a] border-t border-white/10 shadow-2xl ${
          mobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 flex flex-col space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link);

            if (link.hasDropdown) {
              return (
                <div key={link.label} className="border-b border-white/5 last:border-none">
                  <button
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className={`w-full flex items-center justify-between py-3 text-base font-medium transition-colors ${
                      isActive ? 'text-[#C084FC] font-semibold' : 'text-zinc-200'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileServicesOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pb-3 pl-3 flex flex-col space-y-1">
                      {activeServices.map((subItem) => {
                        const isSubActive = currentPath === subItem.href;
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            onClick={handleLinkClick}
                            className={`py-2 text-sm transition-colors ${
                              isSubActive ? 'text-[#C084FC] font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={handleLinkClick}
                className={`py-3 text-base font-medium border-b border-white/5 last:border-none transition-colors ${
                  isActive ? 'text-[#C084FC] font-semibold' : 'text-zinc-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}