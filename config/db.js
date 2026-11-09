import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI ||
    (process.env.NODE_ENV === "production"
      ? ""
      : "mongodb://127.0.0.1:27017/portfolio");

  if (!mongoUri) {
    throw new Error("MONGO_URI must be configured in production.");
  }

  const retryDelays = [0, 1500, 4000];
  let lastError;

  for (const delay of retryDelays) {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 12000,
        connectTimeoutMS: 12000,
        maxPoolSize: 10,
      });
      console.log(`MongoDB connected (${mongoose.connection.name})`);
      return;
    } catch (error) {
      lastError = error;
      console.error("MongoDB connection attempt failed:", error.message);
    }
  }

  throw lastError;
};

export default connectDB;
