const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    type: {
      type: String,
      default: 'Full-time',
      trim: true,
    },
    experience: {
      type: String,
      default: '1-3 Years',
      trim: true,
    },
    salary: {
      type: String,
      default: 'Competitive',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open',
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Job', jobSchema);
