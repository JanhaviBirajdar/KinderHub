import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD format
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  records: [{
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Leave'], default: 'Present' },
    remarks: { type: String, default: '' },
    checkInTime: { type: String, default: '09:00 AM' }
  }],
  markedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  markedByName: { type: String, default: 'Staff' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure only one attendance sheet per class per day
attendanceSchema.index({ date: 1, classId: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
