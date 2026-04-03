import Certificate from "../models/certificate.js";


// 📌 GET ALL CERTIFICATES (Public)
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({
      order: 1,
      issueDate: -1,
    });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ⭐ GET FEATURED CERTIFICATES
export const getFeaturedCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ featured: true }).sort({
      order: 1,
      issueDate: -1,
    });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔍 GET SINGLE CERTIFICATE
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ➕ CREATE CERTIFICATE (Admin Only)
export const createCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);

    res.status(201).json({
      message: "Certificate added successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✏️ UPDATE CERTIFICATE (Admin Only)
export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({
      message: "Certificate updated successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🗑️ DELETE CERTIFICATE (Admin Only)
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔄 TOGGLE FEATURED CERTIFICATE
export const toggleFeaturedCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    certificate.featured = !certificate.featured;
    await certificate.save();

    res.json({
      message: "Certificate featured status updated",
      certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};