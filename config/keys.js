// config/keys.js
import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";