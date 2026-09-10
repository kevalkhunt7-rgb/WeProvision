require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const { seedServices } = require('./seedServices');

const run = async () => {
  try {
    const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/weprovision';
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(dbUrl);
    console.log('🍃 MongoDB Connected!');

    console.log('Seeding services to MongoDB database...');
    await seedServices();

    const services = await Service.find().sort({ createdAt: 1 });
    console.log(`\n🎉 Successfully stored ${services.length} services in MongoDB database:`);
    services.forEach((s, idx) => {
      console.log(`${idx + 1}. [${s.id}] ${s.title} (${s.category}) - Projects: ${s.projectsCount}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error executing seed:', err);
    process.exit(1);
  }
};

run();
