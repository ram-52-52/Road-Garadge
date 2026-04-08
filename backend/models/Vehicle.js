const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['CAR', 'BIKE', 'TRUCK'],
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  documents: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
