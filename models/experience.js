import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    // 🏢 Company Info
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String, // logo URL
    },

    // 👨‍💻 Role Info
    role: {
      type: String, // e.g. "Frontend Developer Intern"
      required: true,
    },

    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "freelance"],
      default: "internship",
    },

    // 📍 Location
    location: {
      type: String, // e.g. "Remote", "Delhi, India"
    },

    // 📅 Duration
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    // 📝 Description
    description: {
      type: String, // short summary
    },

    responsibilities: [
      {
        type: String, // bullet points
      },
    ],

    // 🛠️ Tech Used
    technologies: [
      {
        type: String,
      },
    ],

    // 🔗 Optional Link
    companyWebsite: {
      type: String,
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

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;