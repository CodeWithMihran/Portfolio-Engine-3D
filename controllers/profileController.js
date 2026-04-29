import Profile from "../models/profile.js";

// 📌 GET PROFILE (Public)
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ CREATE OR UPDATE PROFILE (Admin Only)
export const upsertProfile = async (req, res) => {
  try {
    // We use findOneAndUpdate with 'upsert: true' to handle both create and update
    // The empty query {} works because there is only ever one profile document
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: req.body }, // $set ensures nested objects like 'theme' and 'seo' are merged correctly
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🎨 UPDATE 3D THEME ONLY (Quick toggle for UI/UX)
export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: { theme } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      message: "3D Theme updated successfully",
      theme: profile.theme,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 UPDATE RESUME ONLY
export const updateResume = async (req, res) => {
  try {
    const { resume } = req.body;

    const profile = await Profile.findOneAndUpdate(
      {},
      { resume },
      { new: true }
    );

    res.json({
      message: "Resume updated successfully",
      resume: profile.resume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ DELETE PROFILE (Admin Only)
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
