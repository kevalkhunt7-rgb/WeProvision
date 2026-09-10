import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Clock, Upload, CheckCircle2, FileText, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const EASE = [0.16, 1, 0.3, 1];

const JOBS = [
  {
    id: 'graphics-designer',
    title: 'Graphics Designer',
    type: 'Full-time',
    location: 'Surat',
    department: 'Design',
    experience: '1-2 years',
    description: 'Creative designer needed to craft beautiful and intuitive user interfaces.'
  },
  {
    id: 'digital-marketing-manager',
    title: 'Digital Marketing Manager',
    type: 'Full-time',
    location: 'Remote',
    department: 'Marketing',
    experience: '4-6 years',
    description: 'Lead our digital marketing initiatives and grow our online presence.'
  },
  {
    id: 'game-developer-unity',
    title: 'Game Developer (Unity)',
    type: 'Full-time',
    location: 'Surat',
    department: 'Engineering',
    experience: '1 year',
    description: 'Create immersive gaming experiences using Unity and C#.'
  }
];

export default function Careers() {
  const openPositionsRef = useRef(null);
  const applyFormRef = useRef(null);

  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [jobsList, setJobsList] = useState([]);

  React.useEffect(() => {
    const fetchLiveJobs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/jobs');
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
          setJobsList(data);
          if (data.length > 0) {
            const firstOpen = data.find((j) => j.status !== 'Closed');
            if (firstOpen) {
              setFormData((prev) => ({ ...prev, position: firstOpen.title }));
            }
          }
        }
      } catch (err) {
        console.warn('Using default jobs fallback:', err.message);
        setJobsList(JOBS);
      }
    };
    fetchLiveJobs();
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: 'Graphics Designer',
    coverLetter: '',
    fileName: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollToOpenPositions = () => {
    openPositionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyClick = (positionTitle) => {
    setFormData((prev) => ({ ...prev, position: positionTitle }));
    applyFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        fileName: e.target.files[0].name
      }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };



  const openJobsList = jobsList.filter((j) => j.status !== 'Closed');

  const uniqueLocations = ['All Locations', ...Array.from(new Set(jobsList.map((j) => j.location).filter(Boolean)))];
  const uniqueDepartments = ['All Departments', ...Array.from(new Set(jobsList.map((j) => j.department).filter(Boolean)))];

  const filteredJobs = openJobsList.filter((job) => {
    const matchLocation = selectedLocation === 'All Locations' || job.location === selectedLocation;
    const matchDepartment = selectedDepartment === 'All Departments' || job.department === selectedDepartment;
    return matchLocation && matchDepartment;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation: Check if open jobs exist
    if (openJobsList.length === 0) {
      toast.error('Application blocked: No open job positions are currently available.');
      return;
    }

    // 2. Validation: Full Name
    if (!formData.fullName || !formData.fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    // 3. Validation: Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !formData.email.trim() || !emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // 4. Validation: Selected Position
    if (!formData.position || formData.position === 'Select a position' || formData.position === 'No open positions available' || formData.position === '') {
      toast.error('Please select a valid open job position.');
      return;
    }

    // 5. Validation: Cover Letter
    if (!formData.coverLetter || !formData.coverLetter.trim()) {
      toast.error('Please write a cover letter explaining why you would be a great fit.');
      return;
    }

    // 6. Validation: Resume File
    if (!formData.fileName) {
      toast.error('Please upload your resume file (PDF, DOC, DOCX).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          jobTitle: formData.position,
          coverLetter: formData.coverLetter.trim(),
          resumeUrl: `Uploaded: ${formData.fileName}`
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit application.');
      }

      toast.success('Your job application has been submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      console.error('Submit application error:', err.message);
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#07050e] text-white selection:bg-[#EC4899] selection:text-white min-h-screen pt-28 overflow-x-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/15 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#c026d3_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-24 pb-20">

        {/* SECTION 1: HERO (Join Our Team) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center space-y-6 pt-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
              Join Our Team
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg font-light max-w-xl mx-auto">
              Be part of a team that's shaping the future of technology
            </p>
          </div>

          <div>
            <button
              onClick={scrollToOpenPositions}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C026D3] via-[#D946EF] to-[#EC4899] text-white text-sm font-bold shadow-xl shadow-purple-950/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>View Open Positions</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* SECTION 2: OPEN POSITIONS */}
        <div ref={openPositionsRef} className="space-y-8 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Open Positions
            </h2>
          </motion.div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Location Filter */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none bg-[#120a24] border border-white/10 text-xs font-semibold text-zinc-300 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-[#C026D3] transition-all cursor-pointer"
              >
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-[#120a24] border border-white/10 text-xs font-semibold text-zinc-300 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-[#C026D3] transition-all cursor-pointer"
              >
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Job List Cards */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-[#0e071a]/60 border border-white/10 rounded-2xl text-zinc-400">
                No open positions match your selected filters.
              </div>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id || job._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
                  className="group bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 hover:border-[#C084FC]/50 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl transition-all duration-300"
                >
                  <div className="space-y-2 max-w-2xl">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#C084FC] transition-colors">
                      {job.title}
                    </h3>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-purple-400" />
                        <span>{job.type}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#EC4899]" />
                        <span>{job.location}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-cyan-400" />
                        <span>Experience: {job.experience}</span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-300 text-sm font-light pt-1">
                      {job.description}
                    </p>
                  </div>

                  {/* Apply Now Button */}
                  <button
                    onClick={() => handleApplyClick(job.title)}
                    className="shrink-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#EC4899] hover:from-[#A21CAF] hover:to-[#DB2777] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    Apply Now
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 3: APPLY NOW FORM */}
        <div ref={applyFormRef} className="space-y-8 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Apply Now
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-3xl mx-auto bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl space-y-6"
          >
            {openJobsList.length === 0 && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <span>⚠️ There are currently no open job positions available for application.</span>
              </div>
            )}

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-4 bg-purple-950/30 border border-purple-500/30 rounded-xl p-6"
              >
                <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-[#C084FC]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
                <p className="text-zinc-300 text-sm max-w-md">
                  Thank you for applying to Weprovision Infotech. Our HR team will review your application and contact you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-white text-sm font-semibold transition-all"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Full Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={openJobsList.length === 0}
                    className="w-full bg-[#160d29] border border-white/10 focus:border-[#C026D3] rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Email Address <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    disabled={openJobsList.length === 0}
                    className="w-full bg-[#160d29] border border-white/10 focus:border-[#C026D3] rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Position <span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    disabled={openJobsList.length === 0}
                    className="w-full bg-[#160d29] border border-white/10 focus:border-[#C026D3] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {openJobsList.length === 0 ? (
                      <option value="" disabled>No open positions available</option>
                    ) : (
                      openJobsList.map((job) => (
                        <option key={job.id || job._id || job.title} value={job.title}>
                          {job.title} {job.department ? `(${job.department})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Cover Letter <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    name="coverLetter"
                    rows={5}
                    required
                    value={formData.coverLetter}
                    onChange={handleChange}
                    placeholder="Write a brief cover letter explaining why you'd be a great fit..."
                    disabled={openJobsList.length === 0}
                    className="w-full bg-[#160d29] border border-white/10 focus:border-[#C026D3] rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Resume <span className="text-pink-500">*</span>
                  </label>

                  <label className={`relative flex flex-col items-center justify-center w-full bg-[#160d29] border border-dashed border-white/20 hover:border-[#C026D3] rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group ${openJobsList.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={openJobsList.length === 0}
                      className="hidden"
                    />

                    {formData.fileName ? (
                      <div className="flex items-center gap-2 text-purple-300 font-medium text-sm">
                        <FileText size={18} className="text-[#C026D3]" />
                        <span>{formData.fileName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-zinc-300 text-sm group-hover:text-white transition-colors">
                        <Upload size={18} className="text-zinc-400 group-hover:text-[#C026D3] transition-colors" />
                        <span className="font-semibold">Upload Resume</span>
                      </div>
                    )}
                  </label>

                  <p className="text-[11px] text-zinc-500 font-light pt-0.5">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                {/* Submit Application Button */}
                <button
                  type="submit"
                  disabled={loading || openJobsList.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#c026d3] to-[#ec4899] hover:opacity-95 text-white font-bold text-base shadow-xl shadow-purple-950/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : openJobsList.length === 0 ? (
                    <span>No Open Positions to Apply</span>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
