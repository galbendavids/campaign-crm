const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/campaign-crm";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/companies", require("./routes/companies"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Campaign CRM API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
