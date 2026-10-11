import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  childName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentName: { type: String, required: true },
  startDate: { type: String, required: true }, // YYYY-MM-DD
  endDate: { type: String, required: true },   // YYYY-MM-DD
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  adminRemarks: { type: String, default: '' },
  reviewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema);
