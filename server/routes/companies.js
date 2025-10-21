const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const { handleDatabaseError } = require("../utils/errorHandler");

// GET /api/companies - Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    const errorMessage = handleDatabaseError(error, "fetch companies");
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/companies/:id - Get a specific company
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/companies/code/:companyCode - Get company by company code
router.get("/code/:companyCode", async (req, res) => {
  try {
    const company = await Company.findOne({
      companyCode: req.params.companyCode,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/companies - Create a new company
router.post("/", async (req, res) => {
  try {
    // Clean up empty strings for optional fields
    const companyData = { ...req.body };
    if (companyData.size === "") delete companyData.size;
    if (companyData.industry === "") delete companyData.industry;
    if (companyData.website === "") delete companyData.website;
    if (companyData.country === "") delete companyData.country;
    if (companyData.zone === "") delete companyData.zone;
    if (companyData.descriptionPurposeAI === "")
      delete companyData.descriptionPurposeAI;
    if (companyData.nextYearsTargetsAI === "")
      delete companyData.nextYearsTargetsAI;

    const company = new Company(companyData);
    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    let errorMessage = "Failed to create company";

    if (error.code === 11000) {
      errorMessage =
        "Company code already exists. Please use a different code.";
    } else if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Company creation error:", error);
    res.status(400).json({ message: errorMessage });
  }
});

// PUT /api/companies/:id - Update a company
router.put("/:id", async (req, res) => {
  try {
    // Clean up empty strings for optional fields
    const companyData = { ...req.body };
    if (companyData.size === "") delete companyData.size;
    if (companyData.industry === "") delete companyData.industry;
    if (companyData.website === "") delete companyData.website;
    if (companyData.country === "") delete companyData.country;
    if (companyData.zone === "") delete companyData.zone;
    if (companyData.descriptionPurposeAI === "")
      delete companyData.descriptionPurposeAI;
    if (companyData.nextYearsTargetsAI === "")
      delete companyData.nextYearsTargetsAI;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      companyData,
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    let errorMessage = "Failed to update company";

    if (error.code === 11000) {
      errorMessage =
        "Company code already exists. Please use a different code.";
    } else if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Company update error:", error);
    res.status(400).json({ message: errorMessage });
  }
});
// DELETE /api/companies/:id - Delete a company
router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
