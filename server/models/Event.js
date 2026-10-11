import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  eventType: { 
    type: String, 
    enum: ['Celebration', 'Holiday', 'Sports Day', 'Parent-Teacher Meeting', 'Field Trip', 'Workshop'], 
    default: 'Celebration' 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  targetAudience: { type: String, enum: ['All', 'Parents', 'Teachers'], default: 'All' },
  location: { type: String, default: 'Preschool Campus' },
  colorTag: { type: String, default: 'purple' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
