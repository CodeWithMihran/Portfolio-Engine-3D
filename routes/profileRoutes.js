import express from "express";
import {
  getProfile,
  upsertProfile,
  deleteProfile,
  updateResume,
  updateTheme, // 🎨 Added the new theme controller
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📌 GET PROFILE (Public)
// Fetches everything: bio, social links, 3D theme, and SEO metadata
router.get("/", getProfile);


// ✏️ CREATE / UPDATE PROFILE (Admin Only)
// upsertProfile handles both creation and full updates
router.post("/", authMiddleware, upsertProfile);
router.put("/", authMiddleware, upsertProfile);


// 🎨 UPDATE 3D THEME ONLY (Admin Only)
// Specifically for real-time 3D UI/UX adjustments (Colors, Lighting, Skybox)
router.put("/theme", authMiddleware, updateTheme);


// 📄 UPDATE RESUME ONLY (Admin Only)
router.put("/resume", authMiddleware, updateResume);


// 🗑️ DELETE PROFILE (Admin Only)
router.delete("/", authMiddleware, deleteProfile);


export default router;