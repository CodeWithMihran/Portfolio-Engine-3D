import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    // 🏷️ Certificate Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String, // e.g. Coursera, Udemy
      required: true,
    },

    issuerLogo: {
      type: String, // logo URL
    },

    // 📅 Dates
    issueDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date, // optional
    },

    // 🔗 Verification
    credentialId: {
      type: String,
    },

    credentialURL: {
      type: String, // link to verify certificate
    },

    // 📝 Description
    description: {
      type: String,
    },

    // 🖼️ Certificate Image (optional)
    certificateImage: {
      type: String,
    },

    // ⭐ Highlight important certificates
    featured: {
      type: Boolean,
      default: false,
    },

    // 🔢 Ordering
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;