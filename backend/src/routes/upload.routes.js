import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = Router();
const uploadThumbnailImage = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to upload file"
    });
  });
};

router.post("/", uploadThumbnailImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to upload file" });
  }
});

export default router;
