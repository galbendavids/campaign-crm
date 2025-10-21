const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    companyCode: {
      type: String,
      trim: true,
      ref: "Company",
    },
    position: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["lead", "prospect", "customer", "inactive"],
      default: "lead",
    },
    source: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    tags: [String],
    lastContacted: {
      type: Date,
    },
    created: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
