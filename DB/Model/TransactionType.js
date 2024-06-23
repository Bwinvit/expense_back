import mongoose from "mongoose";

const { Schema } = mongoose;

const transactionTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TransactionType", transactionTypeSchema);
