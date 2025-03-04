import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age:  {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  medicalHistory: {
    type: String,
    trim: true
  },
  currentMedications: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    trim: true
  },
  disease: { type: String, trim: true },
  symptoms: { type: String, trim: true },
  diagnosis: { type: String, trim: true },
  chiefComplaint: {
    type: String,
    required: true,
    trim: true
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;