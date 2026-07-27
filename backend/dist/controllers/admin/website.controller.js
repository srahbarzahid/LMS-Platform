"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminWebsiteController = void 0;
// In-memory mock data for website content
let mockWebsiteContent = {
    hero: {
        headline: 'Learn the Skills of Tomorrow',
        subtitle: 'Join thousands of students learning cutting-edge technology and business skills from industry experts.',
        ctaText: 'Browse Courses',
        ctaLink: '/courses'
    },
    footer: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        contactEmail: 'support@lms.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Tech Valley, Silicon City, SC 90210'
    },
    faqs: [
        {
            id: '1',
            question: 'How do I access my purchased courses?',
            answer: 'Once you purchase a course, you can access it anytime from your Student Dashboard under the "My Courses" section.'
        },
        {
            id: '2',
            question: 'Do I get a certificate upon completion?',
            answer: 'Yes! All of our paid courses come with a verifiable digital certificate upon successful completion of the curriculum.'
        },
        {
            id: '3',
            question: 'What payment methods are accepted?',
            answer: 'We accept all major credit cards, PayPal, and regional payment gateways depending on your location.'
        }
    ]
};
exports.adminWebsiteController = {
    // GET /api/admin/content
    getWebsiteContent: async (req, res) => {
        try {
            res.status(200).json({ success: true, data: mockWebsiteContent });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // PUT /api/admin/content
    updateWebsiteContent: async (req, res) => {
        try {
            const { hero, footer, faqs } = req.body;
            if (hero)
                mockWebsiteContent.hero = hero;
            if (footer)
                mockWebsiteContent.footer = footer;
            if (faqs)
                mockWebsiteContent.faqs = faqs;
            res.status(200).json({ success: true, message: 'Website content updated successfully', data: mockWebsiteContent });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};
