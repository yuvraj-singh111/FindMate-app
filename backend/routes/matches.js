const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');
const { calculateCompatibility } = require('../controllers/aiController');

const router = express.Router();

// POST /api/matches/like/:targetId
router.post('/like/:targetId', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.targetId);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Add to likes
    if (!currentUser.likes.includes(targetUser._id)) {
      currentUser.likes.push(targetUser._id);
      await currentUser.save();
    }

    // Check if mutual match
    const isMutual = targetUser.likes.includes(currentUser._id);

    if (isMutual) {
      // Check if match already exists
      const existingMatch = await Match.findOne({
        users: { $all: [currentUser._id, targetUser._id] },
      });

      if (!existingMatch) {
        // Get AI compatibility score
        const aiResult = await calculateCompatibility(currentUser, targetUser);

        const match = await Match.create({
          users: [currentUser._id, targetUser._id],
          compatibilityScore: aiResult.score,
          aiInsights: aiResult.insights,
        });

        // Notify via socket
        const io = req.app.get('io');
        io.emit(`match_${targetUser._id}`, { match, user: currentUser });

        return res.json({ isMatch: true, match });
      }

      return res.json({ isMatch: true });
    }

    res.json({ isMatch: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/matches/dislike/:targetId
router.post('/dislike/:targetId', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.dislikes.includes(req.params.targetId)) {
      currentUser.dislikes.push(req.params.targetId);
      await currentUser.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/matches — get all matches for current user
router.get('/', protect, async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id })
      .populate('users', 'name photo age profile personalityTraits')
      .sort({ createdAt: -1 });

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/matches/:matchId
router.get('/:matchId', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate(
      'users',
      'name photo age profile personalityTraits'
    );

    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Check user is part of match
    const isParticipant = match.users.some(
      (u) => u._id.toString() === req.user._id.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: 'Forbidden' });

    res.json({ match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
