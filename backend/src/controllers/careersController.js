const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { readDb, writeDb } = require('../config/db');
const { seedJobs } = require('../util/seedJobs');

// Query helpers without Mongoose CastError on _id
const getQuery = (id) => {
  if (!id) return {};
  const conditions = [{ id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }
  return { $or: conditions };
};

// --- JOB POSTINGS ---

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    let jobs = [];

    if (Job.db && Job.db.readyState === 1) {
      jobs = await Job.find().sort({ createdAt: -1 }).lean();
    } else {
      const db = readDb();
      jobs = db.jobs || [];
    }

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message);
    const db = readDb();
    res.json({
      success: true,
      count: db.jobs ? db.jobs.length : 0,
      data: db.jobs || [],
      fallback: true,
    });
  }
};


// Create new job posting
exports.createJob = async (req, res) => {
  try {
    const { title, department, location, type, experience, salary, description, status } = req.body;

    if (!title || !department || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, department, and description are required.',
      });
    }

    const jobId = req.body.id || `job-${Date.now()}`;
    const newJobData = {
      id: jobId,
      title,
      department,
      location: location || 'Remote',
      type: type || 'Full-time',
      experience: experience || '1-3 Years',
      salary: salary || 'Competitive',
      status: status || 'Open',
      applicantsCount: 0,
      description,
    };

    let createdJob = newJobData;

    // Save to MongoDB Database
    if (Job.db && Job.db.readyState === 1) {
      createdJob = await Job.create(newJobData);
    }

    // Sync with local db.json store
    const db = readDb();
    if (!db.jobs) db.jobs = [];
    db.jobs.unshift(newJobData);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully and stored in database',
      data: createdJob,
    });
  } catch (error) {
    console.error('❌ Error creating job opening:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error creating job opening' });
  }
};

// Update job posting
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getQuery(id);
    const updateFields = { ...req.body };

    let updatedJob = null;

    if (Job.db && Job.db.readyState === 1) {
      updatedJob = await Job.findOneAndUpdate(
        query,
        { $set: updateFields },
        { returnDocument: 'after', runValidators: true, upsert: true }
      );
    }

    const db = readDb();
    if (db.jobs) {
      const idx = db.jobs.findIndex((j) => j.id === id || j._id === id);
      if (idx !== -1) {
        db.jobs[idx] = { ...db.jobs[idx], ...updateFields };
        writeDb(db);
        if (!updatedJob) updatedJob = db.jobs[idx];
      }
    }

    res.json({
      success: true,
      message: 'Job opening updated in database',
      data: updatedJob,
    });
  } catch (error) {
    console.error('❌ Error updating job:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error updating job' });
  }
};

// Delete job posting
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getQuery(id);

    if (Job.db && Job.db.readyState === 1) {
      await Job.findOneAndDelete(query);
    }

    const db = readDb();
    if (db.jobs) {
      db.jobs = db.jobs.filter((j) => j.id !== id && j._id !== id);
      writeDb(db);
    }

    res.json({ success: true, message: 'Job opening deleted from database' });
  } catch (error) {
    console.error('❌ Error deleting job:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error deleting job' });
  }
};

// --- CANDIDATE APPLICATIONS ---

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    let applications = [];

    if (Application.db && Application.db.readyState === 1) {
      applications = await Application.find().sort({ createdAt: -1 }).lean();
    } else {
      const db = readDb();
      applications = db.applications || [];
    }

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error.message);
    const db = readDb();
    res.json({
      success: true,
      count: db.applications ? db.applications.length : 0,
      data: db.applications || [],
    });
  }
};

// Submit job application
exports.submitApplication = async (req, res) => {
  try {
    const { applicantName, email, phone, jobTitle, portfolioUrl, resumeUrl, coverLetter } = req.body;

    if (!applicantName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Applicant name and email are required fields.',
      });
    }

    const appId = `app-${Date.now()}`;
    const newAppData = {
      id: appId,
      applicantName,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      jobTitle: jobTitle || 'General Application',
      appliedDate: new Date().toISOString().split('T')[0],
      portfolioUrl: portfolioUrl || '',
      resumeUrl: resumeUrl || '#',
      status: 'New',
      coverLetter: coverLetter || '',
    };

    let createdApp = newAppData;

    if (Application.db && Application.db.readyState === 1) {
      createdApp = await Application.create(newAppData);

      // Increment applicantsCount on corresponding Job document
      if (jobTitle) {
        await Job.findOneAndUpdate(
          { $or: [{ title: jobTitle }, { id: req.body.jobId }] },
          { $inc: { applicantsCount: 1 } }
        );
      }
    }

    const db = readDb();
    if (!db.applications) db.applications = [];
    db.applications.unshift(newAppData);
    writeDb(db);

    // Dispatch job application emails (non-blocking)
    const { sendApplicationEmails, sendApplicationStatusEmail } = require('../services/emailService');
    sendApplicationEmails(newAppData).catch((err) => {
      console.warn('⚠️ Error sending application email:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully and saved to database',
      data: createdApp,
    });
  } catch (error) {
    console.error('❌ Error submitting application:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error submitting application' });
  }
};

// Update candidate application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = getQuery(id);

    let updatedApp = null;

    if (Application.db && Application.db.readyState === 1) {
      updatedApp = await Application.findOneAndUpdate(
        query,
        { $set: { status } },
        { returnDocument: 'after', runValidators: true }
      );
    }

    const db = readDb();
    if (db.applications) {
      const idx = db.applications.findIndex((a) => a.id === id || a._id === id);
      if (idx !== -1) {
        db.applications[idx].status = status;
        writeDb(db);
        if (!updatedApp) updatedApp = db.applications[idx];
      }
    }

    if (updatedApp) {
      const { sendApplicationStatusEmail } = require('../services/emailService');
      sendApplicationStatusEmail(updatedApp).catch((err) => {
        console.warn('⚠️ Error sending application status update email:', err.message);
      });
    }

    res.json({
      success: true,
      message: `Application status updated to ${status} in database`,
      data: updatedApp,
    });
  } catch (error) {
    console.error('❌ Error updating application status:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error updating status' });
  }
};
