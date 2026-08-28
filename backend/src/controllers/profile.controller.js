import * as profileService from "../services/profile.service.js";

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const profileData = await profileService.getStudentProfile(userId);
    res.json(profileData);
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const profile = await profileService.updateStudentProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Server Error" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body?.avatarUrl || req.body?.profileImage) {
      avatarUrl = req.body.avatarUrl || req.body.profileImage;
    }

    if (!avatarUrl) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const profile = await profileService.uploadAvatar(userId, avatarUrl);
    res.json(profile);
  } catch (error) {
    console.error("updateAvatar error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Server Error" });
  }
};

export {
  getProfile,
  updateAvatar,
  updateProfile
};
