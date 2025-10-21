const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");

// GET /api/campaigns - Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/campaigns/:id - Get a specific campaign
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/campaigns - Create a new campaign
router.post("/", async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    let errorMessage = "Failed to create campaign";

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Campaign creation error:", error);
    res.status(400).json({ message: errorMessage });
  }
});

// PUT /api/campaigns/:id - Update a campaign
router.put("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    let errorMessage = "Failed to update campaign";

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Campaign update error:", error);
    res.status(400).json({ message: errorMessage });
  }
});
// DELETE /api/campaigns/:id - Delete a campaign
router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
