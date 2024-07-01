import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  budgets: [{ category: String, amount: Number, spent: Number }],
  categories: [
    {
      name: String,
      type: { type: String, required: true },
    },
  ],
  recurringTransactions: [
    {
      name: String,
      amount: Number,
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        required: true,
      },
      nextDueDate: Date,
    },
  ],
  financialGoals: [
    {
      name: String,
      targetAmount: Number,
      currentAmount: Number,
      targetDate: Date,
    },
  ],
  notifications: [
    {
      message: String,
      date: Date,
      read: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
