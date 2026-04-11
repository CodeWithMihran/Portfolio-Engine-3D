import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. 🛡️ Security Enhancement: Verify Admin still exists in DB
    // We also select('-password') for safety
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // 3. Attach the admin ID to the request
    req.user = admin._id;
    
    next();
  } catch (error) {
    // Handle specific JWT errors for clearer frontend debugging
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default authMiddleware;