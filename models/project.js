import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // 🏷️ Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String, // Optimized for 3D UI tooltips/cards
      maxlength: 200,
    },
    
    // 🛠️ Tech Stack & Organization
    technologies: [{ type: String }],
    tags: [{ type: String }], // Useful for 3D "zones" (e.g., ML zone vs Web zone)
    
    // 🔗 Links
    githubLink: { type: String },
    liveLink: { type: String },

    // 🖼️ Media (Optimized for 3D textures)
    images: [{ type: String }],
    thumbnail: { type: String },
    videoDemo: { type: String }, // For video textures on 3D meshes

    // 🌐 3D Spatial Configuration
    threeJsConfig: {
      modelPath: { type: String }, // Custom GLB for this specific project
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 },
      },
      rotation: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 },
      },
      scale: { type: Number, default: 1 },
      // 💡 Added: Interaction behavior
      isAnimate: { type: Boolean, default: false }, 
      floatIntensity: { type: Number, default: 1 },
    },

    // 📊 Status & Logic
    featured: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    
    // 📅 Timeline
    startDate: { type: Date },
    endDate: { type: Date },
    
    // 🧠 Meta Data
    role: { type: String },
    challenges: { type: String },
    learnings: { type: String },
    
    // 🔢 UI Management
    order: { 
      type: Number, 
      default: 0 
    },
  },
  { 
    timestamps: true 
  }
);

// 🚀 Performance: Indexing title and tags for fast searching in the 3D scene
projectSchema.index({ title: 'text' }); 
projectSchema.index({ tags: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
