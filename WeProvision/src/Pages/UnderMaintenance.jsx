import React, { useState } from 'react';
import { Settings, Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import logo from '../assets/sitelogo.png';
import logo2 from '../assets/logo.png';

export default function UnderMaintenance() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleNotify = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      await fetch('http://localhost:3000/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.warn('Subscription error:', err);
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07050e] text-white flex flex-col justify-between overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* ── Custom Keyframe Animations ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          40% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-scan { animation: scan 3.5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-spin-reverse { animation: spin-reverse 16s linear infinite; }
      `}</style>

      {/* ── Dynamic Ambient Background ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-indigo-600/30 blur-[130px] rounded-full pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#19132b_1px,transparent_1px),linear-gradient(to_bottom,#19132b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-35 pointer-events-none z-0" />

      {/* ── Brand Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 -mt-20  py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img
            src={logo}
            alt="Logo"
            className="h-[300px] w-[300px] object-contain transition-transform duration-300 group-hover:scale-110"
          />

        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/20 backdrop-blur-md shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-purple-300">SYSTEM REBOOT</span>
        </div>
      </header>

      {/* ── Main Message & Action ── */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-8 text-center my-auto flex flex-col items-center">
        {/* Animated Dual Gear Badge */}
        <div className="relative mb-8 animate-float">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-600 opacity-60 blur-xl animate-pulse" />

          <div className="relative  rounded-3xl bg-[#0e0a1a]/90 border border-purple-500/30 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan pointer-events-none" />

            <img
              src={logo2}
              alt="WEPROVISION"
              className="h-40 w-40 shrink-0 object-contain cursor-pointer transition-transform hover:scale-105"

            />
          </div>

          <div className="absolute -bottom-2 -right-3 flex items-center gap-1 bg-purple-950 border border-purple-400/40 rounded-full px-2.5 py-0.5 shadow-md">
            <Sparkles size={11} className="text-yellow-400 animate-spin" />
            <span className="text-[10px] font-mono text-purple-200">v2.0</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-3">
          We’ll Be Back{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
            Soon
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          We’re upgrading our architecture to bring you a faster, smoother experience. We'll be back shortly.
        </p>

        {/* Subscription Form */}
        <div className="w-full max-w-md">
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-purple-200 text-xs font-medium animate-fadeIn">
              <CheckCircle2 size={16} className="text-pink-400" />
              <span>We'll drop you a line as soon as we're live.</span>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="relative flex items-center group">
              <Mail
                size={16}
                className="absolute left-4 text-slate-500 group-focus-within:text-purple-400 transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Enter email to get notified..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-purple-500/20 bg-purple-950/20 py-3.5 pl-11 pr-32 text-xs text-white placeholder-slate-500 outline-none backdrop-blur-md transition-all focus:border-purple-500/60 focus:bg-purple-950/40 focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <span>Notify</span>
                <ArrowRight size={13} />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-5 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} WeProvision Infotech. All systems normal.
      </footer>
    </div>
  );
}