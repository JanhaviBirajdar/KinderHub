import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  academicYear: { type: String, default: '2026-2027' },
  title: { type: String, default: 'Standard Term Fee' },
  admissionFee: { type: Number, default: 250 },
  tuitionFee: { type: Number, default: 1200 },
  activityFee: { type: Number, default: 200 },
  transportFee: { type: Number, default: 150 },
  mealFee: { type: Number, default: 100 },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FeeStructure || mongoose.model('FeeStructure', feeStructureSchema);
