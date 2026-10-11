import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  dayOfWeek: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 
    required: true 
  },
  periods: [{
    startTime: { type: String, required: true }, // e.g. "09:00 AM"
    endTime: { type: String, required: true },   // e.g. "09:45 AM"
    subject: { type: String, required: true },   // e.g. "Circle Time & Phonics"
    teacherName: { type: String, default: 'Class Teacher' },
    room: { type: String, default: 'Activity Room' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);
