const Job = require('../models/Job');
const { readDb } = require('../config/db');

const initialJobsData = [
  {
    id: 'graphics-designer',
    title: 'Graphics Designer',
    department: 'Design',
    location: 'Surat',
    type: 'Full-time',
    experience: '1-2 years',
    salary: 'Competitive',
    status: 'Open',
    applicantsCount: 0,
    description: 'Creative designer needed to craft beautiful and intuitive user interfaces.'
  },
  {
    id: 'digital-marketing-manager',
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: '4-6 years',
    salary: 'Competitive',
    status: 'Open',
    applicantsCount: 0,
    description: 'Lead our digital marketing initiatives and grow our online presence.'
  },
  {
    id: 'game-developer-unity',
    title: 'Game Developer (Unity)',
    department: 'Engineering',
    location: 'Surat',
    type: 'Full-time',
    experience: '1 year',
    salary: 'Competitive',
    status: 'Open',
    applicantsCount: 0,
    description: 'Create immersive gaming experiences using Unity and C#.'
  }
];

const seedJobs = async () => {
  try {
    if (!Job.db || Job.db.readyState !== 1) {
      return false;
    }

    const count = await Job.countDocuments();
    if (count > 0) {
      return true;
    }

    const localDb = readDb();
    const jobsToSeed = (localDb.jobs && localDb.jobs.length > 0)
      ? localDb.jobs
      : initialJobsData;

    for (const job of jobsToSeed) {
      await Job.findOneAndUpdate(
        { id: job.id },
        {
          id: job.id,
          title: job.title,
          department: job.department,
          location: job.location || 'Remote',
          type: job.type || 'Full-time',
          experience: job.experience || '1-3 Years',
          salary: job.salary || 'Competitive',
          status: job.status || 'Open',
          applicantsCount: job.applicantsCount || 0,
          description: job.description || ''
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }

    console.log(`✅ Successfully seeded ${jobsToSeed.length} jobs into MongoDB database.`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding jobs to MongoDB:', error.message);
    return false;
  }
};

module.exports = {
  initialJobsData,
  seedJobs
};
