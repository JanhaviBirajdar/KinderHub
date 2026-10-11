import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  childId: { type: String, required: true, unique: true }, // e.g. KH-2026-001
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Female' },
  bloodGroup: { type: String, default: 'O+' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: String, default: 'A' },
  admissionDate: { type: Date, default: Date.now },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, default: 'Mother' }
  },
  allergies: [{ type: String }],
  medicalNotes: { type: String, default: 'None' },
  authorizedPickups: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true }
  }],
  photo: { type: String, default: '' },
  status: { type: String, enum: ['Enrolled', 'Graduated', 'Archived'], default: 'Enrolled' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Child || mongoose.model('Child', childSchema);
