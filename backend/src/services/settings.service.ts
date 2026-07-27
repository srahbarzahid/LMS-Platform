let mockSettings = {
  account: {
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  },
  learning: {
    preferredLanguage: 'English',
    defaultPlaybackSpeed: 1.25,
    autoPlayNextLesson: true,
    resumePlayback: true,
    theme: 'System',
    accountVisibility: 'Public'
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
    { id: 's1', device: 'Chrome on Windows', location: 'San Francisco, US', ipAddress: '192.168.1.1', lastActiveAt: new Date(), isCurrent: true },
    { id: 's2', device: 'Safari on iPhone', location: 'San Francisco, US', ipAddress: '192.168.1.4', lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24), isCurrent: false }
  ]
};

export const getStudentSettings = async (userId: string) => {
  // In the future: fetch UserSettings, NotificationPreference, SecuritySession from DB
  return mockSettings;
};

export const updateSettings = async (userId: string, type: 'learning' | 'notifications', data: any) => {
  // In the future: update corresponding DB tables
  mockSettings[type] = { ...mockSettings[type], ...data };
  return mockSettings;
};

export const logoutAllDevices = async (userId: string) => {
  mockSettings.securitySessions = mockSettings.securitySessions.filter(s => s.isCurrent);
  return { success: true };
};
