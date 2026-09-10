const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
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
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    client: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    metrics: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Archived'],
      default: 'Published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
