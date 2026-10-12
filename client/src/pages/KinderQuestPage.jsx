import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Map, 
  Award, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  BookOpen, 
  Heart, 
  HelpCircle, 
  Smile, 
  Star, 
  ChevronRight, 
  ArrowRight,
  Compass,
  Sprout,
  Sun,
  Flame,
  Palette
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const KinderQuestPage = () => {
  const { role, user } = useAuth();
  const toast = useToast();

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [journeyData, setJourneyData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeInteractiveActivity, setActiveInteractiveActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive Mini-Activity State
  const [matchingState, setMatchingState] = useState({ pair1: null, pair2: null, matched: [] });
  const [countingCount, setCountingCount] = useState(0);
  const [sortingItems, setSortingItems] = useState([
    { id: 1, name: 'Circle', shape: 'circle' },
    { id: 2, name: 'Square', shape: 'square' },
    { id: 3, name: 'Triangle', shape: 'triangle' }
  ]);
  const [sortedBuckets, setSortedBuckets] = useState({ circle: false, square: false, triangle: false });

  const isStaff = role === 'super_admin' || role === 'school_admin' || role === 'teacher';

  useEffect(() => {
    const fetchKids = async () => {
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
    fetchKids();
  }, []);

  const fetchJourney = async (childId) => {
    if (!childId) return;
    try {
      setLoading(true);
      const res = await api.getQuestJourney(childId);
      setJourneyData(res);
      if (res.chapters?.length > 0) {
        setSelectedChapter(res.chapters[0]);
      }
    } catch (err) {
      toast.error('Failed to load quest journey: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchJourney(selectedChildId);
    }
  }, [selectedChildId]);

  // Complete an activity
  const handleCompleteActivity = async (chapterId, activityId) => {
    try {
      const res = await api.completeQuestActivity({
        childId: selectedChildId,
        chapterId,
        activityId,
        reflectionNotes: 'Completed with great enthusiasm!'
      });
      toast.success(res.message);
      setActiveInteractiveActivity(null);
      fetchJourney(selectedChildId);
    } catch (err) {
      toast.error('Failed to complete activity: ' + err.message);
    }
  };

  // Teacher unlocks a chapter
  const handleUnlockChapter = async (chapterId) => {
    try {
      const res = await api.unlockChapter({
        childId: selectedChildId,
        chapterId
      });
      toast.success(res.message);
      fetchJourney(selectedChildId);
    } catch (err) {
      toast.error('Failed to unlock chapter: ' + err.message);
    }
  };

  // Interactive Mini-Activity Handler (Matching)
  const handleMatchPick = (item) => {
    if (!matchingState.pair1) {
      setMatchingState(prev => ({ ...prev, pair1: item }));
    } else if (!matchingState.pair2 && matchingState.pair1 !== item) {
      if (matchingState.pair1.color === item.color) {
        setMatchingState(prev => ({
          pair1: null,
          pair2: null,
          matched: [...prev.matched, item.color]
        }));
        toast.success(`Matched ${item.color} leaves! 🍂`);
      } else {
        toast.error('Not a matching color, try again!');
        setMatchingState(prev => ({ ...prev, pair1: null, pair2: null }));
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 text-white shadow-xl shadow-teal-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              🗺️ KinderQuest • Play-Based Wonder Garden Learning Path
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Joyful, Non-Competitive Learning Quests
            </h2>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
              Explore age-appropriate learning chapters across shape sorting, color matching, rhythm, counting, and storytelling. <strong>No leaderboards or timers</strong>—designed purely for early childhood wonder and offline family extensions.
            </p>
          </div>

          {/* Child Selector */}
          {children.length > 0 && (
            <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-2 border border-white/20">
              <span className="text-xs font-bold text-white px-2">Child:</span>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="bg-white text-emerald-900 font-extrabold text-xs px-3 py-1.5 rounded-xl border-none focus:outline-none"
              >
                {children.map(c => (
                  <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading && !journeyData ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          Loading Wonder Garden...
        </div>
      ) : journeyData ? (
        <div className="space-y-8">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-amber-300 flex items-center justify-center text-2xl shadow-md shadow-emerald-500/20">
                🌿
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                  {journeyData.child?.name}'s Journey in the Wonder Garden
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Completed {journeyData.completedActivitiesCount} of {journeyData.totalActivitiesCount} playful learning activities
                </p>
              </div>
            </div>

            {/* Non-competitive progress bar */}
            <div className="w-full md:w-72 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Garden Exploration</span>
                <span className="text-emerald-700">{journeyData.completionPercent}% Explored</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${journeyData.completionPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">Gentle participation progress</p>
            </div>
          </div>

          {/* Chapters Stepper & Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {journeyData.chapters.map((chapter, idx) => {
              const isSelected = selectedChapter?.chapterId === chapter.chapterId;
              return (
                <div
                  key={chapter.chapterId}
                  onClick={() => chapter.unlocked && setSelectedChapter(chapter)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-md ring-2 ring-emerald-400/20'
                      : chapter.unlocked
                      ? 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{chapter.badge.icon}</span>
                    {chapter.unlocked ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {chapter.completedActivitiesCount === chapter.totalActivities ? 'Completed' : 'Unlocked'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-600 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-900 font-heading text-sm">
                    {chapter.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{chapter.theme}</p>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {chapter.completedActivitiesCount} / {chapter.totalActivities} quests done
                    </span>
                    {isStaff && !chapter.unlocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlockChapter(chapter.chapterId);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold"
                      >
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Chapter Quest Details */}
          {selectedChapter && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                    <span>{selectedChapter.badge.icon}</span> {selectedChapter.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Theme: {selectedChapter.theme} • Collect the <strong>"{selectedChapter.badge.name}"</strong> badge
                  </p>
                </div>

                {selectedChapter.badge.unlocked && (
                  <span className="px-3 py-1 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold flex items-center gap-1 shadow-xs">
                    ⭐ Badge Earned: {selectedChapter.badge.name}
                  </span>
                )}
              </div>

              {/* Quest Activities List */}
              <div className="space-y-4">
                {selectedChapter.activities.map((act) => (
                  <div
                    key={act.activityId}
                    className={`p-5 rounded-2xl border transition-all ${
                      act.completed 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                            {act.type}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-xs font-heading">
                            {act.title}
                          </h4>
                          {act.completed && (
                            <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {act.instructions}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!act.completed ? (
                          <>
                            <button
                              onClick={() => setActiveInteractiveActivity(act)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-xs"
                            >
                              Play Activity
                            </button>
                            <button
                              onClick={() => handleCompleteActivity(selectedChapter.chapterId, act.activityId)}
                              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
                            >
                              Mark Done
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                            ✓ Mastered
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Offline Extension Card */}
                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs flex items-start gap-2 text-slate-500">
                      <span className="font-extrabold text-amber-700">🏡 Offline Family Extension:</span>
                      <span>{act.offlineExtension}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Play Activity Modal */}
          {activeInteractiveActivity && (
            <Modal
              isOpen={!!activeInteractiveActivity}
              onClose={() => setActiveInteractiveActivity(null)}
              title={`Play-Based Quest: ${activeInteractiveActivity.title}`}
              maxWidth="max-w-lg"
            >
              <div className="space-y-5 text-xs text-center py-2">
                <p className="text-slate-600 leading-relaxed">
                  {activeInteractiveActivity.instructions}
                </p>

                {/* 1. MATCHING ACTIVITY */}
                {activeInteractiveActivity.type === 'matching' && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-400">Click pairs of identical colored autumn leaves:</p>
                    <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                      {[
                        { id: 1, color: 'Red', hex: '#EF4444', icon: '🍁' },
                        { id: 2, color: 'Yellow', hex: '#FACC15', icon: '🍂' },
                        { id: 3, color: 'Red', hex: '#EF4444', icon: '🍁' },
                        { id: 4, color: 'Yellow', hex: '#FACC15', icon: '🍂' }
                      ].map(leaf => (
                        <button
                          key={leaf.id}
                          onClick={() => handleMatchPick(leaf)}
                          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-2xl transition-all shadow-xs"
                        >
                          {leaf.icon}
                        </button>
                      ))}
                    </div>
                    {matchingState.matched.length >= 2 && (
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold animate-pop-in">
                        🎉 Splendid! All matching colors found!
                      </div>
                    )}
                  </div>
                )}

                {/* 2. COUNTING ACTIVITY */}
                {activeInteractiveActivity.type === 'counting' && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-400">Tap the caterpillars to count up to 5:</p>
                    <div className="text-4xl font-extrabold text-emerald-700 font-heading">
                      {countingCount} / 5 🐛
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setCountingCount(prev => Math.min(5, prev + 1))}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                      >
                        Count +1
                      </button>
                      <button
                        onClick={() => setCountingCount(0)}
                        className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                      >
                        Reset
                      </button>
                    </div>
                    {countingCount === 5 && (
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold animate-pop-in">
                        🌟 Bravo! Counted 5 caterpillars perfectly!
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SORTING ACTIVITY */}
                {activeInteractiveActivity.type === 'sorting' && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-400">Place shapes into their wooden discovery slots:</p>
                    <div className="flex justify-center gap-3">
                      {['circle', 'square', 'triangle'].map(shape => (
                        <button
                          key={shape}
                          onClick={() => {
                            setSortedBuckets(prev => ({ ...prev, [shape]: true }));
                            toast.success(`Sorted the ${shape}!`);
                          }}
                          className={`p-4 rounded-2xl border text-xs font-bold transition-all ${
                            sortedBuckets[shape]
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {shape === 'circle' ? '⭕ Circle' : shape === 'square' ? '⬛ Square' : '🔺 Triangle'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Non-competitive play mode</span>
                  <button
                    onClick={() => handleCompleteActivity(selectedChapter.chapterId, activeInteractiveActivity.activityId)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md"
                  >
                    Complete Quest & Save
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      ) : null}
    </div>
  );
};
