import express from "express";
import {
  getCertificates,
  getFeaturedCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  toggleFeaturedCertificate,
} from "../controllers/certificateController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// 📌 GET ALL CERTIFICATES (Public)
router.get("/", getCertificates);

// ⭐ GET FEATURED CERTIFICATES
router.get("/featured", getFeaturedCertificates);

// 🔍 GET SINGLE CERTIFICATE
router.get("/:id", getCertificateById);


// ➕ CREATE CERTIFICATE (Admin Only)
router.post("/", authMiddleware, createCertificate);

// ✏️ UPDATE CERTIFICATE (Admin Only)
router.put("/:id", authMiddleware, updateCertificate);

// 🗑️ DELETE CERTIFICATE (Admin Only)
router.delete("/:id", authMiddleware, deleteCertificate);

// 🔄 TOGGLE FEATURED CERTIFICATE
router.patch("/:id/featured", authMiddleware, toggleFeaturedCertificate);


export default router;