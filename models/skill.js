import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    // 🏷️ Skill Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 📂 Category (VERY IMPORTANT for UI grouping)
    category: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "database",
        "programming",
        "tools",
        "other",
      ],
      required: true,
    },

    // 📊 Skill Level (for progress bars / UI)
    proficiency: {
      type: Number, // 1 to 100
      min: 1,
      max: 100,
    },

    // 🖼️ Icon (for UI display)
    icon: {
      type: String, // URL or icon class (e.g., react icon)
    },

    // ⭐ Highlight important skills
    featured: {
      type: Boolean,
      default: false,
    },

    // 🔢 Ordering (UI control)
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;