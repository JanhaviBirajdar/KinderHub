import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  ClipboardList, 
  Cake, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  Sparkle,
  Zap,
  Languages,
  ShieldCheck,
  Map
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { StatsCard } from '../components/StatsCard';
import { Badge } from '../components/Badge';

// Custom Glassmorphic Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 text-xs space-y-1.5 animate-pop-in">
        <p className="font-extrabold text-slate-800 font-heading border-b border-slate-100 pb-1">
          {label} Session
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}:
            </span>
            <span className="text-slate-900 font-extrabold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminDashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboardSummary();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 font-heading">Loading KinderHub Analytics...</p>
        </div>
      </div>
    );
  }

  const { metrics, charts, upcomingBirthdays, recentAdmissions, recentAnnouncements, upcomingEvents } = data || {};

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      {/* Welcome Hero Banner with Child-Friendly Motifs */}
      <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-600 text-white shadow-xl relative overflow-hidden">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute -right-8 -top-8 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-56 h-56 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-purple-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              Preschool Operations Center
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Good Morning, Director Eleanor! 🌸
            </h2>
            
            <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
              All 4 classroom sections are active today. Morning drop-offs are completed with an outstanding 
              <span className="font-extrabold text-white px-1.5 py-0.5 rounded bg-white/20 mx-1">
                {metrics?.todayAttendanceRate}% attendance rate
              </span> 
              and 0 safety flags.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('admissions')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white text-purple-700 font-extrabold hover:bg-purple-50 transition-all text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/20 hover:scale-105 active:scale-95"
            >
              <ClipboardList className="w-4 h-4 text-purple-600" /> Admissions ({metrics?.pendingAdmissions || 4})
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-purple-500/80 hover:bg-purple-500 text-white font-extrabold transition-all text-xs flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" /> Mark Attendance
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold transition-all text-xs flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-4 h-4" /> Record Fee
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Children"
          value={metrics?.totalChildren ?? 0}
          subtitle={`Enrolled in ${metrics?.classesCount ?? 4} classrooms`}
          icon={Baby}
          color="lavender"
          trend={{ value: `${metrics?.totalChildren ? Math.round((metrics.totalChildren / 75) * 100) : 0}% capacity`, isPositive: true }}
        />
        <StatsCard
          title="Teachers & Staff"
          value={metrics?.totalStaff ?? 0}
          subtitle="Certified early educators"
          icon={Users}
          color="sky"
          trend={{ value: `1:${metrics?.totalStaff ? Math.round((metrics?.totalChildren || 1) / metrics.totalStaff) : 5} ratio`, isPositive: true }}
        />
        <StatsCard
          title="Today's Attendance"
          value={`${metrics?.todayAttendanceRate ?? 0}%`}
          subtitle={`${metrics?.todayPresent ?? 0} Present, ${metrics?.todayLeave ?? 0} on leave`}
          icon={CalendarCheck}
          color="mint"
          trend={{ value: metrics?.isTodayRecorded ? 'Marked today' : 'Latest session', isPositive: true }}
        />
        <StatsCard
          title="Pending Tuition"
          value={`$${metrics?.pendingFees ?? 0}`}
          subtitle={`$${metrics?.collectedFees ?? 0} collected this term`}
          icon={CreditCard}
          color="peach"
          trend={{ value: 'Reconciled', isPositive: true }}
        />
      </div>

      {/* Preschool Innovation Hub Deck */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-6 sm:p-7 border border-purple-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-purple-600" /> KinderHub Innovation Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Proactive operational intelligence, personalized AI growth portfolios, multilingual family digests & safety verification
            </p>
          </div>
          <button
            onClick={() => onNavigate('kinderpredict')}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5" /> Launch KinderPredict Engine
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('kindergrowth')}
            className="p-4.5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🌱</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">AI Portfolios</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-purple-700 transition-colors">KinderGrowth AI</h4>
            <p className="text-[11px] text-slate-500">5-domain milestone timeline, self-comparison radar chart & educator-approved AI suggestions.</p>
          </div>

          <div 
            onClick={() => onNavigate('kinderconnect')}
            className="p-4.5 rounded-2xl bg-white border border-teal-100 hover:border-teal-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🌍</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">EN / MR / HI</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-teal-700 transition-colors">KinderConnect</h4>
            <p className="text-[11px] text-slate-500">Bilingual parent daily updates in Marathi & Hindi, meals, naps & photo privacy controls.</p>
          </div>

          <div 
            onClick={() => onNavigate('kindersafe')}
            className="p-4.5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🛡️</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">QR / OTP Pass</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-rose-700 transition-colors">KinderSafe Protocol</h4>
            <p className="text-[11px] text-slate-500">Time-limited pickup pass, staff verification terminal, emergency checklist & incidents.</p>
          </div>

          <div 
            onClick={() => onNavigate('kinderquest')}
            className="p-4.5 rounded-2xl bg-white border border-amber-100 hover:border-amber-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🗺️</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Wonder Garden</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-amber-700 transition-colors">KinderQuest Play</h4>
            <p className="text-[11px] text-slate-500">Play-based early learning journey, interactive quests & screen-free offline extensions.</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading">Weekly Attendance Trend</h3>
              <p className="text-xs text-slate-400">Daily student present rate across all classrooms</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 94.2% Weekly Avg
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.attendanceWeeklyChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#8B5CF6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPresent)" 
                  name="Present Children" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Fee Collection */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading">Monthly Tuition Collection</h3>
              <p className="text-xs text-slate-400">Target billed vs actual payments recorded (USD)</p>
            </div>
            <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/80">
              Autumn 2026
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.feeCollectionChart || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="target" fill="#E2E8F0" radius={[8, 8, 0, 0]} name="Billed Target ($)" />
                <Bar dataKey="collected" fill="#0EA5E9" radius={[8, 8, 0, 0]} name="Collected ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Sections: Recent Admissions, Birthdays & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admissions Pipeline */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 font-heading">Recent Enquiries</h3>
              </div>
              <button
                onClick={() => onNavigate('admissions')}
                className="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
              >
                Pipeline <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentAdmissions?.map(adm => (
                <div key={adm._id} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 transition-colors flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {adm.childFirstName} {adm.childLastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {adm.preferredClassName} • Parent: {adm.parentName}
                    </p>
                  </div>
                  <Badge variant={adm.status}>{adm.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Birthdays Celebration Tracker */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
                  <Cake className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 font-heading">Upcoming Birthdays</h3>
              </div>
              <span className="text-[10px] text-pink-700 font-extrabold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                Celebrations 🎉
              </span>
            </div>

            <div className="space-y-2.5">
              {upcomingBirthdays?.map(b => (
                <div key={b._id} className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-50/40 to-purple-50/30 border border-pink-100/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={b.photo} alt={b.childName} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{b.childName}</p>
                      <p className="text-[10px] text-slate-400">{b.className}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-extrabold text-pink-700 bg-white px-2.5 py-1 rounded-full border border-pink-200/80 shadow-xs">
                      🎂 {b.birthMonthDay}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events & Calendar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 font-heading">Preschool Events</h3>
              </div>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                Calendar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents?.map(ev => (
                <div key={ev._id} className="p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-indigo-950 truncate max-w-[170px]">{ev.title}</p>
                    <Badge variant={ev.eventType}>{ev.eventType}</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 text-[10px] text-indigo-700/80 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> {ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
