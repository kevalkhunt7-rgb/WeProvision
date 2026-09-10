import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user?.name || 'Admin'}!`);
      navigate('/');
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please check credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Cyber Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-pink-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-gradient-to-br from-indigo-600/15 via-purple-600/15 to-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] space-y-8">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <img src={logo} alt="WEPROVISION Logo" className="h-16 w-16 object-contain drop-shadow-2xl transition-transform hover:scale-105" />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              WEPROVISION <span className="text-purple-400">ADMIN</span>
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Restricted Control Panel Access
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-300 animate-fadeIn">
            <ShieldAlert size={18} className="shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Credentials Notice Box */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-purple-400">
            <CheckCircle2 size={14} />
            <span>Admin Authentication Required</span>
          </div>
         
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@weprovision.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-11 pr-4 py-3 text-xs font-medium text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-11 pr-11 py-3 text-xs font-medium text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1 rounded-md"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500 focus:outline-none transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Verifying Admin Role...</span>
            ) : (
              <>
                <span>Authenticate & Login</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800/80 text-center space-y-2">
         
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
