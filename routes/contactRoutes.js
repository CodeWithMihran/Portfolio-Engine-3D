import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
  markAsRead,
} from "../controllers/contactController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📩 SEND MESSAGE (Public)
router.post("/", createContact);


// 🔐 ADMIN ROUTES
router.get("/", authMiddleware, getContacts);

router.get("/:id", authMiddleware, getContactById);

router.delete("/:id", authMiddleware, deleteContact);

router.patch("/:id/read", authMiddleware, markAsRead);


export default router;