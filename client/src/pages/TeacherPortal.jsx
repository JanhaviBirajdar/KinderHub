import React, { useState, useEffect } from 'react';
import { 
  School, 
  Baby, 
  CalendarCheck, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  Heart,
  AlertTriangle,
  Users,
  Smile,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { StatsCard } from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TeacherPortal = ({ onNavigate }) => {
  const { user } = useAuth();
  const [assignedClass, setAssignedClass] = useState(null);
  const [children, setChildren] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const [clsList, kids, acts] = await Promise.all([
          api.getClasses(),
          api.getChildren(),
          api.getActivities()
        ]);

        const myClass = clsList.find(c => c._id === user?.assignedClassId) || clsList[0];
        setAssignedClass(myClass);
        setChildren(kids.filter(k => k.classId === myClass?._id));
        setActivities(acts.filter(a => a.classId === myClass?._id));
      } catch (err) {
        toast.error('Failed to load teacher portal: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, [user]);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Teacher Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-xl shadow-teal-600/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              🍎 Lead Educator Portal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, Teacher {user?.name?.split(' ')[0] || 'Clara'}! 🎨
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl">
              Assigned to <span className="font-bold text-white">{assignedClass?.name} ({assignedClass?.section})</span> • {assignedClass?.roomNumber} • {children.length} Enrolled Little Explorers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition-all text-xs flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-700" /> Mark Turnout Today
            </button>
            <button
              onClick={() => onNavigate('activities')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-emerald-500/80 hover:bg-emerald-500 text-white font-bold transition-all text-xs flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" /> Log Daily Activity
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          title="Assigned Children"
          value={children.length}
          subtitle={`Max capacity: ${assignedClass?.capacity || 15} Students`}
          icon={Baby}
          color="mint"
          trend={{ text: '100% capacity', isPositive: true }}
        />
        <StatsCard
          title="Classroom Activities"
          value={activities.length}
          subtitle="Curriculum sensory experiences"
          icon={Sparkles}
          color="lavender"
          trend={{ text: '+2 new today', isPositive: true }}
        />
        <StatsCard
          title="Age Group & Room"
          value={assignedClass?.ageGroup || '2 – 3 Years'}
          subtitle={assignedClass?.roomNumber || 'Room 101'}
          icon={School}
          color="sky"
        />
      </div>

      {/* Innovative Feature Upgrades Deck */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Educator Innovation Modules
            </h3>
            <p className="text-xs text-slate-500">
              Personalized growth portfolios, multilingual family summaries, pickup verification, and play quests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('kindergrowth')}
            className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🌱</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">5 Domains</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-purple-700 transition-colors">KinderGrowth AI</h4>
            <p className="text-[11px] text-slate-500">Continuous milestone timeline, self-comparison & AI activity suggestions.</p>
          </div>

          <div 
            onClick={() => onNavigate('kinderconnect')}
            className="p-4 rounded-2xl bg-white border border-teal-100 hover:border-teal-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🌍</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">EN / MR / HI</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-teal-700 transition-colors">KinderConnect</h4>
            <p className="text-[11px] text-slate-500">Daily routine updates, sleep/meal logs & bilingual parent summaries.</p>
          </div>

          <div 
            onClick={() => onNavigate('kindersafe')}
            className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🛡️</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">QR / OTP</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-rose-700 transition-colors">KinderSafe Terminal</h4>
            <p className="text-[11px] text-slate-500">Staff pickup verification, emergency headcount & incident logs.</p>
          </div>

          <div 
            onClick={() => onNavigate('kinderquest')}
            className="p-4 rounded-2xl bg-white border border-amber-100 hover:border-amber-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🗺️</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Wonder Garden</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs font-heading group-hover:text-amber-700 transition-colors">KinderQuest Play</h4>
            <p className="text-[11px] text-slate-500">Play-based learning quests, shape sorting & take-home activities.</p>
          </div>
        </div>
      </div>

      {/* Roster & Quick Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Students Quick View */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                Classroom Roster ({children.length})
              </h3>
              <p className="text-xs text-slate-400">Current learners in {assignedClass?.name}</p>
            </div>
            <button
              onClick={() => onNavigate('children')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              All Profiles <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {children.map(child => (
              <div
                key={child._id}
                className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={child.photo} alt={child.firstName} className="w-11 h-11 rounded-2xl object-cover border border-emerald-100 shadow-xs" />
                  <div>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">{child.firstName} {child.lastName}</p>
                    <p className="text-[11px] text-slate-400">ID: {child.childId} • Parent: {child.parentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {child.allergies?.length > 0 ? (
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> {child.allergies[0]}
                    </span>
                  ) : (
                    <Badge variant="Present">Healthy</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Classroom Activities */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                Logged Sensory & Learning Activities
              </h3>
              <p className="text-xs text-slate-400">Recent classroom curriculum logs</p>
            </div>
            <button
              onClick={() => onNavigate('activities')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              Add Activity <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.slice(0, 3).map(act => (
                <div key={act._id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2 hover:bg-purple-50/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{act.title}</span>
                    <Badge variant="lavender">{act.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{act.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium">
                    <span>Target: {act.learningAreas?.join(', ') || 'Social & Motor Skills'}</span>
                    <span className="text-purple-600 font-bold">5 Stars</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs font-semibold">No classroom activities recorded today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
