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
      type: String, // e.g. Full Stack Developer / ML Engineer
      required: true,
    },

    bio: {
      type: String, // short intro / tagline
      required: true,
    },

    about: {
      type: String, // detailed long-form description
    },

    profileImage: {
      type: String, // Image URL for hero section
      default: "",
    },

    // 📍 Contact Info
    email: {
      type: String,
      required: true,
      lowercase: true,
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

    // 🎨 3D Theme & Scene Control (Master Controls for Three.js)
    theme: {
      primaryColor: { type: String, default: "#3b82f6" }, // Accent color for UI
      backgroundColor: { type: String, default: "#000000" }, // 3D Scene background
      accentColor: { type: String, default: "#60a5fa" }, // Color for highlights/glow
      
      // Lighting controls for the 3D world
      ambientLightIntensity: { type: Number, default: 0.5 },
      pointLightColor: { type: String, default: "#ffffff" },
      
      // Environment
      skyboxUrl: { type: String }, // 360° HDR/Image for the world background
      enablePostProcessing: { type: Boolean, default: true }, // Toggle Bloom/Blur
    },

    // 🔍 SEO & Branding
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
      ogImage: { type: String }, // Image for social media sharing cards
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

    // 📄 Assets
    resume: {
      type: String, // PDF URL
    },

    // 🧠 Professional Status
    availability: {
      type: String, // e.g. "Available for hire"
      default: "Open to opportunities",
    },

    tagline: {
      type: String, // Short catchy branding line
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;