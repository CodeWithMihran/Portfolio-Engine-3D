import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// 📝 REGISTER ADMIN (Run once manually or via API)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate token first
    const token = generateToken(admin._id);

    // ✅ Update session details in DB
    admin.lastLogin = new Date();
    admin.refreshToken = token; // Saving the token to the DB for session tracking
    await admin.save();

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 GET CURRENT ADMIN (Protected)
export const getCurrentAdmin = async (req, res) => {
  try {
    // req.user is populated by your auth middleware
    const admin = await Admin.findById(req.user).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚪 LOGOUT ADMIN
export const logoutAdmin = async (req, res) => {
  try {
    // If you want to invalidate the session on the backend:
    if (req.user) {
      const admin = await Admin.findById(req.user);
      if (admin) {
        admin.refreshToken = null; // Clear the token from DB
        await admin.save();
      }
    }
    
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};