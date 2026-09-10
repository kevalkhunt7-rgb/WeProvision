const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    appliedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    portfolioUrl: {
      type: String,
      default: '',
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '#',
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Reviewing', 'Shortlisted', 'Rejected'],
      default: 'New',
    },
    coverLetter: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Application', applicationSchema);
