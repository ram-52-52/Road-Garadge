const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide the garage name']
  },
  address: {
    type: String,
    required: [true, 'Please provide the address']
  },
  is_available: {
    type: Boolean,
    default: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  total_jobs: {
    type: Number,
    default: 0
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: { 
      type: String, 
      required: true 
    }
  },
  services: [
    {
      service_type: { type: String, required: true },
      price_estimate: { type: Number, required: true }
    }
  ]
}, {
  timestamps: true
});

// Index to handle spatial queries
garageSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Garage', garageSchema);
