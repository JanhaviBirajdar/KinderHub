import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetAudience: { 
    type: String, 
    enum: ['All', 'Parents', 'Teachers', 'Playgroup', 'Nursery', 'Junior KG', 'Senior KG'], 
    default: 'All' 
  },
  priority: { 
    type: String, 
    enum: ['Normal', 'Important', 'Urgent'], 
    default: 'Normal' 
  },
  authorName: { type: String, default: 'School Administration' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
