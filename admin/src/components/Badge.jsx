import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    urgent: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    pink: 'bg-pink-500/10 text-pink-400 border border-pink-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size]} ${variants[variant] || variants.default}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {children}
    </span>
  );
};

export default Badge;
