import express from "express";
import bcrypt from "bcryptjs";
import User from "../User.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

// SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body; 

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare the plaintext password from the request with the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
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


// import express from "express";
// import bcrypt from "bcryptjs";
// import User from "../User.js";

// const router = express.Router();

// // Signup route
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     return res.status(201).json({ message: "User created successfully" });
//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// // Signin route
// router.post("/signin", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, existingUser.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     return res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: existingUser._id,
//         name: existingUser.name,
//         email: existingUser.email,
//       },
//     });
//   } catch (err) {
//     console.error("Signin error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;
