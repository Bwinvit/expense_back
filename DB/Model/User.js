import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// Sub-schema for monthly financial data
const monthlyDataSchema = new Schema(
    {
        year: { type: Number, required: true },
        month: { type: Number, required: true },
        income: { type: Number, default: 0 },
        expenses: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
    },
    { _id: false }
);

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    monthlyData: [monthlyDataSchema],
    budgets: [{ category: String, amount: Number, spent: Number }],
    categories: [
        {
            name: String,
            type: { type: String, enum: ["income", "expense"], required: true },
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

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Middleware to update the 'updatedAt' field on save
userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("User", userSchema);
