import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Award, 
  BookOpen, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Brain, 
  Heart, 
  Palette, 
  Activity as ActivityIcon,
  Smile,
  Eye,
  Star,
  Check,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'milestones'

  // Modals
  const [showAddActModal, setShowAddActModal] = useState(false);
  const [showAddProgModal, setShowAddProgModal] = useState(false);

  // Form: Activity
  const [actForm, setActForm] = useState({
    title: '',
    description: '',
    category: 'Sensory & Play',
    classId: '',
    learningObjectives: '',
    materialsNeeded: '',
    teacherNotes: ''
  });

  // Form: Progress
  const [progForm, setProgForm] = useState({
    childId: '',
    term: 'Term 1 (Autumn 2026)',
    generalNotes: '',
    domains: {
      language: { score: 4, observation: 'Enjoys story circles and expresses thoughts clearly in sentences.' },
      motorSkills: { score: 4, observation: 'Great fine motor grip on jumbo crayons and child-safe scissors.' },
      creativity: { score: 5, observation: 'Vibrant artistic imagination with watercolors, leaves, and playdough.' },
      socialSkills: { score: 4, observation: 'Shares nicely during center time and displays gentle empathy towards peers.' },
      cognitive: { score: 4, observation: 'Recognizes primary colors, shapes, and numbers enthusiastically.' }
    }
  });

  const toast = useToast();
  const { role } = useAuth();
  const canCreate = role === 'super_admin' || role === 'school_admin' || role === 'teacher';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [actList, progList, clsList, kidList] = await Promise.all([
        api.getActivities(),
        api.getProgressRecords(),
        api.getClasses(),
        api.getChildren()
      ]);
      setActivities(actList);
      setProgressRecords(progList);
      setClasses(clsList);
      setChildren(kidList);
      if (clsList.length > 0 && !actForm.classId) {
        setActForm(prev => ({ ...prev, classId: clsList[0]._id }));
      }
      if (kidList.length > 0 && !progForm.childId) {
        setProgForm(prev => ({ ...prev, childId: kidList[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load activities: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      await api.createActivity({
        ...actForm,
        learningObjectives: actForm.learningObjectives ? actForm.learningObjectives.split(',').map(s => s.trim()) : []
      });
      toast.success('Preschool learning activity logged! 🎨');
      setShowAddActModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateProgress = async (e) => {
    e.preventDefault();
    try {
      await api.createProgressRecord(progForm);
      toast.success('Development milestone evaluation recorded! ⭐');
      setShowAddProgModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteActivity = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove activity "${title}"?`)) return;
    try {
      await api.deleteActivity(id);
      toast.success('Activity removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete activity: ' + err.message);
    }
  };

  const handleDeleteProgress = async (id, childName) => {
    if (!window.confirm(`Are you sure you want to remove milestone evaluation for ${childName}?`)) return;
    try {
      await api.deleteProgressRecord(id);
      toast.success('Milestone evaluation record removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete milestone record: ' + err.message);
    }
  };

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'Sensory & Play': return '🫧';
      case 'Arts & Craft': return '🎨';
      case 'Phonics & Language': return '📚';
      case 'Gross Motor': return '🏃';
      case 'STEM & Math': return '🔬';
      case 'Music & Movement': return '🎵';
      default: return '✨';
    }
  };

  const renderStars = (count) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= count ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-100 text-purple-700">
              <Sparkles className="w-6 h-6" />
            </span>
            Learning Activities & Milestones
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Age-appropriate sensory experiences, guided creative curriculum, and 5-domain developmental milestone portfolios.
          </p>
        </div>

        {canCreate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddActModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 transition-all text-xs flex items-center gap-1.5 shadow-md shadow-purple-200 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Log Activity
            </button>
            <button
              onClick={() => setShowAddProgModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 transition-all text-xs flex items-center gap-1.5 shadow-md shadow-indigo-200 active:scale-95"
            >
              <Award className="w-4 h-4" /> Evaluate Milestones
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 font-heading ${
            activeTab === 'activities'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Classroom Learning Activities ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 font-heading ${
            activeTab === 'milestones'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Award className="w-4 h-4" />
          5-Domain Milestone Evaluations ({progressRecords.length})
        </button>
      </div>

      {/* Tab 1: Activities Grid */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {activities.map(act => (
            <div
              key={act._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] hover:shadow-[0_12px_28px_-4px_rgba(148,163,184,0.16)] transition-all duration-300 space-y-4 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 flex items-center gap-1.5">
                    <span>{getCategoryEmoji(act.category)}</span> {act.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{act.date}</span>
                </div>

                {act.photos?.[0] && (
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={act.photos[0]}
                      alt={act.title}
                      className="w-full h-40 object-cover border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-heading">{act.title}</h3>
                  <p className="text-xs text-purple-700 font-bold">{act.className}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                </div>

                {act.learningObjectives?.length > 0 && (
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl text-[11px] space-y-1 border border-slate-100">
                    <p className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px] font-heading">Learning Focus:</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {act.learningObjectives.map((obj, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                          <Check className="w-2.5 h-2.5 text-purple-600" /> {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>By <strong>{act.createdByName || 'Teacher Clara'}</strong></span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                  {canCreate && (
                    <button
                      onClick={() => handleDeleteActivity(act._id, act.title)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: 5-Domain Milestone Evaluations */}
      {activeTab === 'milestones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {progressRecords.map(prog => (
            <div
              key={prog._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_-2px_rgba(148,163,184,0.08)] space-y-4"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">{prog.childName}</h3>
                  <p className="text-xs text-purple-700 font-bold">{prog.className} • {prog.term}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    Evaluated by {prog.evaluatorName}
                  </span>
                  {canCreate && (
                    <button
                      onClick={() => handleDeleteProgress(prog._id, prog.childName)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Milestone Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 5 Domains Grid */}
              <div className="space-y-3 text-xs">
                {/* 1. Language */}
                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-purple-950">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Smile className="w-3.5 h-3.5 text-purple-600" /> Language & Communication
                    </span>
                    {renderStars(prog.domains.language.score)}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{prog.domains.language.observation}</p>
                </div>

                {/* 2. Motor Skills */}
                <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-sky-950">
                    <span className="flex items-center gap-1.5 font-heading">
                      <ActivityIcon className="w-3.5 h-3.5 text-sky-600" /> Motor Skills Coordination
                    </span>
                    {renderStars(prog.domains.motorSkills.score)}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{prog.domains.motorSkills.observation}</p>
                </div>

                {/* 3. Creativity */}
                <div className="p-3.5 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-pink-950">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Palette className="w-3.5 h-3.5 text-pink-600" /> Creativity & Expression
                    </span>
                    {renderStars(prog.domains.creativity.score)}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{prog.domains.creativity.observation}</p>
                </div>

                {/* 4. Social Skills */}
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Heart className="w-3.5 h-3.5 text-emerald-600" /> Social & Emotional Agility
                    </span>
                    {renderStars(prog.domains.socialSkills.score)}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{prog.domains.socialSkills.observation}</p>
                </div>

                {/* 5. Cognitive */}
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Brain className="w-3.5 h-3.5 text-amber-600" /> Cognitive & Problem Solving
                    </span>
                    {renderStars(prog.domains.cognitive.score)}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{prog.domains.cognitive.observation}</p>
                </div>
              </div>

              {/* General Summary */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl text-[11px] text-slate-700 italic border border-slate-100">
                "{prog.generalNotes}"
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Activity Modal */}
      <Modal isOpen={showAddActModal} onClose={() => setShowAddActModal(false)} title="Log Classroom Learning Activity">
        <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Activity Name *</label>
              <input
                type="text"
                required
                value={actForm.title}
                onChange={(e) => setActForm({ ...actForm, title: e.target.value })}
                placeholder="e.g. Tactile Sensory Rice Sorting"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={actForm.category}
                onChange={(e) => setActForm({ ...actForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Sensory & Play">🫧 Sensory & Play</option>
                <option value="Arts & Craft">🎨 Arts & Craft</option>
                <option value="Phonics & Language">📚 Phonics & Language</option>
                <option value="Gross Motor">🏃 Gross Motor</option>
                <option value="STEM & Math">🔬 STEM & Math</option>
                <option value="Music & Movement">🎵 Music & Movement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Classroom Group *</label>
            <select
              value={actForm.classId}
              onChange={(e) => setActForm({ ...actForm, classId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.section})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows="3"
              required
              value={actForm.description}
              onChange={(e) => setActForm({ ...actForm, description: e.target.value })}
              placeholder="Explain how toddlers engaged with textures, colors, or sounds..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Learning Objectives (comma separated)</label>
            <input
              type="text"
              value={actForm.learningObjectives}
              onChange={(e) => setActForm({ ...actForm, learningObjectives: e.target.value })}
              placeholder="e.g. Fine motor grip, Color discrimination, Turn-taking"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddActModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold hover:bg-purple-700 shadow-md shadow-purple-200 active:scale-95"
            >
              Publish Activity
            </button>
          </div>
        </form>
      </Modal>

      {/* Evaluate Milestones Modal */}
      <Modal isOpen={showAddProgModal} onClose={() => setShowAddProgModal(false)} title="Record 5-Domain Milestones">
        <form onSubmit={handleCreateProgress} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Student *</label>
              <select
                value={progForm.childId}
                onChange={(e) => setProgForm({ ...progForm, childId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                {children.map(c => (
                  <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.className})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Evaluation Term</label>
              <input
                type="text"
                value={progForm.term}
                onChange={(e) => setProgForm({ ...progForm, term: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="font-extrabold text-slate-800 font-heading">Domain Scores & Observations (1 to 5 Stars):</p>
            {['language', 'motorSkills', 'creativity', 'socialSkills', 'cognitive'].map(dom => (
              <div key={dom} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                <span className="font-bold capitalize text-slate-700 w-32 font-heading">{dom}</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={progForm.domains[dom].score}
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    setProgForm({
                      ...progForm,
                      domains: {
                        ...progForm.domains,
                        [dom]: { ...progForm.domains[dom], score }
                      }
                    });
                  }}
                  className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-center font-extrabold text-purple-700"
                />
                <input
                  type="text"
                  value={progForm.domains[dom].observation}
                  onChange={(e) => {
                    const observation = e.target.value;
                    setProgForm({
                      ...progForm,
                      domains: {
                        ...progForm.domains,
                        [dom]: { ...progForm.domains[dom], observation }
                      }
                    });
                  }}
                  placeholder="Observation..."
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">General Notes</label>
            <textarea
              rows="2"
              value={progForm.generalNotes}
              onChange={(e) => setProgForm({ ...progForm, generalNotes: e.target.value })}
              placeholder="Overall encouragement and positive development remarks..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddProgModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-95"
            >
              Save Milestone Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
