import express from 'express';
import Patient from '../models/Patient.js';
import { auth, doctorAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all patients (doctors only)
router.get('/', auth, doctorAuth, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new patient
router.post('/', auth, async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phone,
      address,
      medicalHistory,
      currentMedications,
      allergies,
      disease,
      symptoms,
      diagnosis,
      chiefComplaint
    } = req.body;

    // Create new patient
    const patient = new Patient({
      fullName,
      age,
      gender,
      phone,
      address,
      medicalHistory,
      currentMedications,
      allergies,
      disease,
      symptoms,
      diagnosis,
      chiefComplaint,
      registeredBy: req.user._id // Add the user who registered the patient
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient
router.put('/:id', auth, doctorAuth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete patient
router.delete('/:id', auth, doctorAuth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;