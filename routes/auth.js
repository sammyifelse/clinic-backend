import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth, doctorAuth } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Register a new user (Patients can register without login)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role === 'doctor' && !password) {
      return res.status(400).json({ message: 'Password is required for doctors' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful', user: { id: newUser._id, name, email, role } });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login for doctors only
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.role === 'patient') {
      return res.status(401).json({ message: 'Access restricted to doctors' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get authenticated user info (Doctors only)
router.get('/user', auth, doctorAuth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('User Fetch Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
