const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String
  },
  settings: {
    workingHours: {
      open: String,
      close: String
    },
    languages: {
      type: [String],
      default: ['hindi', 'english']
    }
  },
  sops: [{
    title: String,
    description: String,
    steps: [String],
    category: {
      type: String,
      enum: ['cooking', 'service', 'cleaning', 'safety']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  menu: [{
    name: String,
    nameHindi: String,
    category: String,
    price: Number,
    ingredients: [String],
    cookingTime: Number,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);