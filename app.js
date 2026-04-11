import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// 🔌 Database Connection
import connectDB from "./config/db.js";

// 🛣️ Route Imports
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// ⚙️ Configurations
dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛡️ Middleware
app.use(
  cors({
    // PRO TIP: Use process.env.CLIENT_URL here later for deployment
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Added PATCH for our new contact status updates
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// 📂 Static Folders (For 3D models and images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🚀 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// 🏠 Root Endpoint
app.get("/", (req, res) => {
  res.send("Portfolio API is running...");
});

// 🔍 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🚨 Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error("Error Log:", err.stack); // stack trace is better for debugging
  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});