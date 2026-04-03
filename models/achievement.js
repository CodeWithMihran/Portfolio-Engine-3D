import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    // 🏷️ Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 📝 Description
    description: {
      type: String,
      required: true,
    },

    // 🏆 Type of Achievement
    type: {
      type: String,
      enum: ["award", "competition", "hackathon", "recognition", "other"],
      default: "other",
    },

    // 🏢 Issuer / Organization
    issuer: {
      type: String, // e.g. Hackathon Organizer, College, Company
    },

    issuerLogo: {
      type: String, // logo URL
    },

    // 📅 Date
    date: {
      type: Date,
    },

    // 🥇 Rank / Position
    position: {
      type: String, // e.g. "1st Place", "Top 10"
    },

    // 🔗 Proof / Link
    certificateURL: {
      type: String,
    },

    // 🖼️ Image (optional)
    image: {
      type: String,
    },

    // ⭐ Highlight important achievements
    featured: {
      type: Boolean,
      default: false,
    },

    // 🔢 Order for UI
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;