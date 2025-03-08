import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  firstVisit: { type: Date, required: true },
  caseOf: { type: String, required: true },
  remedy: { type: String, required: true },
  paymentMethod: { type: String, enum: ["Cash", "UPI"], required: true }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
