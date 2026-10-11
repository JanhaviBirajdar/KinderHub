import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  receiptNo: { type: String, required: true, unique: true }, // e.g. REC-2026-001
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Online Demo', 'Card'], 
    default: 'Cash' 
  },
  transactionRef: { type: String, default: '' },
  recordedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recordedByName: { type: String, default: 'Admin' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
