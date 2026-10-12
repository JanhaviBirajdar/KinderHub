import mongoose from 'mongoose';

const dailyTimelineLogSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teacherName: { type: String, default: 'Class Teacher' },
  mood: { 
    type: String, 
    enum: ['Joyful', 'Curious', 'Calm', 'Energetic', 'Tired', 'Fussy'], 
    default: 'Joyful' 
  },
  meals: {
    morningSnack: { type: String, default: 'Ate all organic fruit slices' },
    lunch: { type: String, default: 'Finished warm vegetable stew and rice' },
    afternoonSnack: { type: String, default: 'Milk & whole grain biscuit' },
    hydration: { type: String, default: 'Good water intake (4 cups)' }
  },
  nap: {
    durationMinutes: { type: Number, default: 45 },
    quality: { type: String, enum: ['Restful', 'Light', 'Did not nap'], default: 'Restful' }
  },
  activities: [{
    time: { type: String, default: '10:00 AM' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Sensory Play' }
  }],
  photos: [{
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    approvedForParents: { type: Boolean, default: true }
  }],
  structuredNotes: { type: String, default: '' },
  parentFriendlyDigest: {
    en: { type: String, default: '' },
    mr: { type: String, default: '' }, // Marathi
    hi: { type: String, default: '' }  // Hindi
  },
  homeActivityRecommendations: [{
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    domain: { type: String, default: 'Language' }
  }],
  parentFeedback: [{
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentName: { type: String, required: true },
    message: { type: String, required: true },
    reaction: { type: String, default: '❤️' },
    createdAt: { type: Date, default: Date.now }
  }],
  readByParents: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  privacySettings: {
    allowPhotos: { type: Boolean, default: true },
    allowObservationSharing: { type: Boolean, default: true },
    retentionConsentGranted: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DailyTimelineLog || mongoose.model('DailyTimelineLog', dailyTimelineLogSchema);
