import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'school_admin', 'teacher', 'parent'], 
    default: 'parent' 
  },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
  childrenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
