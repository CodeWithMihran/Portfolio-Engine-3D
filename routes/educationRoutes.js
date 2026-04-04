import express from "express";
import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📌 GET ALL EDUCATION (Public)
router.get("/", getEducations);

// 🔍 GET SINGLE EDUCATION
router.get("/:id", getEducationById);


// ➕ CREATE EDUCATION (Admin Only)
router.post("/", authMiddleware, createEducation);

// ✏️ UPDATE EDUCATION (Admin Only)
router.put("/:id", authMiddleware, updateEducation);

// 🗑️ DELETE EDUCATION (Admin Only)
router.delete("/:id", authMiddleware, deleteEducation);


export default router;