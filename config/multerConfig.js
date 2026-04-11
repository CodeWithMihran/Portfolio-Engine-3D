import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    // 📂 Allowed formats for a 3D Portfolio
    const allowedMimetypes = [
      "image/",         // PNG, JPG, WebP
      "video/",         // MP4, WebM (for your videoDemo textures)
      "model/gltf-binary", // .glb files (Your 3D models)
      "application/octet-stream" // Often used for .glb/.gltf files
    ];

    const isAllowed = allowedMimetypes.some((type) => 
      file.mimetype.startsWith(type) || file.originalname.endsWith('.glb')
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos, and 3D models (.glb) are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // ⬆️ Increased to 50MB because 3D models and videos are heavy
  },
});

export default upload;