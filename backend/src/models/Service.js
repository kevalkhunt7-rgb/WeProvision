const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        type: String,
        trim: true,
      },
    ],
    color: {
      type: String,
      default: '#8B5CF6',
    },
    active: {
      type: Boolean,
      default: true,
    },
    projectsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual id is returned if needed
serviceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Service', serviceSchema);
