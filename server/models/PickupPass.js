import mongoose from 'mongoose';

const pickupPassSchema = new mongoose.Schema({
  passCode: { type: String, required: true, unique: true }, // e.g. PASS-2026-901
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianRelation: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  guardianPhoto: { type: String, default: '' },
  otp: { type: String, required: true }, // 6-digit one time pickup code
  qrData: { type: String, required: true },
  validFrom: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'verified_completed', 'expired', 'cancelled'], 
    default: 'active' 
  },
  verifiedAt: { type: Date },
  verifiedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedByName: { type: String },
  handoverNotes: { type: String, default: '' },
  auditLog: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    performedByName: { type: String, required: true },
    details: { type: String, default: '' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.PickupPass || mongoose.model('PickupPass', pickupPassSchema);
