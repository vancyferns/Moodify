import express from "express";
import bcrypt from "bcryptjs";
import User from "../User.js";
import Admin from "../Admin.js";

const router = express.Router();

/**
 * ============================
 * ADMIN SIGNIN
 * ============================
 */
router.post("/signin/admin", async (req, res) => {
  try {
    const { email, password } = req.body; // password = SHA-256 from frontend

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare SHA-256 string with bcrypt hash
    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Admin login successful",
      user: {
        id: existingAdmin._id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Admin signin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * ============================
 * USER SIGNUP
 * ============================
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; // password = SHA-256 from frontend

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * ============================
 * USER SIGNIN
 * ============================
 */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body; // password = SHA-256 from frontend

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
