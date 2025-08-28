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
  "https://moodify-murex.vercel.app",   // Frontend (Vercel)
  "https://moodify-1-4ogp.onrender.com", // Backend API (Render - auth/model)
  "https://moodify-haag.onrender.com",   // Backend API (Render - text model)
  "http://localhost:5173",               // Vite dev
  "http://127.0.0.1:5173",
  "http://localhost:3000"                // Common React dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        return callback(new Error(`CORS not allowed for origin: ${origin}`), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully! 🎉"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Use route handlers
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// --- Corrected and Improved Route Listing Function ---
const listRoutes = (server) => {
  console.log("\n📌 Registered Routes:");
  server._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(
        `  ${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${
          middleware.route.path
        }`
      );
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(
            `  ${Object.keys(handler.route.methods).join(", ").toUpperCase()} ${
              middleware.regexp.source
                .replace(/\\\//g, "/")
                .replace(/^\/\^/, "")
                .replace(/\/\?\(\?=\/\|\$\)\/\$$/, "")
                .replace(/\/\?$/, "")
            }${handler.route.path}`
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
  console.log(`🚀 Server running on port ${PORT}`);
});
