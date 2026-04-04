import express from "express";
import {
  getProfile,
  upsertProfile,
  deleteProfile,
  updateResume,
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📌 GET PROFILE (Public)
router.get("/", getProfile);


// ✏️ CREATE / UPDATE PROFILE (Admin Only)
router.post("/", authMiddleware, upsertProfile);
router.put("/", authMiddleware, upsertProfile);


// 🗑️ DELETE PROFILE (Admin Only)
router.delete("/", authMiddleware, deleteProfile);


// 📄 UPDATE RESUME ONLY (Admin Only)
router.put("/resume", authMiddleware, updateResume);


export default router;