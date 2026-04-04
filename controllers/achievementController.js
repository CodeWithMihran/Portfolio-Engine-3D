import Achievement from "../models/Achievement.js";


// 📌 GET ALL ACHIEVEMENTS (Public)
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      order: 1,
      date: -1,
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ⭐ GET FEATURED ACHIEVEMENTS
export const getFeaturedAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ featured: true }).sort({
      order: 1,
      date: -1,
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔍 GET SINGLE ACHIEVEMENT
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ➕ CREATE ACHIEVEMENT (Admin Only)
export const createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);

    res.status(201).json({
      message: "Achievement added successfully",
      achievement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✏️ UPDATE ACHIEVEMENT (Admin Only)
export const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.json({
      message: "Achievement updated successfully",
      achievement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🗑️ DELETE ACHIEVEMENT (Admin Only)
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔄 TOGGLE FEATURED ACHIEVEMENT
export const toggleFeaturedAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    achievement.featured = !achievement.featured;
    await achievement.save();

    res.json({
      message: "Achievement featured status updated",
      achievement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};