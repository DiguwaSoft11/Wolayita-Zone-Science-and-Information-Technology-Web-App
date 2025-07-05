// contactSchema.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  headName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    // New email field
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  sealImage: {
    type: String,
    required: false,
  },
  additionalFile: {
    type: String,
    required: false,
  },
  feedback: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled", "Done"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ContactOrg", contactSchema);
