import Achievement from "../models/achievement.js";
import Certificate from "../models/certificate.js";
import Education from "../models/education.js";
import Experience from "../models/experience.js";
import Profile from "../models/profile.js";
import Project from "../models/project.js";
import Skill from "../models/skill.js";

export const getPortfolio = async (_req, res) => {
  try {
    const [profile, projects, skills, experience, education, certificates, achievements] =
      await Promise.all([
        Profile.findOne().lean(),
        Project.find().sort({ order: 1, createdAt: -1 }).lean(),
        Skill.find().sort({ order: 1, createdAt: -1 }).lean(),
        Experience.find().sort({ order: 1, startDate: -1 }).lean(),
        Education.find().sort({ order: 1, startDate: -1 }).lean(),
        Certificate.find().sort({ order: 1, issueDate: -1 }).lean(),
        Achievement.find().sort({ order: 1, date: -1 }).lean(),
      ]);

    res.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
    res.json({ profile, projects, skills, experience, education, certificates, achievements });
  } catch (error) {
    console.error("Portfolio data request failed:", error.message);
    res.status(500).json({ message: "Portfolio data could not be loaded." });
  }
};
