import * as notificationService from "../services/notification.service.js";
const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const notifications = await notificationService.getStudentNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const markAsRead = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const { id } = req.params;
    const notification = await notificationService.markAsRead(userId, id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const result = await notificationService.markAllAsRead(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user?.userId || "mock";
    const { id } = req.params;
    const result = await notificationService.deleteNotification(userId, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead
};
