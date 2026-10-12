import mongoose from 'mongoose';

const questJourneySchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  chapters: [{
    chapterId: { type: String, required: true },
    title: { type: String, required: true },
    theme: { type: String, default: 'Wonder Garden' },
    icon: { type: String, default: 'Sprout' },
    unlocked: { type: Boolean, default: false },
    completedActivitiesCount: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 3 },
    activities: [{
      activityId: { type: String, required: true },
      title: { type: String, required: true },
      type: { type: String, enum: ['matching', 'sorting', 'counting', 'storytelling', 'creativity'], required: true },
      instructions: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      offlineExtension: { type: String, required: true }
    }],
    badge: {
      name: { type: String, required: true },
      icon: { type: String, required: true },
      unlocked: { type: Boolean, default: false }
    }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.QuestJourney || mongoose.model('QuestJourney', questJourneySchema);
