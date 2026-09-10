import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, trend = 'up', icon: Icon, color = 'purple', subtitle }) => {
  const colorGradients = {
    purple: 'from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 text-purple-400',
    pink: 'from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20 text-pink-400',
    cyan: 'from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-400',
    blue: 'from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 text-blue-400'
  };

  const iconBgs = {
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    pink: 'bg-pink-500/15 text-pink-400 border border-pink-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorGradients[color]} border backdrop-blur-md p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl ${iconBgs[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
          {trend === 'up' ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <TrendingUp size={14} />
              {change}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400">
              <TrendingDown size={14} />
              {change}
            </span>
          )}
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
