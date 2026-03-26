const axios = require('axios');

const calculateCompatibility = async (userA, userB) => {
  try {
    const prompt = `You are an AI flatmate compatibility analyzer. Analyze these two people and determine how compatible they would be as flatmates.

Person A:
- Name: ${userA.name}
- Sleep schedule: ${userA.profile?.sleepSchedule}
- Cleanliness (1-5): ${userA.profile?.cleanliness}
- Food habits: ${userA.profile?.foodHabits}
- Guests preference: ${userA.profile?.guestsPreference}
- Smoking: ${userA.profile?.smoking}
- Pets: ${userA.profile?.pets}
- Work schedule: ${userA.profile?.workSchedule}
- Budget range: ₹${userA.profile?.budget?.min} - ₹${userA.profile?.budget?.max}
- About: ${userA.profile?.aboutMe}

Person B:
- Name: ${userB.name}
- Sleep schedule: ${userB.profile?.sleepSchedule}
- Cleanliness (1-5): ${userB.profile?.cleanliness}
- Food habits: ${userB.profile?.foodHabits}
- Guests preference: ${userB.profile?.guestsPreference}
- Smoking: ${userB.profile?.smoking}
- Pets: ${userB.profile?.pets}
- Work schedule: ${userB.profile?.workSchedule}
- Budget range: ₹${userB.profile?.budget?.min} - ₹${userB.profile?.budget?.max}
- About: ${userB.profile?.aboutMe}

Respond ONLY with valid JSON in this exact format:
{
  "score": <number between 0 and 100>,
  "insights": {
    "similarities": ["<similarity 1>", "<similarity 2>", "<similarity 3>"],
    "conflicts": ["<conflict 1>", "<conflict 2>"],
    "summary": "<2-3 sentence friendly summary of compatibility>"
  }
}`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data.content[0].text;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return {
      score: result.score,
      insights: result.insights,
    };
  } catch (err) {
    console.error('AI compatibility error:', err.message);
    // Fallback: calculate rule-based score
    return fallbackCompatibility(userA, userB);
  }
};

const fallbackCompatibility = (userA, userB) => {
  let score = 50;
  const similarities = [];
  const conflicts = [];

  const a = userA.profile || {};
  const b = userB.profile || {};

  if (a.sleepSchedule === b.sleepSchedule) {
    score += 15;
    similarities.push(`Both are ${a.sleepSchedule?.replace('_', ' ')}s`);
  } else {
    score -= 10;
    conflicts.push('Different sleep schedules may cause friction');
  }

  if (Math.abs((a.cleanliness || 3) - (b.cleanliness || 3)) <= 1) {
    score += 10;
    similarities.push('Similar cleanliness standards');
  } else {
    score -= 15;
    conflicts.push('Very different cleanliness expectations');
  }

  if (a.smoking === b.smoking) {
    score += 5;
    similarities.push('Same preference on smoking');
  } else {
    score -= 20;
    conflicts.push('Conflicting views on smoking');
  }

  if (a.guestsPreference === b.guestsPreference) {
    score += 10;
    similarities.push('Same preference for having guests');
  }

  if (a.foodHabits === b.foodHabits || a.foodHabits === 'no_preference' || b.foodHabits === 'no_preference') {
    score += 5;
    similarities.push('Compatible food habits');
  }

  score = Math.max(10, Math.min(95, score));

  return {
    score,
    insights: {
      similarities,
      conflicts,
      summary: `Compatibility score: ${score}%. Based on your lifestyle preferences, you have ${similarities.length} things in common.`,
    },
  };
};

// AI route for standalone analysis
const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// POST /api/ai/analyze/:targetUserId
router.post('/analyze/:targetUserId', protect, async (req, res) => {
  try {
    const userA = await User.findById(req.user._id);
    const userB = await User.findById(req.params.targetUserId);

    if (!userB) return res.status(404).json({ message: 'User not found' });

    const result = await calculateCompatibility(userA, userB);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
module.exports.calculateCompatibility = calculateCompatibility;
