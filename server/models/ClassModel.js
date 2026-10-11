import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Playgroup, Nursery, Junior KG, Senior KG
  section: { type: String, default: 'A' },
  academicYear: { type: String, default: '2026-2027' },
  capacity: { type: Number, default: 20 },
  roomNumber: { type: String, default: 'Room 101' },
  classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  colorBadge: { type: String, default: 'purple' },
  ageGroup: { type: String, default: '2 - 3 Years' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Class || mongoose.model('Class', classSchema);
