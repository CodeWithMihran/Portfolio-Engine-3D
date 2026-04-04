import express from "express";
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📌 GET ALL EXPERIENCES (Public)
router.get("/", getExperiences);

// 🔍 GET SINGLE EXPERIENCE
router.get("/:id", getExperienceById);


// ➕ CREATE EXPERIENCE (Admin Only)
router.post("/", authMiddleware, createExperience);

// ✏️ UPDATE EXPERIENCE (Admin Only)
router.put("/:id", authMiddleware, updateExperience);

// 🗑️ DELETE EXPERIENCE (Admin Only)
router.delete("/:id", authMiddleware, deleteExperience);


export default router;