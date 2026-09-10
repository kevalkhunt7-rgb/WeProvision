import React, { useState, useEffect } from 'react';
import { Layers, Box, Sparkles, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchFilterBar from '../components/SearchFilterBar';
import Badge from '../components/Badge';
import { api } from '../services/api';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.getServices();
      const data = res.data || res;
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (err) {
      console.warn('API services fetch error:', err.message);
      toast.error('Failed to load services from server.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const categories = [
    'All',
    'Interactive Gaming & Real-time Engines',
    'Enterprise Infrastructure & Systems',
    'Visual Media & Digital Assets',
    'Next-Gen Web & Immersive UI',
    'Immersive Spatial Environments',
    'Brand Identity & Visual Design'
  ];

  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || srv.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleToggleActive = async (id) => {
    const toastId = toast.loading('Updating service status in database...');
    try {
      const res = await api.toggleServiceStatus(id);
      const updated = res.data;
      
      setServices((prev) =>
        prev.map((s) => (s.id === id || s._id === id ? { 
          ...s, 
          active: updated ? updated.active : !s.active, 
          status: updated ? updated.status : (!s.active ? 'Active' : 'Inactive') 
        } : s))
      );

      const targetService = services.find(s => s.id === id || s._id === id);
      const title = targetService ? targetService.title : 'Service';
      const newStatus = updated ? updated.status : 'updated';
      
      toast.success(`${title} status set to '${newStatus}' in database!`, { id: toastId });
    } catch (err) {
      console.error('API toggle request error:', err.message);
      toast.error(`Failed to update database: ${err.message}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="text-purple-400" />
            <span>Services Offering Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage and toggle WeProvision development services status live in MongoDB database
          </p>
        </div>
        <button
          onClick={fetchServices}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-purple-500/50 transition-all shadow-md self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-purple-400' : 'text-purple-400'} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Filter Bar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeholder="Search services by title or category..."
      />

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          {loading ? 'Loading services from database...' : 'No services found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id || service._id}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white border shadow-md"
                  style={{ backgroundColor: `${service.color || '#8B5CF6'}20`, borderColor: `${service.color || '#8B5CF6'}50` }}
                >
                  <Box size={20} style={{ color: service.color || '#8B5CF6' }} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={service.active ? 'success' : 'default'}>
                    {service.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <button
                    onClick={() => handleToggleActive(service.id || service._id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-md ${
                      service.active
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {service.active ? <ToggleRight size={16} className="text-purple-400" /> : <ToggleLeft size={16} />}
                    <span>{service.active ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>
              </div>

              <h3 className="mt-4 text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                {service.title}
              </h3>
              <p className="text-xs font-semibold text-purple-400 mt-0.5">{service.category}</p>

              <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {service.tagline}
              </p>

              {/* Items / Features list */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Key Deliverables</span>
                {(service.items || []).slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <Sparkles size={12} className="text-purple-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">{service.projectsCount || 0} Delivered Projects</span>
              <span className={`text-xs font-semibold ${service.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                {service.active ? '● Live on Website' : '○ Hidden from Website'}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ServicesManager;
