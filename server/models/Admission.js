import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  applicationNo: { type: String, required: true, unique: true },
  childFirstName: { type: String, required: true },
  childLastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Female' },
  preferredClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  address: { type: String, default: '' },
  medicalNotes: { type: String, default: '' },
  documents: [{ name: String, url: String }],
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  adminNotes: { type: String, default: '' },
  convertedChildId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Admission || mongoose.model('Admission', admissionSchema);
