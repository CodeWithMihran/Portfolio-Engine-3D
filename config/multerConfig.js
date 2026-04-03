// config/multerConfig.js
import multer from "multer";

// Memory storage (for now, you can later switch to disk or cloud storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;