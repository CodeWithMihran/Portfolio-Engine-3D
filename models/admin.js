import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    // 👤 Basic Identification
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      // Note: Remember to hash this in your controller/middleware!
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    avatar: {
      type: String, // profile image URL
      default: "",
    },

    // 🔐 Security & Session Management
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    // Used for keeping the user logged in without re-entering password
    refreshToken: {
      type: String,
    },

    // For password recovery workflows
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
