import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '', showDot = true }) => {
  const styles = {
    // Pastel preschool themes
    lavender: {
      wrap: 'bg-purple-50 text-purple-700 border-purple-200/80',
      dot: 'bg-purple-500'
    },
    sky: {
      wrap: 'bg-sky-50 text-sky-700 border-sky-200/80',
      dot: 'bg-sky-500'
    },
    mint: {
      wrap: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    peach: {
      wrap: 'bg-orange-50 text-orange-700 border-orange-200/80',
      dot: 'bg-orange-500'
    },
    yellow: {
      wrap: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500'
    },
    rose: {
      wrap: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500'
    },
    neutral: {
      wrap: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400'
    },
    
    // Status semantic mapping
    Present: { wrap: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
    Absent: { wrap: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
    Late: { wrap: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
    Leave: { wrap: 'bg-sky-50 text-sky-800 border-sky-200', dot: 'bg-sky-500' },
    Paid: { wrap: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
    Partial: { wrap: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
    Unpaid: { wrap: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
    Overdue: { wrap: 'bg-red-50 text-red-800 border-red-300 font-bold', dot: 'bg-red-500 animate-pulse' },
    Approved: { wrap: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
    Pending: { wrap: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
    'Under Review': { wrap: 'bg-sky-50 text-sky-800 border-sky-200', dot: 'bg-sky-500' },
    Rejected: { wrap: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
    Enrolled: { wrap: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
    Archived: { wrap: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' }
  };

  const selected = styles[variant] || styles[children] || styles.neutral;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${selected.wrap} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${selected.dot}`} />}
      <span>{children}</span>
    </span>
  );
};
