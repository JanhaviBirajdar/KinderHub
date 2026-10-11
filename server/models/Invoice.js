import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true }, // e.g. INV-2026-001
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Term Tuition Fee' },
  monthYear: { type: String, required: true }, // e.g. "October 2026"
  dueDate: { type: Date, required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Paid', 'Partial', 'Unpaid', 'Overdue'], 
    default: 'Unpaid' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
