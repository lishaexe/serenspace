import express from 'express'
import mongoose from 'mongoose'
import protect from '../middleware/auth.js'

const router = express.Router()

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  habits: { type: Object, default: {} },
}, { timestamps: true })

const Habit = mongoose.model('Habit', habitSchema)

// GET today's habits
router.get('/', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10)
    let habit = await Habit.findOne({ userId: req.user._id, date: today })
    if (!habit) habit = { habits: {} }
    res.json(habit)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST update habits
router.post('/', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const { habits } = req.body
    const habit = await Habit.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { habits },
      { upsert: true, new: true }
    )
    res.json(habit)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET habit history
router.get('/history', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({ date: -1 }).limit(30)
    res.json(habits)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router