import Education from "../models/education.js";


// 📌 GET ALL EDUCATION (Public)
export const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({
      order: 1,
      startDate: -1,
    });

    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔍 GET SINGLE EDUCATION
export const getEducationById = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ➕ CREATE EDUCATION (Admin Only)
export const createEducation = async (req, res) => {
  try {
    const education = await Education.create(req.body);

    res.status(201).json({
      message: "Education added successfully",
      education,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✏️ UPDATE EDUCATION (Admin Only)
export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.json({
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🗑️ DELETE EDUCATION (Admin Only)
export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
