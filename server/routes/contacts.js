const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const Company = require("../models/company");

// GET /api/contacts - Get all contacts
router.get("/", async (req, res) => {
  try {
    const { populate } = req.query;
    let query = Contact.find().sort({ createdAt: -1 });

    if (populate === "company" || populate === "all") {
      query = query.populate({
        path: "companyCode",
        match: { companyCode: { $exists: true } },
        select: "name companyCode industry size country",
      });
    }

    const contacts = await query;
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts/:id - Get a specific contact
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/contacts - Create a new contact
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    let errorMessage = "Failed to create contact";

    if (error.code === 11000) {
      errorMessage = "A contact with this email already exists.";
    } else if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Contact creation error:", error);
    res.status(400).json({ message: errorMessage });
  }
});

// PUT /api/contacts/:id - Update a contact
router.put("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    let errorMessage = "Failed to update contact";

    if (error.code === 11000) {
      errorMessage = "A contact with this email already exists.";
    } else if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Contact update error:", error);
    res.status(400).json({ message: errorMessage });
  }
});
// DELETE /api/contacts/:id - Delete a contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
