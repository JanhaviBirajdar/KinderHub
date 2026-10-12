import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  domain: { 
    type: String, 
    enum: ['language', 'cognitive', 'creativity', 'motorSkills', 'socialEmotional'],
    required: true 
  },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', default: null },
  activityTitle: { type: String, default: '' },
  observedByRole: { type: String, enum: ['teacher', 'parent', 'admin'], default: 'teacher' },
  observedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  observedByName: { type: String, required: true },
  score: { type: Number, min: 1, max: 5, default: 3 }, // 1: Emerging, 2: Developing, 3: Competent, 4: Proficient, 5: Mastered
  milestoneTitle: { type: String, required: true },
  notes: { type: String, required: true },
  context: { type: String, enum: ['classroom', 'home', 'playground', 'art_center', 'story_circle'], default: 'classroom' },
  photo: { type: String, default: '' },
  parentApproved: { type: Boolean, default: true },
  isHomeObservation: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Observation || mongoose.model('Observation', observationSchema);
