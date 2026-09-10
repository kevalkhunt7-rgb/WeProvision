import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Layers } from 'lucide-react';
import Footer from './Footer';

export default function ServiceUnavailable({ title = 'Service' }) {
  return (
    <div className="relative bg-[#07050e] text-white selection:bg-[#C084FC] selection:text-white min-h-screen pt-32 flex flex-col justify-between overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-900/15 blur-[160px] rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8 my-auto py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-950/80 border border-purple-500/30 text-purple-400 shadow-2xl shadow-purple-950/50">
          <ShieldAlert size={40} />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold tracking-widest uppercase">
            <Layers size={14} />
            <span>Service Currently Unavailable</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {title} is Offline
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            This service offering is currently set to inactive or undergoing scheduled maintenance. Please explore our active services or return to the main homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
          >
            <span>Contact Support</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
