import express from "express";
import {
  getSkills,
  getSkillsByCategory,
  getFeaturedSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  toggleFeaturedSkill,
} from "../controllers/skillController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// 📌 GET ALL SKILLS (Public)
router.get("/", getSkills);

// ⭐ GET FEATURED SKILLS
router.get("/featured", getFeaturedSkills);

// 📂 GET SKILLS BY CATEGORY
router.get("/category/:category", getSkillsByCategory);


// ➕ CREATE SKILL (Admin Only)
router.post("/", authMiddleware, createSkill);

// ✏️ UPDATE SKILL (Admin Only)
router.put("/:id", authMiddleware, updateSkill);

// 🗑️ DELETE SKILL (Admin Only)
router.delete("/:id", authMiddleware, deleteSkill);

// 🔄 TOGGLE FEATURED SKILL
router.patch("/:id/featured", authMiddleware, toggleFeaturedSkill);


export default router;