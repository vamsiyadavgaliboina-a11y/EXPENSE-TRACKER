import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ['Pocket Money', 'Scholarship', 'Part-time Job', 'Freelancing', 'Internship', 'Allowance', 'Other'],
      default: 'Pocket Money',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Create index for faster queries
incomeSchema.index({ userId: 1, date: -1 });
incomeSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Income', incomeSchema);
