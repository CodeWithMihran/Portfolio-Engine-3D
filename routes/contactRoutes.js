import express from "express";
import {
  createContact,
  deleteContact,
  exportContactsCsv,
  getContactById,
  getContacts,
  getContactStats,
  updateContact,
} from "../controllers/contactController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createContact);

router.get("/", authMiddleware, getContacts);
router.get("/stats", authMiddleware, getContactStats);
router.get("/export", authMiddleware, exportContactsCsv);
router.get("/:id", authMiddleware, getContactById);
router.delete("/:id", authMiddleware, deleteContact);
router.patch("/:id", authMiddleware, updateContact);

export default router;
