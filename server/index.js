const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS Configuration for Cloud Deployment
// In production (cloud), only allow requests from the Hugging Face Space frontend
// In development (local), allow all origins for easier testing
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-hf-space-url.hf.space' // Replace with your actual HF Space URL
    : '*', // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/campaign-crm";
console.log("Attempting to connect to MongoDB:", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");
    console.log("Database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Make sure MongoDB is running on your system");
  });

// Routes
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/companies", require("./routes/companies"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "OK",
    message: "Campaign CRM API is running",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// MongoDB status endpoint
app.get("/api/db-status", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = states[mongoose.connection.readyState];

  res.json({
    state: dbState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
