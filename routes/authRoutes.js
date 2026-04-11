import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📝 Register Admin 
// ⚠️ SECURITY TIP: Once you have created your account, either comment this out 
// or wrap it in authMiddleware so only you can create other admins.
router.post("/register", registerAdmin);


// 🔐 Login
// Now handles refreshToken and lastLogin updates in the controller
router.post("/login", loginAdmin);


// 👤 Get Current Admin (Protected)
// Used by the frontend to verify if the stored token is still valid
router.get("/me", authMiddleware, getCurrentAdmin);


// 🚪 Logout (Protected)
// Now actively invalidates the refreshToken in the database for better security
router.post("/logout", authMiddleware, logoutAdmin);


export default router;