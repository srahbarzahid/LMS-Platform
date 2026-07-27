"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAnnouncementsController = exports.mockAnnouncements = void 0;
// Mock Announcements Data
exports.mockAnnouncements = [
    {
        announcementId: 'ann_1',
        title: 'Platform Maintenance Notice',
        type: 'Maintenance Notice',
        message: 'The LMS platform will undergo scheduled maintenance this Sunday from 2 AM to 4 AM UTC. Access may be temporarily interrupted.',
        audience: 'All Users',
        priority: 'High',
        status: 'Scheduled',
        publishOption: 'Schedule',
        publishDate: new Date('2026-07-15T02:00:00Z'),
        expiryDate: new Date('2026-07-15T04:00:00Z'),
        sendDashboardNotification: true,
        sendEmailNotification: false,
        createdAt: new Date('2026-07-01T10:00:00Z')
    },
    {
        announcementId: 'ann_2',
        title: 'Welcome to the New Fall Semester!',
        type: 'General Announcement',
        message: 'Welcome everyone! We have added 50+ new courses this semester. Check out the catalog.',
        audience: 'All Students',
        priority: 'Medium',
        status: 'Published',
        publishOption: 'Publish Now',
        publishDate: new Date('2026-07-01T08:00:00Z'),
        expiryDate: new Date('2026-12-31T23:59:00Z'),
        sendDashboardNotification: true,
        sendEmailNotification: true,
        createdAt: new Date('2026-06-25T14:30:00Z')
    },
    {
        announcementId: 'ann_3',
        title: 'Instructor Guidelines Update',
        type: 'Important Notice',
        message: 'Please review the updated video quality guidelines before uploading new course content.',
        audience: 'All Instructors',
        priority: 'High',
        status: 'Published',
        publishOption: 'Publish Now',
        publishDate: new Date('2026-07-05T09:00:00Z'),
        expiryDate: null,
        sendDashboardNotification: true,
        sendEmailNotification: true,
        createdAt: new Date('2026-07-04T16:20:00Z')
    },
    {
        announcementId: 'ann_4',
        title: 'ESP32 Course Q&A Session',
        type: 'Event Announcement',
        message: 'Join John Doe for a live Q&A session this Friday at 5 PM. Bring your hardware questions!',
        audience: 'Specific Course Students',
        targetId: 'esp32-mastering',
        priority: 'Medium',
        status: 'Draft',
        publishOption: 'Save Draft',
        publishDate: null,
        expiryDate: null,
        sendDashboardNotification: false,
        sendEmailNotification: false,
        createdAt: new Date('2026-07-08T11:15:00Z')
    }
];
exports.adminAnnouncementsController = {
    // GET /api/admin/announcements/summary
    getSummary: async (req, res) => {
        try {
            const total = exports.mockAnnouncements.length;
            const published = exports.mockAnnouncements.filter(a => a.status === 'Published').length;
            const draft = exports.mockAnnouncements.filter(a => a.status === 'Draft').length;
            const scheduled = exports.mockAnnouncements.filter(a => a.status === 'Scheduled').length;
            res.status(200).json({
                success: true,
                data: {
                    totalAnnouncements: total,
                    publishedAnnouncements: published,
                    draftAnnouncements: draft,
                    scheduledAnnouncements: scheduled
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/announcements
    getAllAnnouncements: async (req, res) => {
        try {
            res.status(200).json({ success: true, data: exports.mockAnnouncements });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/announcements/:announcementId
    getAnnouncementById: async (req, res) => {
        try {
            const { announcementId } = req.params;
            const announcement = exports.mockAnnouncements.find(a => a.announcementId === announcementId);
            if (!announcement) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            res.status(200).json({ success: true, data: announcement });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // POST /api/admin/announcements
    createAnnouncement: async (req, res) => {
        try {
            const newAnnouncement = {
                ...req.body,
                announcementId: `ann_${Date.now()}`,
                createdAt: new Date()
            };
            // Determine Status based on Publish Option
            if (newAnnouncement.publishOption === 'Save Draft') {
                newAnnouncement.status = 'Draft';
            }
            else if (newAnnouncement.publishOption === 'Schedule') {
                newAnnouncement.status = 'Scheduled';
            }
            else {
                newAnnouncement.status = 'Published';
                if (!newAnnouncement.publishDate) {
                    newAnnouncement.publishDate = new Date();
                }
            }
            exports.mockAnnouncements.unshift(newAnnouncement);
            // Simulate Email Notification Dispatch
            if (newAnnouncement.sendEmailNotification) {
                setTimeout(() => {
                    console.log(`[EMAIL SYSTEM] Simulation: Successfully dispatched email for announcement: "${newAnnouncement.title}" to audience: "${newAnnouncement.audience}"`);
                }, 5000);
            }
            res.status(201).json({ success: true, data: newAnnouncement });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // PUT /api/admin/announcements/:announcementId
    updateAnnouncement: async (req, res) => {
        try {
            const { announcementId } = req.params;
            const index = exports.mockAnnouncements.findIndex(a => a.announcementId === announcementId);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            const updatedData = { ...req.body };
            // Update status if publish option changed
            if (updatedData.publishOption === 'Save Draft') {
                updatedData.status = 'Draft';
            }
            else if (updatedData.publishOption === 'Schedule') {
                updatedData.status = 'Scheduled';
            }
            else if (updatedData.publishOption === 'Publish Now') {
                updatedData.status = 'Published';
            }
            exports.mockAnnouncements[index] = { ...exports.mockAnnouncements[index], ...updatedData };
            res.status(200).json({ success: true, data: exports.mockAnnouncements[index] });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // DELETE /api/admin/announcements/:announcementId
    deleteAnnouncement: async (req, res) => {
        try {
            const { announcementId } = req.params;
            exports.mockAnnouncements = exports.mockAnnouncements.filter(a => a.announcementId !== announcementId);
            res.status(200).json({ success: true, message: 'Announcement deleted' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // PUT /api/admin/announcements/:announcementId/publish
    togglePublishStatus: async (req, res) => {
        try {
            const { announcementId } = req.params;
            const index = exports.mockAnnouncements.findIndex(a => a.announcementId === announcementId);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Announcement not found' });
            }
            const currentStatus = exports.mockAnnouncements[index].status;
            let newStatus = 'Published';
            let publishOption = 'Publish Now';
            if (currentStatus === 'Published') {
                newStatus = 'Draft';
                publishOption = 'Save Draft';
            }
            else if (currentStatus === 'Scheduled') {
                newStatus = 'Draft';
                publishOption = 'Save Draft';
            }
            exports.mockAnnouncements[index] = {
                ...exports.mockAnnouncements[index],
                status: newStatus,
                publishOption,
                publishDate: newStatus === 'Published' ? new Date() : exports.mockAnnouncements[index].publishDate
            };
            res.status(200).json({
                success: true,
                message: `Announcement ${newStatus === 'Published' ? 'published' : 'unpublished'} successfully`,
                data: exports.mockAnnouncements[index]
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};
