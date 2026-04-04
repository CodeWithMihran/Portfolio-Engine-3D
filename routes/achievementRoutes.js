import express from "express";
import {
  getAchievements,
  getFeaturedAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleFeaturedAchievement,
} from "../controllers/achievementController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📌 GET ALL ACHIEVEMENTS (Public)
router.get("/", getAchievements);

// ⭐ GET FEATURED ACHIEVEMENTS
router.get("/featured", getFeaturedAchievements);

// 🔍 GET SINGLE ACHIEVEMENT
router.get("/:id", getAchievementById);


// ➕ CREATE ACHIEVEMENT (Admin Only)
router.post("/", authMiddleware, createAchievement);

// ✏️ UPDATE ACHIEVEMENT (Admin Only)
router.put("/:id", authMiddleware, updateAchievement);

// 🗑️ DELETE ACHIEVEMENT (Admin Only)
router.delete("/:id", authMiddleware, deleteAchievement);

// 🔄 TOGGLE FEATURED ACHIEVEMENT
router.patch("/:id/featured", authMiddleware, toggleFeaturedAchievement);


export default router;