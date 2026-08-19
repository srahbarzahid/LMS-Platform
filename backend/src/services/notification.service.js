import { prisma } from "../prisma.js";

const getStudentNotifications = async (userId) => {
  if (!userId) return [];
  const dbNotifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return dbNotifications.map((n) => ({
    id: n.id,
    userId: n.userId,
    title: n.title,
    message: n.message,
    category: n.category || "Announcement",
    type: n.type || "Instructor Announcement",
    relatedId: n.relatedId || n.id,
    relatedType: n.relatedType || "Notification",
    isRead: Boolean(n.isRead),
    createdAt: n.createdAt,
    updatedAt: n.updatedAt
  }));
};

const markAsRead = async (userId, notificationId) => {
  const existing = await prisma.notification.findFirst({
    where: { id: notificationId, userId }
  });
  if (!existing) return null;
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
};

const markAllAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  return { success: true };
};

const deleteNotification = async (userId, notificationId) => {
  await prisma.notification.deleteMany({
    where: { id: notificationId, userId }
  });
  return { success: true };
};

export {
  deleteNotification,
  getStudentNotifications,
  markAllAsRead,
  markAsRead
};
