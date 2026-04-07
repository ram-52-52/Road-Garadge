const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const JobTracking = require('../models/JobTracking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Garage = require('../models/Garage');

const cleanup = async () => {
  try {
    console.log('--- STRATEGIC DATABASE SANITIZATION INITIATED ---');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Handshake established with MongoDB Cluster.');

    // 1. Purge Supplemental Collections
    console.log('Purging Jobs, Trackings, Payments, Reviews, and Garages...');
    await Job.deleteMany({});
    await JobTracking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await Garage.deleteMany({});

    // 2. Tactical User Filtering
    console.log('Sanitizing User Identities...');
    // We keep ONLY the Master Admin (9999999999)
    const result = await User.deleteMany({ phone: { $ne: '9999999999' } });
    console.log(`Decommissioned ${result.deletedCount} non-essential identities.`);

    // 3. Verify Admin Persistence
    const admin = await User.findOne({ phone: '9999999999' });
    if (admin) {
      console.log('Master Admin Identity (9999999999) remains active.');
    } else {
      console.warn('WARNING: Master Admin identity not found. Creating default admin...');
      await User.create({
        phone: '9999999999',
        name: 'Supreme Commander',
        role: 'ADMIN',
        is_verified: true,
        onboarding_complete: true
      });
      console.log('Default Admin Identity established.');
    }

    console.log('--- SANITIZATION COMPLETE. SYSTEM READY FOR CLEAN DEPLOYMENT. ---');
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL FAILURE DURING SANITIZATION:', error);
    process.exit(1);
  }
};

cleanup();
