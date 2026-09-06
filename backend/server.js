import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Fitness Tracker API is running 🚀",
  });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error ❌");
    console.log(error.message);
  });

export default app;