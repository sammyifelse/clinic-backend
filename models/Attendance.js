// CLINIC-BACKEND/models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientId: {
    type: Number,
    required: true
  },
  caseDetails: {
    type: String,
    required: true
  },
  remedy: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi'],
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);