import Experience from "../models/Experience.js";


// 📌 GET ALL EXPERIENCES (Public)
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      startDate: -1,
    });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔍 GET SINGLE EXPERIENCE
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ➕ CREATE EXPERIENCE (Admin Only)
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✏️ UPDATE EXPERIENCE (Admin Only)
export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🗑️ DELETE EXPERIENCE (Admin Only)
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};