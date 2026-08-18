import * as profileService from "../services/profile.service.js";
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const profileData = await profileService.getStudentProfile(userId);
    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const profile = await profileService.updateStudentProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }
    if (!avatarUrl) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const profile = await profileService.uploadAvatar(userId, avatarUrl);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export {
  getProfile,
  updateAvatar,
  updateProfile
};
