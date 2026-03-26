const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    photo: { type: String, default: '' },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer not to say'] },

    // Flatmate preferences
    profile: {
      budget: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 50000 },
      },
      location: { type: String, default: '' },
      sleepSchedule: {
        type: String,
        enum: ['early_bird', 'night_owl', 'flexible'],
        default: 'flexible',
      },
      cleanliness: {
        type: Number, // 1-5 scale
        min: 1,
        max: 5,
        default: 3,
      },
      foodHabits: {
        type: String,
        enum: ['veg', 'non-veg', 'vegan', 'no_preference'],
        default: 'no_preference',
      },
      guestsPreference: {
        type: String,
        enum: ['often', 'occasionally', 'rarely', 'never'],
        default: 'occasionally',
      },
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      workSchedule: {
        type: String,
        enum: ['work_from_home', 'office', 'hybrid', 'student'],
        default: 'office',
      },
      aboutMe: { type: String, default: '', maxlength: 500 },
    },

    // AI-extracted personality traits (set by backend after AI analysis)
    personalityTraits: {
      type: [String],
      default: [],
    },

    isProfileComplete: { type: Boolean, default: false },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
