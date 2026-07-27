// Mock data representing the future Prisma Database response
let mockNotifications = [
  {
    id: 'n1',
    userId: 'user123',
    title: 'Assignment Graded',
    message: 'Your assignment "Build a Weather Station" has been graded. You received 95/100.',
    category: 'Assignments',
    type: 'Graded',
    relatedId: '101',
    relatedType: 'ProjectSubmission',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date()
  },
  {
    id: 'n2',
    userId: 'user123',
    title: 'New Course Available',
    message: 'A new course "Advanced Robotics" has just been published. Enroll now!',
    category: 'Course Updates',
    type: 'NewCourse',
    relatedId: 'c2',
    relatedType: 'Course',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    updatedAt: new Date()
  },
  {
    id: 'n3',
    userId: 'user123',
    title: 'Certificate Earned',
    message: 'Congratulations! You have earned a certificate for IoT Fundamentals.',
    category: 'Certificates',
    type: 'Issued',
    relatedId: 'CERT-IOT-123456',
    relatedType: 'Certificate',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    updatedAt: new Date()
  }
];

export const getStudentNotifications = async (userId: string) => {
  // In the future: return await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return mockNotifications.filter(n => n.userId === userId || userId === 'mock'); // Allow any userId for preview
};

export const markAsRead = async (userId: string, notificationId: string) => {
  // In the future: return await prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    mockNotifications[index].isRead = true;
    return mockNotifications[index];
  }
  throw new Error("Notification not found");
};

export const markAllAsRead = async (userId: string) => {
  // In the future: return await prisma.notification.updateMany({ where: { userId }, data: { isRead: true } });
  mockNotifications.forEach(n => n.isRead = true);
  return { success: true };
};

export const deleteNotification = async (userId: string, notificationId: string) => {
  // In the future: return await prisma.notification.delete({ where: { id: notificationId } });
  mockNotifications = mockNotifications.filter(n => n.id !== notificationId);
  return { success: true };
};
