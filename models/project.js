import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // 🏷️ Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String, // for cards preview
    },

    // 🛠️ Tech Stack
    technologies: [
      {
        type: String,
      },
    ],

    // 🔗 Links
    githubLink: {
      type: String,
    },

    liveLink: {
      type: String,
    },

    // 🖼️ Media
    images: [
      {
        type: String, // image URLs
      },
    ],

    thumbnail: {
      type: String, // main preview image
    },

    // ⭐ Highlight
    featured: {
      type: Boolean,
      default: false,
    },

    // 📊 Status
    status: {
      type: String,
      enum: ["completed", "in-progress"],
      default: "completed",
    },

    // 📅 Timeline
    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    // 🧠 Additional Details
    role: {
      type: String, // e.g. "Full Stack Developer"
    },

    challenges: {
      type: String,
    },

    learnings: {
      type: String,
    },

    // 🔢 Ordering (for UI control)
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;