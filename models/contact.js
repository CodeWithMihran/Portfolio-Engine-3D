import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // 👤 Sender Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      trim: true,
    },

    // 📝 Message Content
    message: {
      type: String,
      required: true,
    },

    // 📊 Status Tracking
    isRead: {
      type: Boolean,
      default: false,
    },

    // 🕒 Timestamp (auto handled below)
    
    // 🌐 Extra Info (Optional but useful)
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String, // browser/device info
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;