const express = require('express');
const Message = require('../models/Message');
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/:matchId — fetch messages for a match
router.get('/:matchId', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const isParticipant = match.users.some(
      (u) => u.toString() === req.user._id.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: 'Forbidden' });

    const messages = await Message.find({ matchId: req.params.matchId })
      .populate('sender', 'name photo')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { matchId: req.params.matchId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/chat/:matchId — send a message (also saves to DB)
router.post('/:matchId', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message cannot be empty' });

    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const isParticipant = match.users.some(
      (u) => u.toString() === req.user._id.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: 'Forbidden' });

    const message = await Message.create({
      matchId: req.params.matchId,
      sender: req.user._id,
      content,
    });

    const populated = await message.populate('sender', 'name photo');

    // Emit via socket
    const io = req.app.get('io');
    io.to(req.params.matchId).emit('receive_message', populated);

    res.status(201).json({ message: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
