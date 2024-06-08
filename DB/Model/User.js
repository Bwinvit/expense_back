import mongoose from 'mongoose';

const { Schema } = mongoose;

// Sub-schema for monthly financial data
const monthlyDataSchema = new Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  income: {
    type: Number,
    default: 0,
  },
  expenses: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  }
}, { _id: false });

const userSchema = new Schema({
  // Authentication Details
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },

  // Security Details
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },

  // Monthly Financial Information
  monthlyData: [monthlyDataSchema],

  // Budget Details
  budgets: [
    {
      category: String,
      amount: Number,
      spent: Number,
    }
  ],

  // Categories
  categories: [
    {
      name: String,
      type: { type: String, enum: ['income', 'expense'], required: true },
    }
  ],

  // Recurring Transactions
  recurringTransactions: [
    {
      name: String,
      amount: Number,
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
      nextDueDate: Date,
    }
  ],

  // Financial Goals
  financialGoals: [
    {
      name: String,
      targetAmount: Number,
      currentAmount: Number,
      targetDate: Date,
    }
  ],

  // Notifications
  notifications: [
    {
      message: String,
      date: Date,
      read: { type: Boolean, default: false },
    }
  ],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updatedAt' field on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', userSchema);
