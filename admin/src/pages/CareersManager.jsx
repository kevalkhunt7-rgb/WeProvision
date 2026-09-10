import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Briefcase, FileText, CheckCircle, Clock, XCircle, ExternalLink, Mail, Phone, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchFilterBar from '../components/SearchFilterBar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

const CareersManager = () => {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobModal, setSelectedJobModal] = useState(false);
  const [selectedAppModal, setSelectedAppModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobsAndApps = async () => {
    setLoading(true);
    try {
      const jobsRes = await api.getJobs();
      const jobsData = jobsRes.data || jobsRes;
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      }
    } catch (err) {
      console.warn('API jobs fetch error:', err.message);
      setJobs([]);
    }

    try {
      const appsRes = await api.getApplications();
      const appsData = appsRes.data || appsRes;
      if (Array.isArray(appsData)) {
        setApplications(appsData);
      }
    } catch (err) {
      console.warn('API applications fetch error:', err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApps();
  }, []);

  // Job Form State
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: 'Game Development',
    location: 'Remote',
    type: 'Full-Time',
    experience: '3+ Years',
    salary: '$120,000 - $150,000',
    description: ''
  });

  const handleUpdateAppStatus = async (appId, newStatus) => {
    const toastId = toast.loading('Updating candidate application status...');
    try {
      await api.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId || app._id === appId ? { ...app, status: newStatus } : app))
      );
      toast.success(`Application status updated to '${newStatus}'!`, { id: toastId });
    } catch (err) {
      console.error('Update app status error:', err.message);
      toast.error(`Failed to update status: ${err.message}`, { id: toastId });
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobFormData.title || !jobFormData.description) {
      toast.error('Please enter job title and description');
      return;
    }

    const toastId = toast.loading('Publishing new job opening to database...');
    try {
      const res = await api.createJob(jobFormData);
      const newJobDoc = res.data || res;
      
      setJobs((prev) => [newJobDoc, ...prev]);
      toast.success(`Job opening '${jobFormData.title}' published successfully!`, { id: toastId });
      
      setJobFormData({
        title: '',
        department: 'Game Development',
        location: 'Remote',
        type: 'Full-Time',
        experience: '3+ Years',
        salary: '$120,000 - $150,000',
        description: ''
      });
      setSelectedJobModal(false);
    } catch (err) {
      console.error('Create job error:', err.message);
      toast.error(`Failed to publish job: ${err.message}`, { id: toastId });
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete '${jobTitle || 'this job'}' from database?`)) {
      return;
    }

    const toastId = toast.loading('Deleting job opening from database...');
    try {
      await api.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId && j._id !== jobId));
      toast.success(`Job '${jobTitle || 'Job'}' deleted from database!`, { id: toastId });
    } catch (err) {
      console.error('Delete job error:', err.message);
      toast.error(`Failed to delete job: ${err.message}`, { id: toastId });
    }
  };

  const applicationColumns = [
    {
      header: 'Applicant Name',
      accessor: 'applicantName',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.applicantName}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Applied Position',
      accessor: 'jobTitle',
      render: (row) => <span className="text-xs font-semibold text-purple-300">{row.jobTitle}</span>
    },
    {
      header: 'Applied Date',
      accessor: 'appliedDate'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge 
          variant={
            row.status === 'Shortlisted' ? 'success' : 
            row.status === 'Reviewing' ? 'warning' : 
            row.status === 'Rejected' ? 'danger' : 'purple'
          }
        >
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedAppModal(row)}
            className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Review Candidate"
          >
            <Eye size={16} />
          </button>
          <select
            value={row.status}
            onChange={(e) => handleUpdateAppStatus(row.id || row._id, e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <UserCheck className="text-emerald-400" />
            <span>Careers & Hiring Portal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage open job positions and candidate application submissions live in MongoDB database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedJobModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Post Open Job</span>
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'jobs' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Job Postings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'applications' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
      </div>

      {/* Tab 1: Job Postings Grid */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id || job._id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4 shadow-xl transition-all hover:border-emerald-500/50"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="emerald" size="sm">{job.department}</Badge>
                    <h3 className="text-lg font-extrabold text-white mt-2 group-hover:text-emerald-300 transition-colors">{job.title}</h3>
                    <p className="text-xs text-slate-400">{job.location} • {job.type} • {job.experience}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === 'Open' ? 'success' : 'default'}>{job.status}</Badge>
                    <button
                      onClick={() => handleDeleteJob(job.id || job._id, job.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                      title="Delete Job Opening"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-emerald-400">{job.salary}</span>
                <span>{job.applicantsCount || 0} Applicants Received</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Candidate Applications Table */}
      {activeTab === 'applications' && (
        <DataTable
          columns={applicationColumns}
          data={applications.filter(a => (a.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()))}
          emptyMessage="No candidate applications found"
        />
      )}

      {/* Create Job Modal */}
      {selectedJobModal && (
        <Modal
          isOpen={selectedJobModal}
          onClose={() => setSelectedJobModal(false)}
          title="Post New Job Opening"
          footer={
            <>
              <button onClick={() => setSelectedJobModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleCreateJob} className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                Publish Opening
              </button>
            </>
          }
        >
          <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Job Title</label>
              <input
                type="text"
                required
                value={jobFormData.title}
                onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                placeholder="Senior WebGL & Front-End Architect"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Department</label>
                <select
                  value={jobFormData.department}
                  onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Game Development">Game Development</option>
                  <option value="3D & CGI">3D & CGI</option>
                  <option value="Web Development">Web Development</option>
                  <option value="VR & Spatial">VR & Spatial</option>
                  <option value="Software Infrastructure">Software Infrastructure</option>
                  <option value="Graphics & Branding">Graphics & Branding</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Salary Range</label>
                <input
                  type="text"
                  value={jobFormData.salary}
                  onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                  placeholder="$130,000 - $160,000 PA"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Job Description</label>
              <textarea
                rows={4}
                required
                value={jobFormData.description}
                onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                placeholder="Key responsibilities and qualifications..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Candidate Review Modal */}
      {selectedAppModal && (
        <Modal
          isOpen={!!selectedAppModal}
          onClose={() => setSelectedAppModal(null)}
          title={`Candidate Application: ${selectedAppModal.applicantName}`}
          footer={
            <>
              <button onClick={() => setSelectedAppModal(null)} className="px-4 py-2 text-xs font-semibold text-slate-400">
                Close
              </button>
              <button 
                onClick={() => {
                  handleUpdateAppStatus(selectedAppModal.id || selectedAppModal._id, 'Shortlisted');
                  setSelectedAppModal(null);
                }} 
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
              >
                Shortlist Candidate
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Position</span>
                <p className="font-bold text-emerald-400 text-sm">{selectedAppModal.jobTitle}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Applied Date</span>
                <p className="font-bold text-white">{selectedAppModal.appliedDate}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Email</span>
                <p className="font-medium text-slate-300">{selectedAppModal.email}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Phone</span>
                <p className="font-medium text-slate-300">{selectedAppModal.phone || 'N/A'}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Portfolio / Links</span>
              <div className="mt-1 flex items-center gap-3">
                <a
                  href={selectedAppModal.portfolioUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-purple-400 hover:underline"
                >
                  <ExternalLink size={14} />
                  <span>View Portfolio Website</span>
                </a>
              </div>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Cover Statement</span>
              <div className="mt-1 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                {selectedAppModal.coverLetter || 'No cover letter provided.'}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CareersManager;
