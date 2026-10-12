import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Languages, 
  MessageSquare, 
  Clock, 
  Coffee, 
  Moon, 
  Camera, 
  Sparkles, 
  Send, 
  CheckCheck, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Eye, 
  Smile, 
  ThumbsUp, 
  Share2, 
  BookOpen, 
  Home, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// UI Dictionary for Multilingual Interface in EN, MR (मराठी), and HI (हिन्दी)
const I18N = {
  en: {
    heroTitle: 'KinderConnect • Multilingual Home & School Bridge',
    heroDesc: 'Connecting educators and families with daily routine logs, nutritional updates, sleep checks, and automatic multi-language parent digests in English, Marathi, and Hindi.',
    logUpdateBtn: 'Log Daily Child Update',
    languageSelector: 'Interface Language:',
    routineTitle: 'Today\'s Routine & Joyful Moments',
    moodLabel: 'Child\'s Mood & Arrival State',
    mealsLabel: 'Nutritional Intake & Meals',
    napLabel: 'Rest & Afternoon Nap',
    activitiesLabel: 'Preschool Activities & Discovery',
    photosLabel: 'Approved Classroom Moments',
    parentDigestTitle: 'Parent-Friendly Daily Digest',
    originalEnLabel: 'Original English Teacher Update',
    translatedLabel: 'Translated Family Digest',
    homeActivitiesTitle: 'Try Tonight At Home (Screen-Free Extension)',
    feedbackTitle: 'Family Feedback & Reactions',
    feedbackPlaceholder: 'Leave a note or appreciation for the teachers...',
    sendFeedback: 'Send Feedback',
    privacyTitle: 'Family Privacy & Media Permissions',
    privacyNotice: 'Parent consent settings for sharing child photos and developmental observations.'
  },
  mr: {
    heroTitle: 'किंडरकनेक्ट • शाळा आणि पालक संवाद केंद्र',
    heroDesc: 'दैनंदिन दिनचर्या, पौष्टिक आहार, दुपारची विश्रांती आणि इंग्रजी, मराठी व हिन्दी भाषेत पालक सारांशासह शिक्षक व पालकांना जोडणारा संवाद मंच.',
    logUpdateBtn: 'दैनंदिन अपडेट नोंदवा',
    languageSelector: 'इंटरफेस भाषा:',
    routineTitle: 'आजची दिनचर्या आणि आनंदाचे क्षण',
    moodLabel: 'मुलाचा मूड आणि आगमन स्थिती',
    mealsLabel: 'पौष्टिक आहार आणि जेवण',
    napLabel: 'दुपारची झोप आणि विश्रांती',
    activitiesLabel: 'शाळेतील उपक्रम आणि शिकणे',
    photosLabel: 'मंजूर केलेली वर्गचित्रे',
    parentDigestTitle: 'पालकांसाठी सोपा दैनिक सारांश',
    originalEnLabel: 'मूळ इंग्रजी शिक्षक संदेश',
    translatedLabel: 'मराठी भाषांतरित कुटुंब सारांश',
    homeActivitiesTitle: 'आज रात्री घरी करून पहा (स्क्रीन-मुक्त खेळ)',
    feedbackTitle: 'पालकांचा प्रतिसाद आणि प्रतिक्रिया',
    feedbackPlaceholder: 'शिक्षकांसाठी प्रेमळ संदेश किंवा आभार लिहा...',
    sendFeedback: 'प्रतिसाद पाठवा',
    privacyTitle: 'कुटुंब गोपनीयता आणि छायाचित्र परवानग्या',
    privacyNotice: 'मुलांचे फोटो आणि नोंदी सामायिक करण्यासाठी पालकांच्या संमतीचे नियम.'
  },
  hi: {
    heroTitle: 'किंडरकनेक्ट • विद्यालय और परिवार सहयोग मंच',
    heroDesc: 'दैनिक दिनचर्या, पौष्टिक आहार, दोपहर का विश्राम और अंग्रेजी, मराठी व हिन्दी भाषा में सारांश के साथ शिक्षक और परिवार का सुगम संवाद।',
    logUpdateBtn: 'दैनिक अपडेट दर्ज करें',
    languageSelector: 'इंटरफेस भाषा:',
    routineTitle: 'आज की दिनचर्या और आनंदमय पल',
    moodLabel: 'बच्चे का मूड और आगमन स्थिति',
    mealsLabel: 'पौष्टिक भोजन और जलपान',
    napLabel: 'दोपहर की नींद और विश्राम',
    activitiesLabel: 'कक्षा गतिविधियाँ और अनुभव',
    photosLabel: 'अनुमोदित कक्षा तस्वीरें',
    parentDigestTitle: 'अभिभावक दैनिक सारांश',
    originalEnLabel: 'मूल अंग्रेजी शिक्षक संदेश',
    translatedLabel: 'हिन्दी अनुवादित पारिवारिक सारांश',
    homeActivitiesTitle: 'आज रात घर पर आजमाएं (स्क्रीन-मुक्त खेल)',
    feedbackTitle: 'पारिवारिक प्रतिक्रिया और स्नेह',
    feedbackPlaceholder: 'शिक्षकों के लिए आभार या संदेश लिखें...',
    sendFeedback: 'प्रतिक्रिया भेजें',
    privacyTitle: 'गोपनीयता और मीडिया अनुमतियाँ',
    privacyNotice: 'बच्चे की तस्वीरें और प्रगति साझा करने हेतु अभिभावक सहमति विकल्प।'
  }
};

export const KinderConnectPage = () => {
  const { role, user } = useAuth();
  const toast = useToast();

  const [language, setLanguage] = useState('en'); // 'en' | 'mr' | 'hi'
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New feedback text
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedReaction, setSelectedReaction] = useState('❤️');

  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Form: Daily Routine Log (Teacher)
  const [logForm, setLogForm] = useState({
    mood: 'Joyful',
    morningSnack: 'Ate all fresh apple slices',
    lunch: 'Finished whole wheat vegetable roti & lentil stew',
    afternoonSnack: 'Warm milk and raisin biscuit',
    hydration: 'Good (4 water cups filled and finished)',
    napMinutes: 45,
    napQuality: 'Restful',
    activity1Title: 'Morning Song Circle',
    activity1Desc: 'Sang greeting song with enthusiastic hand clapping.',
    activity2Title: 'Autumn Sensory Leaf Press',
    activity2Desc: 'Explored textured prints using yellow and orange washable colors.',
    teacherNotes: ''
  });

  // Privacy Settings state
  const [privacySettings, setPrivacySettings] = useState({
    allowPhotos: true,
    allowObservationSharing: true,
    retentionConsentGranted: true
  });

  const canEditLog = role === 'super_admin' || role === 'school_admin' || role === 'teacher';
  const t = I18N[language] || I18N.en;

  // Fetch children list
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
        toast.error('Failed to load children: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKids();
  }, []);

  // Fetch child timeline
  const fetchTimeline = async (childId) => {
    if (!childId) return;
    try {
      setLoading(true);
      const res = await api.getDailyTimeline(childId);
      setTimelineData(res);
      if (res.privacySettings) {
        setPrivacySettings(res.privacySettings);
      }
    } catch (err) {
      toast.error('Failed to load timeline: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchTimeline(selectedChildId);
    }
  }, [selectedChildId]);

  // Handle Submit Feedback (Parent)
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    if (!timelineData?.timeline?._id) {
      toast.error('No active daily log to attach feedback to.');
      return;
    }

    try {
      await api.submitParentFeedback({
        dailyLogId: timelineData.timeline._id,
        message: feedbackText,
        reaction: selectedReaction
      });

      toast.success('Feedback sent with gratitude to the teaching team!');
      setFeedbackText('');
      fetchTimeline(selectedChildId);
    } catch (err) {
      toast.error('Failed to submit feedback: ' + err.message);
    }
  };

  // Handle Save Daily Routine (Teacher)
  const handleSaveDailyLog = async (e) => {
    e.preventDefault();
    try {
      await api.createDailyLog({
        childId: selectedChildId,
        mood: logForm.mood,
        meals: {
          morningSnack: logForm.morningSnack,
          lunch: logForm.lunch,
          afternoonSnack: logForm.afternoonSnack,
          hydration: logForm.hydration
        },
        nap: {
          durationMinutes: Number(logForm.napMinutes),
          quality: logForm.napQuality
        },
        activities: [
          { time: '09:30 AM', title: logForm.activity1Title, description: logForm.activity1Desc, category: 'Sensory & Music' },
          { time: '11:00 AM', title: logForm.activity2Title, description: logForm.activity2Desc, category: 'Creative Art' }
        ],
        notes: logForm.teacherNotes
      });

      toast.success('Daily routine update and multilingual parent digests generated!');
      setShowLogModal(false);
      fetchTimeline(selectedChildId);
    } catch (err) {
      toast.error('Failed to save daily update: ' + err.message);
    }
  };

  // Handle Update Privacy Settings
  const handleUpdatePrivacy = async (key, val) => {
    const updated = { ...privacySettings, [key]: val };
    setPrivacySettings(updated);
    try {
      await api.updatePrivacySettings(selectedChildId, updated);
      toast.success('Privacy settings saved.');
    } catch (err) {
      toast.error('Failed to update privacy settings: ' + err.message);
    }
  };

  const timeline = timelineData?.timeline;
  const child = timelineData?.child;

  // Selected language digest
  const currentDigest = timeline?.parentFriendlyDigest?.[language] || timeline?.parentFriendlyDigest?.en || '';
  const originalEnglishDigest = timeline?.parentFriendlyDigest?.en || '';

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Hero Banner with Language Toggle */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 text-white shadow-xl shadow-teal-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
              🌍 KinderConnect • Multilingual Home & School Bridge
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.heroTitle}
            </h2>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
              {t.heroDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Language Switcher Pill */}
            <div className="bg-white/20 backdrop-blur-md p-1 rounded-2xl flex items-center border border-white/20">
              {[
                { code: 'en', label: 'English' },
                { code: 'mr', label: 'मराठी' },
                { code: 'hi', label: 'हिन्दी' }
              ].map(langItem => (
                <button
                  key={langItem.code}
                  onClick={() => setLanguage(langItem.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    language === langItem.code 
                      ? 'bg-white text-emerald-900 shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>

            {canEditLog && (
              <button
                onClick={() => setShowLogModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-white text-emerald-900 font-extrabold hover:bg-emerald-50 transition-all text-xs flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" /> {t.logUpdateBtn}
              </button>
            )}

            <button
              onClick={() => setShowPrivacyModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500/80 hover:bg-emerald-500 text-white font-extrabold transition-all text-xs flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/20"
              title="Media and Privacy Settings"
            >
              <ShieldCheck className="w-4 h-4" /> Privacy
            </button>
          </div>
        </div>

        {/* Children selector */}
        {children.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-emerald-200 shrink-0 mr-1">Select Child:</span>
            {children.map(c => (
              <button
                key={c._id}
                onClick={() => setSelectedChildId(c._id)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedChildId === c._id
                    ? 'bg-white text-emerald-900 shadow-md font-extrabold'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/10'
                }`}
              >
                <img src={c.photo || 'https://images.unsplash.com/photo-1595454223600-91fb57d42531?w=100'} alt={c.firstName} className="w-5 h-5 rounded-full object-cover" />
                <span>{c.firstName} {c.lastName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && !timelineData ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          Loading daily connection updates...
        </div>
      ) : child && timeline ? (
        <div className="space-y-8">
          {/* Top Section: Multilingual Parent Digest Cards */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-sky-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Heart className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                    {t.parentDigestTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-generated from structured classroom inputs • Verified bilingual alignment
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-400">Viewing Language:</span>
                <span className="font-extrabold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                  {language === 'mr' ? 'मराठी (Marathi)' : language === 'hi' ? 'हिन्दी (Hindi)' : 'English (Original)'}
                </span>
              </div>
            </div>

            {/* Active Language Digest */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-3">
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {currentDigest}
              </p>

              {/* Translation disclaimer if viewing MR or HI */}
              {language !== 'en' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCheck className="w-3.5 h-3.5" /> High-fidelity early childhood translation
                  </span>
                  <span>Preserving teacher's original pedagogical message</span>
                </div>
              )}
            </div>

            {/* If translated, also show original English message collapsible */}
            {language !== 'en' && (
              <details className="bg-white/60 rounded-2xl p-4 border border-emerald-100 text-xs text-slate-600">
                <summary className="font-bold text-emerald-800 cursor-pointer flex items-center justify-between">
                  <span>View Original English Teacher Message</span>
                  <span className="text-[10px] text-slate-400">Click to expand</span>
                </summary>
                <p className="mt-2 text-slate-700 italic border-l-2 border-emerald-400 pl-3">
                  "{originalEnglishDigest}"
                </p>
              </details>
            )}
          </div>

          {/* Daily Routine Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Mood & Arrival */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                  <Smile className="w-4 h-4" />
                </div>
                <Badge variant="Enrolled">{timeline.mood || 'Joyful'}</Badge>
              </div>
              <h4 className="font-extrabold text-slate-800 font-heading text-sm">
                {t.moodLabel}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {child.firstName} arrived happy and entered circle time with high curiosity.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Lead Teacher: <strong>{timeline.teacherName}</strong>
              </div>
            </div>

            {/* 2. Meals & Hydration */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                  <Coffee className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {timeline.meals?.hydration || 'Good Intake'}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-800 font-heading text-sm">
                {t.mealsLabel}
              </h4>
              <div className="text-xs text-slate-600 space-y-1.5">
                <p>• <strong>Snack:</strong> {timeline.meals?.morningSnack}</p>
                <p>• <strong>Lunch:</strong> {timeline.meals?.lunch}</p>
                <p>• <strong>Afternoon:</strong> {timeline.meals?.afternoonSnack}</p>
              </div>
            </div>

            {/* 3. Nap & Rest */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {timeline.nap?.durationMinutes} Mins ({timeline.nap?.quality})
                </span>
              </div>
              <h4 className="font-extrabold text-slate-800 font-heading text-sm">
                {t.napLabel}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fell asleep gently after soft storytime music. Awoke refreshed and ready for afternoon sensory stations.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Quality: <strong>{timeline.nap?.quality}</strong>
              </div>
            </div>
          </div>

          {/* Activities & Photos with Privacy Guard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activities Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> {t.activitiesLabel}
              </h4>
              <div className="space-y-3">
                {(timeline.activities || []).map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 font-heading">{act.title}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved Photos with Consent Badge */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                  <Camera className="w-4 h-4 text-pink-600" /> {t.photosLabel}
                </h4>
                {privacySettings.allowPhotos ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Guardian Consent Granted
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    ✕ Photo Sharing Withheld
                  </span>
                )}
              </div>

              {privacySettings.allowPhotos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(timeline.photos || []).map((photo, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                      <img
                        src={photo.url}
                        alt="Classroom activity"
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/75 to-transparent text-white text-[11px] font-medium">
                        {photo.caption}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 space-y-2">
                  <Lock className="w-6 h-6 text-slate-400 mx-auto" />
                  <p>Photo sharing is turned off in family privacy settings for this child.</p>
                </div>
              )}
            </div>
          </div>

          {/* Screen-Free Home Activity Recommendations */}
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white">
                <Home className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 font-heading">
                  {t.homeActivitiesTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  Gentle, no-screen ideas recommended by teachers to extend today's classroom curiosity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(timeline.homeActivityRecommendations || []).map((act, i) => (
                <div key={i} className="bg-white rounded-2xl p-4.5 border border-amber-100 shadow-xs space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {act.domain}
                  </span>
                  <h5 className="font-extrabold text-slate-800 text-xs font-heading">
                    {act.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Parent Feedback & Appreciation Feed */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h4 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" /> {t.feedbackTitle}
            </h4>

            {/* Existing feedback messages */}
            <div className="space-y-3">
              {(timeline.parentFeedback || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes shared yet today.</p>
              ) : (
                timeline.parentFeedback.map((fb, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3 text-xs">
                    <span className="text-xl">{fb.reaction || '❤️'}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-purple-900">{fb.parentName}</strong>
                        <span className="text-[10px] text-slate-400">{new Date(fb.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-700">{fb.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Parent Feedback Form */}
            <form onSubmit={handleSubmitFeedback} className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                {['❤️', '⭐', '👏', '🌸', '✨'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedReaction(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      selectedReaction === emoji ? 'bg-purple-100 scale-110 shadow-xs' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.feedbackPlaceholder}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" /> {t.sendFeedback}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400">
          No daily records found. Teachers can log today's routine using the button above.
        </div>
      )}

      {/* MODAL: Log Daily Update (Teacher) */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Daily Child Routine Update"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveDailyLog} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Child's Mood</label>
            <select
              value={logForm.mood}
              onChange={(e) => setLogForm({ ...logForm, mood: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
            >
              <option value="Joyful">Joyful & Radiant</option>
              <option value="Curious">Curious & Inquisitive</option>
              <option value="Calm">Calm & Focused</option>
              <option value="Energetic">Energetic</option>
              <option value="Tired">Tired</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Morning Snack</label>
              <input
                type="text"
                value={logForm.morningSnack}
                onChange={(e) => setLogForm({ ...logForm, morningSnack: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lunch Intake</label>
              <input
                type="text"
                value={logForm.lunch}
                onChange={(e) => setLogForm({ ...logForm, lunch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nap Duration (Minutes)</label>
              <input
                type="number"
                value={logForm.napMinutes}
                onChange={(e) => setLogForm({ ...logForm, napMinutes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nap Quality</label>
              <select
                value={logForm.napQuality}
                onChange={(e) => setLogForm({ ...logForm, napQuality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="Restful">Restful</option>
                <option value="Light">Light</option>
                <option value="Did not nap">Did not nap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Teacher's Warm Personal Note</label>
            <textarea
              rows={2}
              placeholder="e.g. Mia proudly shared her leaf painting and helped tidy up the blocks!"
              value={logForm.teacherNotes}
              onChange={(e) => setLogForm({ ...logForm, teacherNotes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            ✨ KinderConnect will automatically compose warm parent digests in <strong>English, Marathi, and Hindi</strong> from this structured input.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowLogModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
            >
              Save & Generate Multilingual Digest
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Privacy & Media Consent */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Family Privacy & Media Permissions"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            KinderHub respects each family's digital privacy. Configure how child media and developmental milestones are shared.
          </p>

          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-extrabold text-slate-800">Classroom Photo Sharing</p>
                <p className="text-[10px] text-slate-500">Allow approved activity photos to be visible in family timeline</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.allowPhotos}
                onChange={(e) => handleUpdatePrivacy('allowPhotos', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200">
              <div>
                <p className="font-extrabold text-slate-800">Observation Sharing</p>
                <p className="text-[10px] text-slate-500">Include classroom developmental notes in weekly parent reports</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.allowObservationSharing}
                onChange={(e) => handleUpdatePrivacy('allowObservationSharing', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200">
              <div>
                <p className="font-extrabold text-slate-800">Data Retention Consent</p>
                <p className="text-[10px] text-slate-500">Retain child portfolio across academic terms</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.retentionConsentGranted}
                onChange={(e) => handleUpdatePrivacy('retentionConsentGranted', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
