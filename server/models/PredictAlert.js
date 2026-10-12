import mongoose from 'mongoose';

const predictAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true }, // ALT-2026-001
  type: { 
    type: String, 
    enum: ['absence', 'fee_overdue', 'class_capacity', 'admission_followup'], 
    required: true 
  },
  severity: { type: String, enum: ['Critical', 'Warning', 'Info'], default: 'Warning' },
  title: { type: String, required: true },
  triggerExplanation: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  targetEntityId: { type: String, required: true },
  targetEntityName: { type: String, required: true },
  dataMetrics: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  reviewedByName: { type: String },
  reviewedAt: { type: Date },
  actionRemarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.PredictAlert || mongoose.model('PredictAlert', predictAlertSchema);
