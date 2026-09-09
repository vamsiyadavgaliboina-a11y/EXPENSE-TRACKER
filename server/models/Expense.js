import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
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
      enum: ['Food', 'Transportation', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Travel', 'Accommodation', 'Other'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Cash',
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Create index for faster queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);
