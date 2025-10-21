const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    size: {
      type: String,
      enum: {
        values: [
          "",
          "less than 30",
          "30 to 60",
          "60 to 100",
          "100 to 300",
          "300-1000",
          "more than 1,000",
        ],
        message: "Invalid company size",
      },
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    zone: {
      type: String,
      trim: true,
    },
    created_date: {
      type: Date,
    },
    descriptionPurposeAI: {
      type: String,
      trim: true,
    },
    nextYearsTargetsAI: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
