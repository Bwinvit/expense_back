import mongoose from "mongoose";

const { Schema } = mongoose;

const quoteSchema = new Schema({
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Quote", quoteSchema);
