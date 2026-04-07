const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Garage = require('../models/Garage');

const seedUsers = async () => {
  try {
    console.log('🚀 Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    // Clear existing test users to prevent duplication
    const testPhones = ['9999999999', '8888888888', '7777777777'];
    await User.deleteMany({ phone: { $in: testPhones } });
    console.log('🧹 Cleaned existing test accounts.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassAdmin = await bcrypt.hash('admin123', salt);
    const hashedPassMech = await bcrypt.hash('mech123', salt);
    const hashedPassUser = await bcrypt.hash('user123', salt);

    const users = [
      {
        name: 'Super Admin',
        phone: '9999999999',
        password: hashedPassAdmin,
        role: 'ADMIN'
      },
      {
        name: 'Racer Garage Owner',
        phone: '8888888888',
        password: hashedPassMech,
        role: 'GARAGE_OWNER'
      },
      {
        name: 'Regular Driver',
        phone: '7777777777',
        password: hashedPassUser,
        role: 'DRIVER'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created 3 Test Accounts (Admin, Mechanic, Driver).');

    // Create a garage profile for the mechanic
    const mechanicId = createdUsers.find(u => u.phone === '8888888888')._id;
    await Garage.deleteMany({ owner_id: mechanicId });
    
    await Garage.create({
      name: 'Elite Racer Hub',
      address: 'Ahmedabad Sector 12, MG Road',
      owner_id: mechanicId,
      location: {
        type: 'Point',
        coordinates: [72.5714, 23.0225] // Ahmedabad
      },
      is_verified: true,
      is_available: true
    });
    console.log('🔧 Created Garage Profile for Mechanic.');

    console.log('\n--- 🔑 TEST CREDENTIALS ---');
    console.log('ADMIN: +91 99999 99999 | Pass: admin123');
    console.log('MECH:  +91 88888 88888 | Pass: mech123');
    console.log('USER:  +91 77777 77777 | Pass: user123');
    console.log('---------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedUsers();
