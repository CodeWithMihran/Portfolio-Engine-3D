import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📝 Register Admin (Use once or protect later)
router.post("/register", registerAdmin);

// 🔐 Login
router.post("/login", loginAdmin);

// 👤 Get Current Admin (Protected)
router.get("/me", authMiddleware, getCurrentAdmin);

// 🚪 Logout
router.post("/logout", authMiddleware, logoutAdmin);


export default router;