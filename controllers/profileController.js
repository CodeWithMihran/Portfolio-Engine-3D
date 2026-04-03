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
    let profile = await Profile.findOne();

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate({}, req.body, {
        new: true,
      });

      return res.json({
        message: "Profile updated successfully",
        profile,
      });
    }

    // Create new profile
    profile = await Profile.create(req.body);

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🗑️ DELETE PROFILE (Optional - Admin Only)
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
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};