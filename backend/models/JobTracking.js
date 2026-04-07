const mongoose = require('mongoose');

const jobTrackingSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
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
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We use our own timestamp
});

// Index for spatial queries
jobTrackingSchema.index({ location: '2dsphere' });
jobTrackingSchema.index({ job_id: 1, timestamp: -1 });

module.exports = mongoose.model('JobTracking', jobTrackingSchema);
