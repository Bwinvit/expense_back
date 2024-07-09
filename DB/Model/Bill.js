import mongoose from "mongoose";

const { Schema } = mongoose;

const billSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrencePeriod: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: function () {
      return this.isRecurring;
    },
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAmount: {
    type: Number,
    required: function () {
      return this.isPaid;
    },
  },
  paidDate: {
    type: Date,
    required: function () {
      return this.isPaid;
    },
  },
});

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
