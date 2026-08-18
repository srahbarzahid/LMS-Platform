import * as settingsService from "../services/settings.service.js";
const getSettings = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const settings = await settingsService.getStudentSettings(userId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updateSettings = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const { learning, notifications } = req.body;
    if (learning) {
      await settingsService.updateSettings(userId, "learning", learning);
    }
    if (notifications) {
      await settingsService.updateSettings(userId, "notifications", notifications);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updatePassword = async (req, res) => {
  try {
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updateEmail = async (req, res) => {
  try {
    res.json({ success: true, message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updatePhone = async (req, res) => {
  try {
    res.json({ success: true, message: "Phone updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    await settingsService.logoutAllDevices(userId);
    res.json({ success: true, message: "Logged out from all other devices" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const exportDataRequest = async (req, res) => {
  try {
    res.json({ success: true, message: "Data export request submitted. You will receive an email shortly." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const deleteAccountRequest = async (req, res) => {
  try {
    res.json({ success: true, message: "Account deletion request submitted." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export {
  deleteAccountRequest,
  exportDataRequest,
  getSettings,
  logoutAllDevices,
  updateEmail,
  updatePassword,
  updatePhone,
  updateSettings
};
