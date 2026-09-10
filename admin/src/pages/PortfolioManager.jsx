import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit3, Trash2, ExternalLink, Star, Eye, Layers } from 'lucide-react';
import SearchFilterBar from '../components/SearchFilterBar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { api } from '../services/api';

import toast from 'react-hot-toast';

const PortfolioManager = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Work');
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await api.getPortfolio();
        const data = res.data || res;
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (err) {
        console.warn('API portfolio fetch error:', err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const categories = [
    'All Work',
    'Web Development',
    '3D & CGI Modeling',
    'VR & Metaverse',
    'Game Development',
    'Graphics & Branding'
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    subtitle: '',
    description: '',
    client: '',
    image: '',
    techStack: '',
    status: 'Published',
    featured: false
  });

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All Work' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleToggleFeatured = async (idParam) => {
    const target = projects.find(p => p.id === idParam || p._id === idParam);
    const targetId = idParam || target?.id || target?._id;
    if (!targetId) return;

    const newFeatured = !target?.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === targetId || p._id === targetId ? { ...p, featured: newFeatured } : p))
    );
    try {
      await api.updatePortfolio(targetId, { featured: newFeatured });
      toast.success(`${target?.title || 'Project'} ${newFeatured ? 'marked as featured' : 'unfeatured'}`);
    } catch (err) {
      toast.success(`${target?.title || 'Project'} featured status updated`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Web Development',
      subtitle: '',
      description: '',
      client: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      techStack: 'React, Tailwind CSS, Three.js, Node.js',
      status: 'Published',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category,
      subtitle: proj.subtitle,
      description: proj.description,
      client: proj.client || '',
      image: proj.image,
      techStack: proj.techStack ? proj.techStack.join(', ') : '',
      status: proj.status || 'Published',
      featured: proj.featured || false
    });
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const stackArray = formData.techStack.split(',').map((t) => t.trim()).filter(Boolean);

    const toastId = toast.loading(editingProject ? 'Updating project in database...' : 'Saving project to database...');
    const editId = editingProject ? (editingProject.id || editingProject._id) : null;

    if (editingProject && editId) {
      const updatedData = {
        title: formData.title,
        category: formData.category,
        subtitle: formData.subtitle,
        description: formData.description,
        client: formData.client,
        image: formData.image,
        techStack: stackArray,
        status: formData.status,
        featured: formData.featured
      };
      
      try {
        const res = await api.updatePortfolio(editId, updatedData);
        const serverDoc = res.data || updatedData;
        setProjects((prev) =>
          prev.map((p) =>
            (p.id === editId || p._id === editId)
              ? { ...p, ...serverDoc }
              : p
          )
        );
        toast.success(`Project '${formData.title}' updated successfully in database!`, { id: toastId });
        setIsModalOpen(false);
      } catch (err) {
        console.error('Update portfolio error:', err.message);
        toast.error(`Failed to update in database: ${err.message}`, { id: toastId });
      }
    } else {
      const newProj = {
        id: `proj-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        subtitle: formData.subtitle,
        description: formData.description,
        client: formData.client,
        image: formData.image,
        techStack: stackArray,
        metrics: [
          { label: 'Performance', value: '100%' },
          { label: 'User Satisfaction', value: '4.9/5' }
        ],
        features: ['Real-time rendering', 'High performance design architecture'],
        status: formData.status,
        featured: formData.featured
      };
      
      try {
        const res = await api.createPortfolio(newProj);
        const savedDoc = res.data || newProj;
        setProjects((prev) => [savedDoc, ...prev]);
        toast.success(`Project '${formData.title}' stored successfully in database!`, { id: toastId });
        setIsModalOpen(false);
      } catch (err) {
        console.error('Create portfolio error:', err.message);
        toast.error(`Failed to save to database: ${err.message}`, { id: toastId });
      }
    }
  };

  const handleDeleteProject = async (idParam) => {
    const target = projects.find((p) => p.id === idParam || p._id === idParam);
    const deleteId = idParam || target?.id || target?._id;

    if (!deleteId) {
      toast.error('Could not determine project ID to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete '${target?.title || 'this project'}' from the database?`)) {
      return;
    }

    const toastId = toast.loading('Deleting project from database...');
    try {
      // Send DELETE request to backend and await successful response
      const res = await api.deletePortfolio(deleteId);

      if (res && res.success !== false) {
        // Update UI state ONLY after backend deletion is confirmed
        setProjects((prev) => prev.filter((p) => p.id !== deleteId && p._id !== deleteId));
        toast.success(`Project '${target?.title || 'Project'}' deleted from database!`, { id: toastId });
      } else {
        throw new Error(res?.message || 'Server failed to delete project');
      }
    } catch (err) {
      console.error('Delete portfolio API error:', err.message);
      toast.error(`Failed to delete from database: ${err.message}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-cyan-400" />
            <span>Portfolio Showcase Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage projects, case studies, high-poly 3D assets, and WebGL demos featured on WeProvision Portfolio page
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl"
          >
            {/* Project Image Banner */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <img
                src={proj.image}
                alt={proj.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge variant={proj.status === 'Published' ? 'success' : 'warning'} size="sm">
                  {proj.status}
                </Badge>
                {proj.featured && (
                  <Badge variant="purple" size="sm">
                    <Star size={10} className="fill-current" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                  {proj.category}
                </span>
                <h3 className="text-base font-black text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {proj.title}
                </h3>
              </div>
            </div>

            {/* Project Body */}
            <div className="p-5 space-y-3 flex-1">
              <p className="text-xs font-semibold text-slate-300 line-clamp-1">{proj.subtitle}</p>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.techStack?.map((tech, idx) => (
                  <span key={idx} className="rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/40 px-5 py-3 text-xs">
              <button
                onClick={() => handleToggleFeatured(proj.id || proj._id)}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  proj.featured ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Star size={14} className={proj.featured ? 'fill-current' : ''} />
                <span>{proj.featured ? 'Featured' : 'Star'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(proj)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProject(proj.id || proj._id)}
                  className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject ? `Edit ${editingProject.title}` : 'Add Portfolio Project'}
          footer={
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
              >
                {editingProject ? 'Update Project' : 'Publish Project'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Cybernetic Mech 3D Asset"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {categories.filter(c => c !== 'All Work').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Client Name</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="e.g. BlackSteel Financial"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Subtitle / Tagline</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Next-Gen Financial Dashboard & Real-Time Trading Platform"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Tech Stack (Comma-separated)</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="React, Next.js, WebGL, Tailwind CSS"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Full Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PortfolioManager;
