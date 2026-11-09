import { readFile, unlink } from "node:fs/promises";

const getCloudinaryConfig = () => {
  const config = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
  const configuredValues = Object.values(config).filter(Boolean).length;

  if (configuredValues === 0) return null;
  if (configuredValues !== Object.keys(config).length) {
    throw new Error("Cloudinary configuration is incomplete. Set all three CLOUDINARY variables.");
  }

  return config;
};

const getResourceType = (file) => {
  if (file.mimetype.startsWith("video/")) return "video";
  if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) return "image";
  if (file.mimetype.startsWith("image/")) return "image";
  return "raw";
};

const removeTemporaryFile = (filePath) => unlink(filePath).catch(() => {});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const cloudinary = getCloudinaryConfig();
    let imageUrl;

    if (cloudinary) {
      try {
        const fileBuffer = await readFile(req.file.path);
        const formData = new FormData();
        formData.append(
          "file",
          new Blob([fileBuffer], { type: req.file.mimetype }),
          req.file.originalname
        );
        formData.append("folder", "portfolio");

        const resourceType = getResourceType(req.file);
        const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinary.cloudName)}/${resourceType}/upload`;
        const authorization = Buffer.from(`${cloudinary.apiKey}:${cloudinary.apiSecret}`).toString("base64");
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Basic ${authorization}` },
          body: formData,
          signal: AbortSignal.timeout(45000),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.secure_url) {
          const providerMessage = result.error?.message || "The media provider rejected the upload.";
          return res.status(502).json({ message: providerMessage });
        }

        imageUrl = result.secure_url;
      } finally {
        await removeTemporaryFile(req.file.path);
      }
    } else if (process.env.NODE_ENV === "production") {
      await removeTemporaryFile(req.file.path);
      return res.status(503).json({
        message: "Persistent media storage is not configured. Add Cloudinary credentials to the backend environment.",
      });
    } else {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    if (req.file?.path) await removeTemporaryFile(req.file.path);
    const statusCode = error.message.includes("Cloudinary configuration") ? 503 : 502;
    res.status(statusCode).json({ message: error.message });
  }
};
