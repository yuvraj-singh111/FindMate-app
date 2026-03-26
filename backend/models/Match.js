const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    compatibilityScore: { type: Number, default: 0 },
    aiInsights: {
      similarities: [String],
      conflicts: [String],
      summary: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure unique pairs
matchSchema.index({ users: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
