import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Baby, 
  Award, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Brain, 
  Heart, 
  Palette, 
  Activity as ActivityIcon, 
  Smile, 
  FileText, 
  Edit3, 
  Eye, 
  MessageCircle, 
  Home, 
  AlertCircle,
  ThumbsUp,
  X,
  Share2,
  Printer
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const KinderGrowthPage = () => {
  const { role, user } = useAuth();
  const toast = useToast();

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [growthProfile, setGrowthProfile] = useState(null);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all'); // 'all' | 'teacher' | 'home'
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Modals
  const [showObsModal, setShowObsModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showMonthlySummaryModal, setShowMonthlySummaryModal] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [monthlySummaryPreview, setMonthlySummaryPreview] = useState(null);

  // Form: Record Observation (Teacher or Parent)
  const [obsForm, setObsForm] = useState({
    domain: 'creativity',
    score: 4,
    milestoneTitle: '',
    notes: '',
    activityTitle: '',
    context: 'classroom',
    photo: ''
  });

  const canEducate = role === 'super_admin' || role === 'school_admin' || role === 'teacher';
  const isParent = role === 'parent';

  // Fetch children list on mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const kidList = await api.getChildren();
        setChildren(kidList);
        if (kidList.length > 0) {
          setSelectedChildId(kidList[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load students: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  // Fetch child growth profile when child changes
  const fetchProfile = async (childId) => {
    if (!childId) return;
    try {
      setLoading(true);
      const [profileData, obsData] = await Promise.all([
        api.getGrowthProfile(childId),
        api.getObservations({ childId })
      ]);
      setGrowthProfile(profileData);
      setObservations(obsData);
    } catch (err) {
      toast.error('Failed to load growth profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchProfile(selectedChildId);
    }
  }, [selectedChildId]);

  // Handle Record Observation
  const handleSaveObservation = async (e) => {
    e.preventDefault();
    if (!obsForm.milestoneTitle || !obsForm.notes) {
      toast.error('Please enter a milestone title and observation notes.');
      return;
    }

    try {
      await api.createObservation({
        childId: selectedChildId,
        domain: obsForm.domain,
        score: obsForm.score,
        milestoneTitle: obsForm.milestoneTitle,
        notes: obsForm.notes,
        activityTitle: obsForm.activityTitle,
        context: isParent ? 'home' : obsForm.context,
        photo: obsForm.photo,
        isHomeObservation: isParent
      });

      toast.success(isParent ? 'Home observation shared with teachers!' : 'Classroom observation recorded successfully!');
      setShowObsModal(false);
      setObsForm({
        domain: 'creativity',
        score: 4,
        milestoneTitle: '',
        notes: '',
        activityTitle: '',
        context: 'classroom',
        photo: ''
      });
      fetchProfile(selectedChildId);
    } catch (err) {
      toast.error('Error recording observation: ' + err.message);
    }
  };

  // Generate AI Suggestions
  const handleGenerateAiSuggestions = async () => {
    try {
      const res = await api.generateAiSuggestions(selectedChildId);
      toast.success(res.message);
      fetchProfile(selectedChildId);
    } catch (err) {
      toast.error('AI suggestion failed: ' + err.message);
    }
  };

  // Review & Approve AI Suggestion
  const handleApproveSuggestion = async (suggestionId, status = 'approved') => {
    try {
      await api.reviewAiSuggestion(suggestionId, {
        status,
        teacherNotes: editingSuggestion?.teacherNotes || 'Approved for classroom implementation.'
      });
      toast.success(`Suggestion ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      setEditingSuggestion(null);
      fetchProfile(selectedChildId);
    } catch (err) {
      toast.error('Failed to update suggestion: ' + err.message);
    }
  };

  // Open Monthly Summary Generator
  const handleOpenMonthlySummary = async () => {
    try {
      const summary = await api.getMonthlySummary(selectedChildId);
      setMonthlySummaryPreview(summary);
      setShowMonthlySummaryModal(true);
    } catch (err) {
      toast.error('Failed to generate monthly summary: ' + err.message);
    }
  };

  // Publish Monthly Summary
  const handlePublishMonthlySummary = async () => {
    try {
      await api.publishMonthlySummary(selectedChildId, {
        monthYear: monthlySummaryPreview.monthYear,
        summaryText: monthlySummaryPreview.strengths.join(' ') + ' ' + monthlySummaryPreview.growthAreas.join(' '),
        strengths: monthlySummaryPreview.strengths,
        growthAreas: monthlySummaryPreview.growthAreas
      });
      toast.success('Monthly developmental progress summary published for parents!');
      setShowMonthlySummaryModal(false);
      fetchProfile(selectedChildId);
    } catch (err) {
      toast.error('Failed to publish summary: ' + err.message);
    }
  };

  // Filter observations
  const filteredObservations = observations.filter(obs => {
    if (selectedDomain !== 'all' && obs.domain !== selectedDomain) return false;
    if (selectedSource === 'home' && !obs.isHomeObservation) return false;
    if (selectedSource === 'teacher' && obs.isHomeObservation) return false;
    if (filterStartDate && obs.date < filterStartDate) return false;
    if (filterEndDate && obs.date > filterEndDate) return false;
    return true;
  });

  const activeChild = growthProfile?.child;

  // Radar chart data comparing child against their OWN baseline
  const radarChartData = (growthProfile?.selfComparison || []).map(item => ({
    domain: item.label.split('&')[0].trim(),
    current: item.currentScore,
    previous: item.previousScore,
    fullMark: 5
  }));

  const domainIcons = {
    language: MessageCircle,
    cognitive: Brain,
    creativity: Palette,
    motorSkills: ActivityIcon,
    socialEmotional: Heart
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-xl shadow-purple-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              🌱 KinderGrowth AI • Personalized Child Learning Journey
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Developmental Portfolios & Milestones
            </h2>
            <p className="text-purple-100 text-sm max-w-2xl leading-relaxed">
              Track 5 key early childhood domains through authentic observations. Compare each child's advancement against their <strong className="text-white font-extrabold">own personal baseline</strong>, generate educator-approved suggestions, and foster joyful collaboration between classroom and home.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowObsModal(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-white text-purple-900 font-extrabold hover:bg-purple-50 transition-all text-xs flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-purple-700" /> 
              {isParent ? 'Share Home Observation' : 'Record Observation'}
            </button>

            {canEducate && (
              <>
                <button
                  onClick={handleGenerateAiSuggestions}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-purple-500/80 hover:bg-purple-500 text-white font-extrabold transition-all text-xs flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" /> Suggest Next Steps
                </button>
                <button
                  onClick={handleOpenMonthlySummary}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-pink-500/80 hover:bg-pink-500 text-white font-extrabold transition-all text-xs flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-pink-200" /> Monthly Summary
                </button>
              </>
            )}
          </div>
        </div>

        {/* Child Selection Pills */}
        {children.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-purple-200 shrink-0 mr-1">Select Child:</span>
            {children.map(child => (
              <button
                key={child._id}
                onClick={() => setSelectedChildId(child._id)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedChildId === child._id
                    ? 'bg-white text-purple-900 shadow-md scale-102 font-extrabold'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/10'
                }`}
              >
                <img
                  src={child.photo || 'https://images.unsplash.com/photo-1595454223600-91fb57d42531?w=100'}
                  alt={child.firstName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{child.firstName} {child.lastName}</span>
                <span className="text-[10px] opacity-75">({child.className?.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && !growthProfile ? (
        <div className="p-12 text-center text-slate-400 font-medium">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
          Loading developmental journey...
        </div>
      ) : growthProfile && activeChild ? (
        <>
          {/* Child Overview & Self-Comparison Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Child Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeChild.photo}
                  alt={activeChild.firstName}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                    {activeChild.firstName} {activeChild.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    ID: <span className="font-bold text-purple-700">{activeChild.childId}</span> • Age: {activeChild.age}
                  </p>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Class: <span className="font-bold text-slate-800">{activeChild.className}</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 text-xs space-y-1">
                <p className="font-extrabold text-purple-900 font-heading flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600" /> Authentic Assessment Philosophy
                </p>
                <p className="text-purple-800 text-[11px] leading-relaxed">
                  KinderGrowth AI benchmarks each child against their <strong>own previous observations</strong>. We celebrate individual learning velocity without peer rankings or standardized labels.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Total Observations: <strong className="text-slate-800">{growthProfile.totalObservations}</strong></span>
                <span>Active Suggestions: <strong className="text-purple-700">{growthProfile.aiSuggestions.length}</strong></span>
              </div>
            </div>

            {/* Recharts: Self-Comparison Radar Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-heading">
                    5-Domain Development Horizon (Self-Comparison)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current observation level vs. Child's previous evaluation baseline
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-purple-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Current Velocity
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Previous Baseline
                  </span>
                </div>
              </div>

              <div className="h-64 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarChartData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Radar name="Current" dataKey="current" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.4} />
                    <Radar name="Previous" dataKey="previous" stroke="#94A3B8" fill="#CBD5E1" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 5-Domain Growth Cards with Self-Comparison Velocity */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-slate-800 font-heading">
              Continuous Domain Velocity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {growthProfile.selfComparison.map(domain => {
                const IconComponent = domainIcons[domain.domain] || Sparkles;
                const isAdvancing = domain.difference > 0;
                return (
                  <div key={domain.domain} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3 card-hover">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isAdvancing ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {domain.velocity} {isAdvancing ? `(+${domain.difference})` : ''}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-500">{domain.label}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-extrabold text-slate-900 font-heading">
                          {domain.currentScore}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          / 5 (prev: {domain.previousScore})
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      "{domain.latestNotes}"
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      {domain.observationCount} observations logged
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Generated Activity Suggestions (Educator Review Deck) */}
          <div className="bg-gradient-to-br from-purple-50/70 via-pink-50/50 to-amber-50/60 rounded-3xl p-6 sm:p-8 border border-purple-200/80 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-purple-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                    KinderGrowth AI Activity Suggestions
                  </h3>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                    Curated Suggestions
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Generated from authentic classroom observations. <strong>Teachers review, edit, and approve</strong> before activities are assigned or published.
                </p>
              </div>

              {canEducate && (
                <button
                  onClick={handleGenerateAiSuggestions}
                  className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Refresh Suggestions
                </button>
              )}
            </div>

            {growthProfile.aiSuggestions.length === 0 ? (
              <div className="p-8 text-center bg-white/70 rounded-2xl text-slate-400 text-xs font-semibold border border-purple-100">
                No active suggestions currently. Click "Suggest Next Steps" to analyze latest milestones!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {growthProfile.aiSuggestions.map(sug => (
                  <div key={sug._id} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          {sug.domain}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 font-heading mt-1.5">
                          {sug.suggestedTitle}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        sug.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                      }`}>
                        {sug.status === 'approved' ? 'Approved & Assigned' : 'Pending Review'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sug.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                      <p className="font-extrabold text-slate-700">💡 Pedagogical Rationale:</p>
                      <p className="text-slate-500 italic">"{sug.rationale}"</p>
                      <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-200">
                        <strong>Materials:</strong> {sug.materials}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 italic">
                        {sug.disclaimer}
                      </span>
                      {canEducate && sug.status === 'pending_review' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApproveSuggestion(sug._id, 'approved')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleApproveSuggestion(sug._id, 'rejected')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Milestone Timeline with Comprehensive Filters */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                  Milestone Observation Timeline
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed developmental moments captured by teachers in class and parents at home
                </p>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Domain filter */}
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">All Domains</option>
                  <option value="creativity">Creativity</option>
                  <option value="language">Language</option>
                  <option value="motorSkills">Motor Skills</option>
                  <option value="cognitive">Cognitive</option>
                  <option value="socialEmotional">Social-Emotional</option>
                </select>

                {/* Source filter */}
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">All Sources</option>
                  <option value="teacher">Teacher Observations</option>
                  <option value="home">Home Observations (Parents)</option>
                </select>

                {/* Date inputs */}
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold"
                  placeholder="From"
                />
              </div>
            </div>

            {/* Timeline Item List */}
            {filteredObservations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No observations match the selected filters.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-purple-100">
                {filteredObservations.map((obs) => {
                  const Icon = domainIcons[obs.domain] || Sparkles;
                  return (
                    <div key={obs._id} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-4 border-purple-500 shadow-sm flex items-center justify-center" />

                      <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 transition-all space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-900 font-heading">
                              {obs.milestoneTitle}
                            </h4>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                              {obs.domain}
                            </span>
                            {obs.isHomeObservation && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                                <Home className="w-2.5 h-2.5" /> Home Observation
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                              Score: {obs.score}/5
                            </span>
                            <span className="text-slate-400 font-medium text-[11px]">
                              {obs.date}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          "{obs.notes}"
                        </p>

                        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                          <span>
                            Observed by: <strong className="text-slate-700">{obs.observedByName}</strong> ({obs.observedByRole})
                          </span>
                          <span>
                            Activity: <strong className="text-slate-700">{obs.activityTitle}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* MODAL: Record Observation (Educator or Parent) */}
      <Modal
        isOpen={showObsModal}
        onClose={() => setShowObsModal(false)}
        title={isParent ? 'Share Home Learning Observation' : 'Record Classroom Developmental Observation'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveObservation} className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            {isParent 
              ? 'Share moments you notice at home (storytelling, block building, kindness) so teachers can nurture your child\'s passions.'
              : 'Link observation to domain milestone and specific curriculum activity.'}
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Developmental Domain *</label>
            <select
              value={obsForm.domain}
              onChange={(e) => setObsForm({ ...obsForm, domain: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
            >
              <option value="creativity">Creativity & Artistic Expression</option>
              <option value="language">Language & Communication</option>
              <option value="motorSkills">Motor Skills Coordination</option>
              <option value="cognitive">Cognitive & Problem Solving</option>
              <option value="socialEmotional">Social-Emotional Agility</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Milestone Headline / Achievement *</label>
            <input
              type="text"
              placeholder="e.g. Blended yellow and blue paints to make green"
              value={obsForm.milestoneTitle}
              onChange={(e) => setObsForm({ ...obsForm, milestoneTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Observation Notes & Behavior *</label>
            <textarea
              rows={3}
              placeholder="Describe what the child said, made, or how they solved the challenge..."
              value={obsForm.notes}
              onChange={(e) => setObsForm({ ...obsForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assessment Level (1 to 5)</label>
              <select
                value={obsForm.score}
                onChange={(e) => setObsForm({ ...obsForm, score: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
              >
                <option value={1}>1 - Emerging (Beginning Interest)</option>
                <option value={2}>2 - Developing (Supported Practice)</option>
                <option value={3}>3 - Competent (Consistent with Guidance)</option>
                <option value={4}>4 - Proficient (Independent & Confident)</option>
                <option value={5}>5 - Mastered (Autonomous & Creative)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Activity / Context</label>
              <input
                type="text"
                placeholder={isParent ? 'Bedtime reading, park visit' : 'Autumn Sensory Collage'}
                value={obsForm.activityTitle}
                onChange={(e) => setObsForm({ ...obsForm, activityTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowObsModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
            >
              Save Milestone Observation
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Monthly Progress Summary Review & Publishing */}
      {monthlySummaryPreview && (
        <Modal
          isOpen={showMonthlySummaryModal}
          onClose={() => setShowMonthlySummaryModal(false)}
          title={`Monthly Progress Summary: ${monthlySummaryPreview.childName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-900 font-heading text-sm">
                  {monthlySummaryPreview.monthYear} • {monthlySummaryPreview.classroom}
                </span>
                <span className="bg-purple-200 text-purple-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Draft Report
                </span>
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                {monthlySummaryPreview.comparativeInsight}
              </p>
            </div>

            <div>
              <h5 className="font-extrabold text-slate-800 mb-1.5">Key Strengths & Celebrations:</h5>
              <ul className="space-y-1 list-disc pl-4 text-slate-600">
                {monthlySummaryPreview.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-slate-800 mb-1.5">Gentle Nurturing Goals for Next Month:</h5>
              <ul className="space-y-1 list-disc pl-4 text-slate-600">
                {monthlySummaryPreview.growthAreas.map((ga, i) => (
                  <li key={i}>{ga}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
              Approved by: <strong>{monthlySummaryPreview.evaluatorName}</strong>. Once published, this report appears immediately in Sarah Johnson's Parent Portal with printable formatting.
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMonthlySummaryModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePublishMonthlySummary}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold shadow-md"
              >
                Approve & Publish for Parents
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
