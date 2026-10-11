import mongoose from 'mongoose';

const progressRecordSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  term: { type: String, default: 'Term 1 (Autumn 2026)' },
  evaluationDate: { type: Date, default: Date.now },
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evaluatorName: { type: String, default: 'Class Teacher' },
  domains: {
    language: {
      score: { type: Number, min: 1, max: 5, default: 4 }, // 1: Beginning, 5: Mastered
      observation: { type: String, default: 'Speaks clearly in full sentences and loves rhyme recitation.' }
    },
    motorSkills: {
      score: { type: Number, min: 1, max: 5, default: 4 },
      observation: { type: String, default: 'Great fine motor grip on crayons and safe scissors.' }
    },
    creativity: {
      score: { type: Number, min: 1, max: 5, default: 5 },
      observation: { type: String, default: 'Enjoys finger painting and building imaginative block castles.' }
    },
    socialSkills: {
      score: { type: Number, min: 1, max: 5, default: 4 },
      observation: { type: String, default: 'Shares toys willingly during group play and shows empathy.' }
    },
    cognitive: {
      score: { type: Number, min: 1, max: 5, default: 4 },
      observation: { type: String, default: 'Recognizes primary colors, shapes, and counts up to 20.' }
    }
  },
  generalNotes: { type: String, default: 'A joyful and curious learner who participates actively.' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ProgressRecord || mongoose.model('ProgressRecord', progressRecordSchema);
