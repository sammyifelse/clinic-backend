// CLINIC-BACKEND/routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const auth = require('../middleware/auth');

// Get all attendance records for a doctor
router.get('/', auth, async (req, res) => {
  try {
    const attendances = await Attendance.find({ doctorId: req.user.id }).sort({ date: -1 });
    res.json(attendances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new attendance record
router.post('/', auth, async (req, res) => {
  const { date, patientName, patientId, caseDetails, remedy, paymentMethod } = req.body;

  try {
    const newAttendance = new Attendance({
      date,
      patientName,
      patientId,
      caseDetails,
      remedy,
      paymentMethod,
      doctorId: req.user.id
    });

    const attendance = await newAttendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;