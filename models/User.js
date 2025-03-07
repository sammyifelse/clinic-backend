import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.role !== 'patient'; } }, // Password required only for non-patients
  role: { type: String, enum: ['doctor', 'receptionist', 'patient'], required: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
