import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Briefcase, 
  Layers, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Plus
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import InquiryDetailModal from '../components/InquiryDetailModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Wrench, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      const inqRes = await api.getInquiries().catch(() => ({ data: [] }));
      setInquiries(Array.isArray(inqRes.data || inqRes) ? (inqRes.data || inqRes) : []);

      const portRes = await api.getPortfolio().catch(() => ({ data: [] }));
      setProjects(Array.isArray(portRes.data || portRes) ? (portRes.data || portRes) : []);

      const srvRes = await api.getServices().catch(() => ({ data: [] }));
      setServices(Array.isArray(srvRes.data || srvRes) ? (srvRes.data || srvRes) : []);

      const appRes = await api.getApplications().catch(() => ({ data: [] }));
      setApplications(Array.isArray(appRes.data || appRes) ? (appRes.data || appRes) : []);

      const settingsRes = await api.getSettings().catch(() => ({ settings: { maintenanceMode: false } }));
      if (settingsRes?.settings?.maintenanceMode !== undefined) {
        setMaintenanceMode(Boolean(settingsRes.settings.maintenanceMode));
      }
    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleMaintenance = async () => {
    if (isTogglingMaintenance) return;
    try {
      setIsTogglingMaintenance(true);
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
        toast.success('Maintenance Mode DISABLED! Main website is live.', {
          icon: '🚀',
          duration: 5000,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle Maintenance Mode');
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const unreadInquiriesCount = inquiries.filter(i => i.status === 'Unread').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
              <Sparkles size={14} className="text-purple-400" />
              <span>WeProvision Admin Portal v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">{user?.name || 'Admin User'}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Overview of WeProvision digital platform performance, incoming client inquiries, active 3D & web projects, and team hiring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-md"
            >
              <ExternalLink size={15} />
              <span>Open WeProvision Site</span>
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Maintenance Mode System Status Bar */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
        maintenanceMode
          ? 'bg-rose-950/40 border-rose-500/40 shadow-xl shadow-rose-950/40'
          : 'bg-slate-900/80 border-slate-800 shadow-xl'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
            maintenanceMode
              ? 'bg-rose-900/50 border-rose-500/50 text-rose-400 animate-pulse'
              : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
          }`}>
            {maintenanceMode ? <ShieldAlert size={24} /> : <Wrench size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                System Status: <span className={maintenanceMode ? 'text-rose-400' : 'text-emerald-400'}>{maintenanceMode ? 'UNDER MAINTENANCE' : 'LIVE & OPERATIONAL'}</span>
              </h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                maintenanceMode ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {maintenanceMode ? 'Maintenance ON' : 'Default (OFF)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {maintenanceMode
                ? 'WeProvision main website is currently locked in Under Maintenance Mode. Visitors see ONLY the Maintenance screen.'
                : 'WeProvision main website is active and serving all pages to public visitors.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleMaintenance}
          disabled={isTogglingMaintenance}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-lg select-none ${
            maintenanceMode
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40'
              : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500 shadow-rose-950/50'
          }`}
        >
          <Wrench size={16} className={isTogglingMaintenance ? 'animate-spin' : ''} />
          <span>{maintenanceMode ? 'Turn Maintenance Mode OFF' : 'Turn Maintenance Mode ON'}</span>
        </button>
      </div>

      {/* Analytical Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL INQUIRIES"
          value={inquiries.length.toString()}
          change={unreadInquiriesCount > 0 ? `${unreadInquiriesCount} Unread` : 'All Read'}
          trend="up"
          icon={Mail}
          color="purple"
          subtitle={`${unreadInquiriesCount} Unread Client Messages`}
        />
        <StatCard
          title="ACTIVE PROJECTS"
          value={projects.length.toString()}
          change={`${projects.length} Total`}
          trend="up"
          icon={Briefcase}
          color="cyan"
          subtitle="Enterprise Portfolios"
        />
        <StatCard
          title="TOTAL SERVICES"
          value={services.length.toString()}
          change="100% Active"
          trend="up"
          icon={Layers}
          color="pink"
          subtitle="3D, Web, VR & Software"
        />
        <StatCard
          title="JOB APPLICANTS"
          value={applications.length.toString()}
          change={`${applications.length} Candidates`}
          trend="up"
          icon={Users}
          color="emerald"
          subtitle="Hiring Candidates"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Client Inquiries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Recent Client Inquiries</h2>
              <p className="text-xs text-slate-400">Incoming message requests from WeProvision Contact Page</p>
            </div>
            <a href="/inquiries" className="text-xs font-semibold text-purple-400 hover:underline">
              View All ({inquiries.length}) &rarr;
            </a>
          </div>

          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
                No client inquiries received yet.
              </div>
            ) : (
              inquiries.slice(0, 4).map((inquiry) => (
                <div 
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 backdrop-blur-md transition-all duration-200 hover:border-purple-500/40 hover:bg-slate-800/50 cursor-pointer shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-sm">
                        {inquiry.name ? inquiry.name.substring(0, 2).toUpperCase() : 'IN'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{inquiry.name}</h4>
                          <Badge variant={inquiry.status === 'Unread' ? 'purple' : inquiry.status === 'In Progress' ? 'warning' : 'success'}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{inquiry.company || 'N/A'} • {inquiry.service || 'General'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-semibold text-slate-400">{inquiry.budget || ''}</span>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-500/20 hover:text-purple-300 transition-colors">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 line-clamp-1 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                    "{inquiry.subject}" — {inquiry.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Portfolio & Recent Applicants */}
        <div className="space-y-6">
          {/* Active Projects Widget */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Featured Projects</h3>
              <a href="/portfolio" className="text-xs text-purple-400 hover:underline">Manage</a>
            </div>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No portfolio projects added yet.</div>
              ) : (
                projects.slice(0, 3).map((proj) => (
                  <div key={proj.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
                    {proj.image && <img src={proj.image} alt={proj.title} className="h-12 w-16 object-cover rounded-lg border border-slate-800" />}
                    <div className="flex-1 truncate">
                      <h5 className="text-xs font-bold text-slate-200 truncate">{proj.title}</h5>
                      <p className="text-[10px] text-purple-400 font-semibold">{proj.category}</p>
                    </div>
                    <Badge variant="cyan" size="sm">{proj.status || 'Active'}</Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hiring & Candidates Widget */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Job Candidates</h3>
              <a href="/careers" className="text-xs text-purple-400 hover:underline">Hiring Portal</a>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No job applications received yet.</div>
              ) : (
                applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                    <div className="truncate">
                      <h5 className="text-xs font-bold text-white truncate">{app.applicantName}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{app.jobTitle}</p>
                    </div>
                    <Badge variant={app.status === 'Shortlisted' ? 'success' : app.status === 'Reviewing' ? 'warning' : 'default'} size="sm">
                      {app.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          inquiry={selectedInquiry}
          onInquiryUpdated={(updated) => {
            setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setSelectedInquiry(updated);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
