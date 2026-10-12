import mongoose from 'mongoose';

const safetyIncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true }, // e.g. INC-2026-001
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  className: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM AM/PM
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  category: { 
    type: String, 
    enum: ['Minor Scrape/Fall', 'Allergy Exposure', 'Behavioral Disruption', 'Illness/Fever', 'Playground Bump', 'Other'],
    default: 'Minor Scrape/Fall'
  },
  location: { type: String, default: 'Classroom' },
  description: { type: String, required: true },
  actionsTaken: { type: String, required: true },
  firstAidAdministered: { type: Boolean, default: false },
  parentContacted: { type: Boolean, default: false },
  parentContactTime: { type: String, default: '' },
  followUpStatus: { type: String, enum: ['Open', 'Under Review', 'Resolved'], default: 'Resolved' },
  followUpNotes: { type: String, default: '' },
  reportedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedByName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SafetyIncident || mongoose.model('SafetyIncident', safetyIncidentSchema);
