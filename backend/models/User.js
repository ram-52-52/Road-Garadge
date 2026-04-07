const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false // Optional during initial OTP phase
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    set: function(v) { return v.replace(/\D/g, '').slice(-10); } // Normalize to last 10 digits
  },
  password: {
    type: String,
    required: false, // OTP bypasses standard passwords
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['DRIVER', 'GARAGE_OWNER', 'ADMIN', null],
    default: null
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
    address: { type: String, default: 'Address Not Configured' }
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  onboarding_complete: {
    type: Boolean,
    default: false
  },
  refresh_token: {
    type: String,
    default: null
  },
  fcm_token: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving — ONLY if password exists and was modified
userSchema.pre('save', async function () {
  const user = this;
  if (!user.isModified('password') || !user.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Compare password instance method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
