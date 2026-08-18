let mockSettings = {
  account: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  },
  learning: {
    preferredLanguage: "English",
    defaultPlaybackSpeed: 1.25,
    autoPlayNextLesson: true,
    resumePlayback: true,
    theme: "System",
    accountVisibility: "Public"
  },
  notifications: {
    courseUpdates: true,
    assignmentNotifications: true,
    quizNotifications: true,
    projectNotifications: true,
    certificateNotifications: true,
    paymentNotifications: false,
    marketingEmails: false
  },
  securitySessions: [
    { id: "s1", device: "Chrome on Windows", location: "San Francisco, US", ipAddress: "192.168.1.1", lastActiveAt: /* @__PURE__ */ new Date(), isCurrent: true },
    { id: "s2", device: "Safari on iPhone", location: "San Francisco, US", ipAddress: "192.168.1.4", lastActiveAt: new Date(Date.now() - 1e3 * 60 * 60 * 24), isCurrent: false }
  ]
};
const getStudentSettings = async (userId) => {
  return mockSettings;
};
const updateSettings = async (userId, type, data) => {
  mockSettings[type] = { ...mockSettings[type], ...data };
  return mockSettings;
};
const logoutAllDevices = async (userId) => {
  mockSettings.securitySessions = mockSettings.securitySessions.filter((s) => s.isCurrent);
  return { success: true };
};
export {
  getStudentSettings,
  logoutAllDevices,
  updateSettings
};
