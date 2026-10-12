import mongoose from 'mongoose';

const aiActivitySuggestionSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  domain: { 
    type: String, 
    enum: ['language', 'cognitive', 'creativity', 'motorSkills', 'socialEmotional'],
    required: true 
  },
  suggestedTitle: { type: String, required: true },
  description: { type: String, required: true },
  rationale: { type: String, required: true }, // Clearly explains the observation trigger
  materials: { type: String, default: 'Standard preschool classroom items' },
  ageGroup: { type: String, default: '3 – 4 Years' },
  status: { 
    type: String, 
    enum: ['pending_review', 'approved', 'modified', 'rejected'], 
    default: 'pending_review' 
  },
  teacherNotes: { type: String, default: '' },
  approvedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedByName: { type: String, default: '' },
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AiActivitySuggestion || mongoose.model('AiActivitySuggestion', aiActivitySuggestionSchema);
