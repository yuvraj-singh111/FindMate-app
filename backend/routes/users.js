const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/discover — get users to swipe on
router.get('/discover', protect, async (req, res) => {
  try {
    const currentUser = req.user;

    // Exclude self, already liked/disliked users
    const excludeIds = [
      currentUser._id,
      ...currentUser.likes,
      ...currentUser.dislikes,
    ];

    const users = await User.find({
      _id: { $nin: excludeIds },
      isProfileComplete: true,
    })
      .select('-password -likes -dislikes')
      .limit(20);

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile — update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profile: updates.profile, isProfileComplete: true } },
      { new: true, runValidators: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id — get single user profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -likes -dislikes'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
