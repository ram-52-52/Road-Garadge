const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  garage_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage'
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  service_type: {
    type: String,
    required: [true, 'Please specify the service type']
  },
  description: {
    type: String
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
  amount: {
    type: Number,
    default: 0
  },
  razorpay_order_id: {
    type: String
  },
  razorpay_payment_id: {
    type: String
  },
  razorpay_signature: {
    type: String
  }
}, {
  timestamps: true
});

// Index for driver location queries
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);
