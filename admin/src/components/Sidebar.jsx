import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  Mail, 
  UserCheck, 
  Zap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Sidebar = ({ isCollapsed, toggleSidebar, mobileOpen, closeMobile }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Services', path: '/services', icon: Layers },
    { label: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { label: 'Careers & Hiring', path: '/careers', icon: UserCheck },
    { label: 'Contact Inquiries', path: '/inquiries', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-40 h-screen border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div>
          <div className="relative flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <img
                src={logo}
                alt="WEPROVISION"
                onClick={isCollapsed ? toggleSidebar : undefined}
                className="h-15 w-15 shrink-0 object-contain cursor-pointer transition-transform hover:scale-105"
                title={isCollapsed ? 'Click to expand sidebar' : 'WEPROVISION'}
              />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-400 whitespace-nowrap">
                    WEPROVISION
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase whitespace-nowrap">
                    ADMIN PANEL
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className={`hidden lg:flex items-center justify-center shrink-0 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-purple-500/40 transition-all ${
                isCollapsed
                  ? 'absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-purple-500/40 bg-slate-900 text-purple-300 shadow-lg shadow-black/80 z-50 hover:bg-purple-950 hover:text-white'
                  : 'h-7 w-7'
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={closeMobile}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/30 shadow-md shadow-purple-500/10' 
                    : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={`${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'} transition-colors`} />
                    
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {/* Active line indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-purple-500 shadow-glow" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Quick Profile / Links */}
        <div className="p-3 border-t border-slate-800/80">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 border border-transparent hover:bg-slate-900 hover:text-purple-400 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none"
          >
            <ExternalLink size={18} />
            {!isCollapsed && <span>View Main Website</span>}
          </a>

          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-xs">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Admin User'}</span>
                  <span className="text-[10px] text-purple-400 font-bold uppercase truncate">{user?.role || 'Admin'}</span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
