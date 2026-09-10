import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Mail, CheckCircle, ShieldCheck, LogOut, Wrench, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Header = ({ openMobile, isCollapsed }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res?.settings?.maintenanceMode !== undefined) {
          setMaintenanceMode(Boolean(res.settings.maintenanceMode));
        }
      })
      .catch((err) => console.warn('Header failed to load settings:', err));
  }, []);

  const handleToggleMaintenance = async () => {
    if (isToggling) return;
    try {
      setIsToggling(true);
      const targetState = !maintenanceMode;
      const res = await api.toggleMaintenance(targetState);
      const updatedState = res.settings?.maintenanceMode !== undefined ? res.settings.maintenanceMode : targetState;
      setMaintenanceMode(updatedState);
      if (updatedState) {
        toast.error('Maintenance Mode ENABLED! Main website is showing Under Maintenance page.', {
          icon: '🛠️',
          duration: 5000,
        });
      } else {
        toast.success('Maintenance Mode DISABLED! Main website is now live.', {
          icon: '🚀',
          duration: 5000,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle Maintenance Mode');
    } finally {
      setIsToggling(false);
    }
  };

  const notifications = [
    { id: 1, title: 'New Inquiries', desc: 'Sarah Jenkins requested quote for Enterprise App', time: '10 min ago', icon: Mail, color: 'text-purple-400' },
    { id: 2, title: 'New Job Application', desc: 'Marcus Vance applied for Senior WebGL Architect', time: '1 hour ago', icon: CheckCircle, color: 'text-emerald-400' },
    { id: 3, title: 'System Security', desc: 'Admin login verified', time: '3 hours ago', icon: ShieldCheck, color: 'text-cyan-400' }
  ];

  const getInitials = (name) => {
    if (!name) return 'AP';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 transition-all duration-300 ${isCollapsed ? 'lg:pl-24' : 'lg:pl-68'}`}>
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={openMobile}
          className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search dashboard, services..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Maintenance Mode Toggle Button */}
        
        

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-purple-500/20">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-200">{user?.name || 'Admin'}</span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{user?.role || 'Admin'}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
            title="Logout Admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
