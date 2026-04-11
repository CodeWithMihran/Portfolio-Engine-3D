import Skill from "../models/Skill.js";


// 📌 GET ALL SKILLS (Public)
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📂 GET SKILLS BY CATEGORY
export const getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const skills = await Skill.find({ category }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ⭐ GET FEATURED SKILLS
export const getFeaturedSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ featured: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ➕ CREATE SKILL (Admin Only)
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      message: "Skill added successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ UPDATE SKILL (Admin Only)
export const updateSkill = async (req, res) => {
  try {
    // We use $set to ensure nested threeJsConfig properties aren't wiped out
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🗑️ DELETE SKILL (Admin Only)
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔄 TOGGLE FEATURED SKILL
export const toggleFeaturedSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    skill.featured = !skill.featured;
    await skill.save();

    res.json({
      message: "Skill featured status updated",
      skill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};