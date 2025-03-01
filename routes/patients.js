import express from 'express';
import Joi from 'joi';
import Patient from '../models/Patient.js';
import { auth, doctorAuth } from '../middleware/auth.js';

const router = express.Router();

// Define Joi Schema for Validation
const patientSchema = Joi.object({
  fullName: Joi.string().required(),
  age: Joi.number().integer().min(0).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  medicalHistory: Joi.string().optional(),
  currentMedications: Joi.string().optional(),
  allergies: Joi.string().optional(),
  chiefComplaint: Joi.string().required(),
});

// Get all patients (doctors see all, others see their own)
router.get('/', auth, async (req, res) => {
  try {
    let patients;

    if (req.user.role === 'doctor') {
      patients = await Patient.find().sort({ createdAt: -1 });
    } else {
      patients = await Patient.find({ registeredBy: req.user._id }).sort({ createdAt: -1 });
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific patient
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.user.role !== 'doctor' && patient.registeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this patient' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register a new patient
router.post('/', auth, async (req, res) => {
  console.log("📥 Incoming request data:", req.body); // Debugging log

  try {
    const {
      fullName,
      age,
      phone,
      address,
      medicalHistory,
      currentMedications,
      allergies,
      chiefComplaint
    } = req.body;

    if (!fullName || !age || !phone || !address || !chiefComplaint) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const patient = new Patient({
      fullName,
      age,
      phone,
      address,
      medicalHistory,
      currentMedications,
      allergies,
      chiefComplaint,
      registeredBy: req.user._id
    });

    await patient.save();
    console.log("✅ Patient saved successfully:", patient);
    
    res.status(201).json(patient);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Update patient details (doctors only)
router.put('/:id', auth, doctorAuth, async (req, res) => {
  const { error } = patientSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Validation error', error: error.details });
  }

  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete patient (doctors only)
router.delete('/:id', auth, doctorAuth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
