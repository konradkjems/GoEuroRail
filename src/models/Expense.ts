import mongoose from 'mongoose';
import { IExpense } from '../types/models';

const expenseSchema = new mongoose.Schema({
  trip_id: {
    type: String,
    required: true,
    index: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expense_id: {
    type: String,
    default: () => new Date().getTime().toString(),
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['accommodation', 'food', 'transport', 'activities', 'shopping', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR'
  }
}, {
  timestamps: true
});

// Create indexes for common queries
expenseSchema.index({ trip_id: 1, date: -1 });
expenseSchema.index({ user_id: 1 });

const Expense = mongoose.models.Expense || mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense; 