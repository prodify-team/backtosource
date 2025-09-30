const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['owner', 'manager', 'chef', 'waiter', 'cleaner'],
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  preferredLanguage: {
    type: String,
    enum: ['hindi', 'english'],
    default: 'hindi'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  trainingProgress: {
    completedModules: [String],
    currentModule: String,
    score: {
      type: Number,
      default: 0
    }
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badges: [String]
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);