import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    // 🏷️ Skill Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 📂 Category (Used for 3D grouping/clusters)
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

    // 📊 Skill Level (Can control the scale/size of the 3D object)
    proficiency: {
      type: Number, // 1 to 100
      min: 1,
      max: 100,
      default: 80,
    },

    // 🖼️ Icon & Visuals
    icon: {
      type: String, // URL to SVG/PNG or a icon-library string
    },
    
    color: {
      type: String, // Hex code (e.g., #61DBFB) to tint 3D materials
      default: "#ffffff",
    },

    // 🌐 3D Spatial Configuration
    threeJsConfig: {
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 },
      },
      scale: { type: Number, default: 1 },
      // Allows individual skills to rotate or bob up/down in the 3D scene
      animationType: {
        type: String,
        enum: ["none", "rotate", "float", "pulse"],
        default: "none",
      },
    },

    // ⭐ Highlight important skills
    featured: {
      type: Boolean,
      default: false,
    },

    // 🔢 Ordering (UI control for 2D fallback lists)
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing by category to quickly group skills in the 3D world
skillSchema.index({ category: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;