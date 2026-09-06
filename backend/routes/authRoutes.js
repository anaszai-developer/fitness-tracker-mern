import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/jwt.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("========== LOGIN ATTEMPT ==========");
    console.log("LOGIN EMAIL:", email);
    console.log("PASSWORD RECEIVED:", password ? "YES" : "NO");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    console.log("USER FOUND:", user ? "YES" : "NO");

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("USER ID:", user._id);
    console.log("USER NAME:", user.name);
    console.log("USER EMAIL:", user.email);
    console.log("PASSWORD HASH EXISTS:", user.password ? "YES" : "NO");

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("❌ PASSWORD DOES NOT MATCH");

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    console.log("✅ LOGIN SUCCESSFUL");
    console.log("TOKEN GENERATED: YES");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});


// ================= PROFILE =================
router.get("/profile", protect, async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// IMPORTANT: export at the END
export default router;