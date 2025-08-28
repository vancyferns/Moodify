// This file sets up and runs the Express server for Moodify.

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import historyRoutes from "./routes/history.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// --- Improved CORS Configuration for Development and Production ---
const allowedOrigins = [
  'https://moodify-murex.vercel.app',
  'http://localhost:5173', // Vercel's default dev server port for React
  'http://127.0.0.1:5173',
  'http://localhost:3000'  // Common dev server port for React
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully! 🎉"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use route handlers
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// --- Corrected and Improved Route Listing Function ---
const listRoutes = (server) => {
  console.log("\nRegistered Routes:");
  server._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Normal routes directly on the app instance
      console.log(`  ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Routes from imported router files
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(
            `  ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${middleware.regexp.source.replace(/\\\//g, '/').replace(/^\/\^/, '').replace(/\/\?\(\?=\/\|\$\)\/\$$/, '').replace(/\/\?$/, '')}${handler.route.path}`
          );
        }
      });
    }
  });
  console.log("");
};
listRoutes(app);

// Global error handler for 404 Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
