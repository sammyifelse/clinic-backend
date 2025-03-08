import express from 'express';
import Attendance from '../models/attendance.js';
import { authenticateDoctor } from '../middleware/authMiddleware.js'; // Ensure only doctors can access

const router = express.Router();

// Get attendance records
router.get('/', authenticateDoctor, async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
});

// Add new attendance record
router.post('/', authenticateDoctor, async (req, res) => {
  try {
    const { fullName, firstVisit, caseOf, remedy, paymentMethod } = req.body;

    const newRecord = new Attendance({
      fullName,
      firstVisit,
      caseOf,
      remedy,
      paymentMethod,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Error adding attendance record" });
  }
});

export default router;
