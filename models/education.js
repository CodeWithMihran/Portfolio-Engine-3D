import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    // 🏫 Institution Details
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },

    institutionLogo: {
      type: String, // logo URL
    },

    // 🎓 Degree Info
    degree: {
      type: String, // e.g. B.Tech, BCA
      required: true,
    },

    fieldOfStudy: {
      type: String, // e.g. Computer Science
      required: true,
    },

    // 📍 Location
    location: {
      type: String,
    },

    // 📅 Duration
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    // 📊 Performance
    grade: {
      type: String, // CGPA / Percentage
    },

    // 📝 Description / Highlights
    description: {
      type: String,
    },

    // 📚 Subjects / Coursework
    coursework: [
      {
        type: String,
      },
    ],

    // 🏆 Achievements in education
    achievements: [
      {
        type: String,
      },
    ],

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

const Education = mongoose.model("Education", educationSchema);

export default Education;