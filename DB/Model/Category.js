import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionType",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
