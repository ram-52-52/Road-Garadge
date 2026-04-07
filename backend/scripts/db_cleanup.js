const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const Garage = require('../models/Garage');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const JobTracking = require('../models/JobTracking');

const cleanup = async () => {
  try {
    console.log('Connecting to MongoDB for strategic cleanup...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined in .env');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Handshake established.');

    const MASTER_ADMIN = '9999999999';

    console.log('Purging Jobs & Heartbeats...');
    await Job.deleteMany({});
    await JobTracking.deleteMany({});
    
    console.log('Purging Reviews & Payments...');
    await Review.deleteMany({});
    await Payment.deleteMany({});

    console.log('Purging Garages...');
    await Garage.deleteMany({});

    console.log('Purging Users (Retaining Strategic Administrator)...');
    const deleteResult = await User.deleteMany({ phone: { $ne: MASTER_ADMIN } });
    console.log(`Successfully liquidated ${deleteResult.deletedCount} identities.`);

    let admin = await User.findOne({ phone: MASTER_ADMIN });
    if (!admin) {
      console.log('Master Admin missing. Initializing Supreme Commander...');
      await User.create({
        phone: MASTER_ADMIN,
        name: 'Supreme Commander',
        role: 'ADMIN',
        is_verified: true,
        onboarding_complete: true
      });
    }

    console.log('Database Sanitization Protocol: SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('Purge Failure:', err);
    process.exit(1);
  }
};

cleanup();
