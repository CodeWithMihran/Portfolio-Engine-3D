import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // 🧑 Basic Info
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String, // e.g. Full Stack Developer
      required: true,
    },

    bio: {
      type: String, // short intro / tagline
      required: true,
    },

    about: {
      type: String, // detailed description
    },

    profileImage: {
      type: String, // image URL
      default: "",
    },

    // 📍 Contact Info
    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    location: {
      type: String,
    },

    // 🌐 Social Links
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      website: { type: String },
    },

    // 👀 Section Visibility Controls
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      certificates: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },

    // 📄 Resume
    resume: {
      type: String, // PDF URL
    },

    // 🧠 Additional Info (Optional but useful)
    availability: {
      type: String, // e.g. "Open to work"
      default: "Open to opportunities",
    },

    // ⚙️ SEO / Branding
    tagline: {
      type: String, // short catchy line
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
