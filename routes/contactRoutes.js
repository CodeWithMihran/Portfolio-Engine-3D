import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
  updateContact, // 🔄 Updated controller import
} from "../controllers/contactController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📩 SEND MESSAGE (Public)
// Anyone visiting your portfolio can send you a message
router.post("/", createContact);


// 🔐 ADMIN ROUTES (All protected by authMiddleware)
// 📌 Get all messages (Supports ?status=new filtering in controller)
router.get("/", authMiddleware, getContacts);

// 🔍 Get a specific message detail
router.get("/:id", authMiddleware, getContactById);

// 🗑️ Delete a message
router.delete("/:id", authMiddleware, deleteContact);

// ✅ UPDATE MESSAGE STATUS & NOTES
// This handles marking as read, replying, archiving, and saving admin notes
router.patch("/:id", authMiddleware, updateContact);


export default router;