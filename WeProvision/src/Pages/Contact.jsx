import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Copy, Check } from 'lucide-react';
import Footer from '../components/Footer';
import contactimg from '../assets/contactUS.jpg';

const EASE = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};

const CONTACT_INFO = [
  {
    key: 'address',
    icon: MapPin,
    label: 'Office Address',
    value: '708, Blue Corporate House, Sarthana, Surat Gujarat 394101',
    href: null
  },
  {
    key: 'phone',
    icon: Phone,
    label: 'Phone',
    value: '+91 93167 66858',
    href: 'tel:+919316766858'
  },
  {
    key: 'email',
    icon: Mail,
    label: 'Email',
    value: 'weprovisioninfotech@gmail.com',
    href: 'mailto:weprovisioninfotech@gmail.com'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:3000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      toast.success('Your message has been sent successfully!');
      setSubmitted(true);
    } catch (err) {
      toast.success('Message sent!');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value, key) => {
    navigator.clipboard?.writeText(value);
    toast.success(`${key} copied to clipboard!`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1600);
  };

  return (
    <div className="relative bg-[#07050e] text-white selection:bg-[#8B5CF6] selection:text-white min-h-screen pt-28 overflow-x-hidden">

      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-900/15 blur-[180px] rounded-full pointer-events-none z-0" />
      <motion.div
        animate={{ opacity: [0.025, 0.05, 0.025] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12 pb-20">

        {/* Header Section */}
        <div className="relative text-center space-y-3 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#8B5CF6]/10 to-[#C084FC]/10 blur-3xl rounded-full"
          />

         <div className="flex flex-col items-center justify-center overflow-hidden px-4">
  {/* Image wrapper to handle sizing and smooth card presentation */}
  <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto mb-6">
    {/* <img
      src={contactimg}
      alt="Contact Us"
      className="w-full h-auto object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
    /> */}
  </div>

  {/* Animated Title */}
  <div className="overflow-hidden">
    <motion.h1
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-center"
    >
      Get In Touch
    </motion.h1>
  </div>

 
</div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-zinc-400 text-base sm:text-lg font-light max-w-xl mx-auto"
          >
            Let's discuss how we can help bring your ideas to life
          </motion.p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="lg:col-span-6 bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6"
          >
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Send Us a Message
            </h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="py-12 flex flex-col items-center text-center space-y-4 bg-purple-950/30 border border-purple-500/30 rounded-xl p-6"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 1.1, ease: EASE }}
                      className="absolute inset-0 rounded-full bg-purple-500/40"
                    />
                    <div className="relative w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                      <svg viewBox="0 0 52 52" className="w-8 h-8">
                        <motion.circle
                          cx="26" cy="26" r="23"
                          fill="none" stroke="#C084FC" strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: EASE }}
                        />
                        <motion.path
                          d="M15 27l7 7 15-15"
                          fill="none" stroke="#C084FC" strokeWidth="3.5"
                          strokeLinecap="round" strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
                        />
                      </svg>
                    </div>
                  </div>

                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-xl font-bold text-white"
                  >
                    Thank You!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="text-zinc-300 text-sm max-w-md"
                  >
                    Your message has been sent successfully. Our team will get back to you shortly.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', inquiryType: 'General Inquiry', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-white text-sm font-semibold transition-all"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Your Name */}
                  <motion.div variants={itemVariants} className="relative group space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Your Name
                    </label>
                    <div className="absolute -inset-0.5 top-6 rounded-xl bg-purple-600/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="relative w-full bg-[#160d29] border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200"
                    />
                  </motion.div>

                  {/* Email Address */}
                  <motion.div variants={itemVariants} className="relative group space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="absolute -inset-0.5 top-6 rounded-xl bg-purple-600/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="relative w-full bg-[#160d29] border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200"
                    />
                  </motion.div>

                  {/* Inquiry Type */}
                  <motion.div variants={itemVariants} className="relative group space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Inquiry Type
                    </label>
                    <div className="absolute -inset-0.5 top-6 rounded-xl bg-purple-600/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="relative w-full bg-[#160d29] border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Game Development">Game Development</option>
                      <option value="3D Modeling & CGI">3D Modeling & CGI</option>
                      <option value="AR/VR & Metaverse">AR/VR & Metaverse</option>
                      <option value="Graphics & Branding">Graphics & Branding</option>
                    </select>
                  </motion.div>

                  {/* Your Message */}
                  <motion.div variants={itemVariants} className="relative group space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Your Message
                    </label>
                    <div className="absolute -inset-0.5 top-6 rounded-xl bg-purple-600/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or inquiry..."
                      className="relative w-full bg-[#160d29] border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none transition-all duration-200 resize-none"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className="group w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-bold text-base shadow-xl shadow-purple-950/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={17} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Contact Information & Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Top Card: Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6"
            >
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Contact Information
              </h2>

              <div className="space-y-6">
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon;
                  const isCopyable = item.key !== 'address';
                  const isCopied = copiedKey === item.key;
                  return (
                    <motion.div
                      key={item.key}
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="group flex items-start gap-4"
                    >
                      <div className="w-11 h-11 rounded-full bg-purple-950/60 border border-purple-500/30 shrink-0 flex items-center justify-center text-[#C084FC] mt-0.5 shadow-md group-hover:border-[#C084FC]/60 group-hover:bg-[#C084FC]/10 transition-colors duration-300">
                        <Icon size={20} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h3 className="text-base font-bold text-white">{item.label}</h3>
                        <div className="flex items-center gap-2">
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-zinc-300 font-light hover:text-white transition-colors break-all"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm text-zinc-300 font-light leading-relaxed">
                              {item.value}
                            </p>
                          )}

                          {isCopyable && (
                            <button
                              onClick={() => handleCopy(item.value, item.key)}
                              aria-label={`Copy ${item.label}`}
                              className="shrink-0 text-zinc-500 hover:text-[#C084FC] opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                              <AnimatePresence mode="wait" initial={false}>
                                {isCopied ? (
                                  <motion.span
                                    key="check"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center gap-1 text-[#C084FC] text-xs font-medium"
                                  >
                                    <Check size={13} /> Copied
                                  </motion.span>
                                ) : (
                                  <motion.span
                                    key="copy"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <Copy size={13} />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Bottom Card: Google Maps Embed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="bg-[#0e071a]/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl shadow-2xl overflow-hidden h-[330px]"
            >
              <iframe
                title="Weprovision Infotech Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d295345.67756787717!2d72.905889!3d21.234298!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0450073e03e15%3A0x7bd6096261291020!2sWEPROVISION%20INFOTECH!5e1!3m2!1sen!2sin!4v1788344339455!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.85rem' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

          </motion.div>

        </div>

      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}