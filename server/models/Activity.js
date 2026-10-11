import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Sensory & Play', 'Arts & Craft', 'Phonics & Language', 'Gross Motor', 'STEM & Math', 'Music & Movement'], 
    default: 'Sensory & Play' 
  },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  learningObjectives: [{ type: String }],
  materialsNeeded: { type: String, default: '' },
  teacherNotes: { type: String, default: '' },
  photos: [{ type: String }],
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByName: { type: String, default: 'Teacher' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
