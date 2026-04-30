import Project from "../models/project.js";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    return "";
  }

  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingProject = await Project.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");

    if (!existingProject) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

// 📌 GET ALL PROJECTS (Public)
// Added filtering by tag/category for better 3D organization
export const getProjects = async (req, res) => {
  try {
    const { tag } = req.query;
    const query = tag ? { tags: tag } : {};

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ GET FEATURED PROJECTS (Main Hero 3D Scene)
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 GET SINGLE PROJECT BY ID OR SLUG
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the ID provided is a valid MongoDB ObjectId, otherwise search by slug
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    
    const project = await Project.findOne(query);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➕ CREATE PROJECT (Admin Only)
export const createProject = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = req.body.slug
        ? await generateUniqueSlug(req.body.slug)
        : await generateUniqueSlug(req.body.title);
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    // --- ADD THESE TWO LINES BELOW ---
    console.error("FULL CRASH LOG:", error); 
    if (error.errors) console.error("VALIDATION DETAILS:", error.errors);
    // ---------------------------------

    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// ✏️ UPDATE PROJECT (Admin Only)
export const updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.title && !Object.prototype.hasOwnProperty.call(updateData, "slug")) {
      updateData.slug = await generateUniqueSlug(updateData.title, req.params.id);
    } else if (updateData.slug) {
      updateData.slug = await generateUniqueSlug(updateData.slug, req.params.id);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ DELETE PROJECT (Admin Only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 TOGGLE FEATURED PROJECT
export const toggleFeaturedProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      message: "Project featured status updated",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

