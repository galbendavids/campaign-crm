const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    titleConcept: {
      type: String,
      required: true,
    },
    messageConcept: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "paused", "completed"],
      default: "draft",
    },
    startDate: {
      type: Date,
      required: true,
    },

    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
