import express from "express";
import {
  getProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleFeaturedProject,
} from "../controllers/projectController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📌 GET ALL PROJECTS (Public)
router.get("/", getProjects);

// ⭐ GET FEATURED PROJECTS
router.get("/featured", getFeaturedProjects);

// 🔍 GET SINGLE PROJECT
router.get("/:id", getProjectById);


// ➕ CREATE PROJECT (Admin Only)
router.post("/", createProject);

// ✏️ UPDATE PROJECT (Admin Only)
router.put("/:id", authMiddleware, updateProject);

// 🗑️ DELETE PROJECT (Admin Only)
router.delete("/:id", authMiddleware, deleteProject);

// 🔄 TOGGLE FEATURED PROJECT
router.patch("/:id/featured", authMiddleware, toggleFeaturedProject);


export default router;