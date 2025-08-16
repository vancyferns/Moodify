import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://humble-goldfish-4j9wgq46wr6j3j6xj-5173.app.github.dev",
  credentials: true
}));

// MongoDB connection
// The deprecated options have been removed.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
// All API routes must be placed BEFORE the 404 handler
app.use("/api/auth", authRoutes);

// CORRECTLY PLACED 404 HANDLER
// This middleware will only run if no other route has handled the request.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});