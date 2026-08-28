import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")
  : path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("Upload directory creation skipped:", err.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const blockedMediaPrefixes = ["video/", "audio/"];

const safeResourceFileFilter = (req, file, cb) => {
  const mimetype = file.mimetype || "";
  if (!blockedMediaPrefixes.some((prefix) => mimetype.startsWith(prefix))) {
    cb(null, true);
    return;
  }

  const error = new Error("Video and audio uploads are not stored by this platform yet. Use hosted video URLs instead.");
  error.statusCode = 415;
  cb(error);
};

const upload = multer({
  storage,
  fileFilter: safeResourceFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export { upload };
