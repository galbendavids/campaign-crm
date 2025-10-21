const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const { handleDatabaseError } = require("../utils/errorHandler");

// GET /api/campaigns - Get all campaigns
router.get("/", async (req, res) => {
  try {
    console.log("Fetching campaigns...");
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    console.log(`Found ${campaigns.length} campaigns`);
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    const errorMessage = handleDatabaseError(error, "fetch campaigns");
    res.status(500).json({ message: errorMessage });
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
    console.error("Error fetching campaign by ID:", error);
    const errorMessage = handleDatabaseError(error, "fetch campaign");
    res.status(500).json({ message: errorMessage });
  }
});

// POST /api/campaigns - Create a new campaign
router.post("/", async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Campaign creation error:", error);
    const errorMessage = handleDatabaseError(error, "create campaign");
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
    console.error("Campaign update error:", error);
    const errorMessage = handleDatabaseError(error, "update campaign");
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
    console.error("Error deleting campaign:", error);
    const errorMessage = handleDatabaseError(error, "delete campaign");
    res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
