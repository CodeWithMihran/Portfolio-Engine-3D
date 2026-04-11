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
      // Simple regex validation to ensure data quality
      match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    subject: {
      type: String,
      trim: true,
      default: "New Inquiry from Portfolio",
    },

    // 📝 Message Content
    message: {
      type: String,
      required: true,
    },

    // 📊 Status & Workflow Tracking
    // Allows you to filter messages in your Admin Panel
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    // 🕒 Metadata for Security & Context
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String, // Useful to see if users are visiting from mobile or desktop
    },

    // 📝 Admin Internal Notes
    // Allows you to write private notes about the inquiry (e.g., "Sent quote on 12th April")
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing email and status for faster filtering in the admin dashboard
contactSchema.index({ email: 1, status: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;