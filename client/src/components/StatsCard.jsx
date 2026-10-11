import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'lavender', trend }) => {
  const colorMap = {
    lavender: {
      border: 'border-purple-100/90',
      iconBg: 'bg-purple-100/80 text-purple-700',
      gradientGlow: 'from-purple-500/10 to-indigo-500/5',
      accentText: 'text-purple-700'
    },
    sky: {
      border: 'border-sky-100/90',
      iconBg: 'bg-sky-100/80 text-sky-700',
      gradientGlow: 'from-sky-500/10 to-cyan-500/5',
      accentText: 'text-sky-700'
    },
    mint: {
      border: 'border-emerald-100/90',
      iconBg: 'bg-emerald-100/80 text-emerald-700',
      gradientGlow: 'from-emerald-500/10 to-teal-500/5',
      accentText: 'text-emerald-700'
    },
    peach: {
      border: 'border-orange-100/90',
      iconBg: 'bg-orange-100/80 text-orange-700',
      gradientGlow: 'from-orange-500/10 to-amber-500/5',
      accentText: 'text-orange-700'
    },
    yellow: {
      border: 'border-amber-100/90',
      iconBg: 'bg-amber-100/80 text-amber-800',
      gradientGlow: 'from-amber-500/10 to-yellow-500/5',
      accentText: 'text-amber-800'
    }
  };

  const c = colorMap[color] || colorMap.lavender;

  return (
    <div className={`p-6 rounded-3xl bg-white border ${c.border} shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] hover:shadow-[0_12px_28px_-4px_rgba(148,163,184,0.16)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-1`}>
      {/* Soft Background Gradient Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${c.gradientGlow} rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-125`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1.5 flex-1 pr-3">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
            {title}
          </p>
          <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            {value}
          </h4>
          
          <div className="flex items-center gap-2 pt-0.5">
            {trend && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}>
                {trend.isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {trend.value}
              </span>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl ${c.iconBg} shadow-xs group-hover:scale-110 transition-transform duration-300 shrink-0`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};
