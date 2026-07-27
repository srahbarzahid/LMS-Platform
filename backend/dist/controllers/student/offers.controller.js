"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentOffersController = void 0;
// Mock Data (Shared concept with admin for now)
let offers = [
    {
        id: '1',
        name: 'Summer Sale 2024',
        code: 'SUMMER50',
        offerType: 'Course Offer',
        discountType: 'Percentage',
        discountValue: 50,
        applicableType: 'Course',
        targetId: 'course_1',
        targetName: 'Advanced Web Development',
        minimumPurchaseAmount: null,
        maximumDiscountAmount: 2000,
        usageLimit: 100,
        usedCount: 45,
        usagePerStudent: 1,
        startDate: '2024-06-01T00:00:00Z',
        endDate: '2024-08-31T23:59:59Z',
        status: 'Active',
    },
    {
        id: '2',
        name: 'Cyber Security Month',
        code: '',
        offerType: 'Category Offer',
        discountType: 'Fixed Amount',
        discountValue: 500,
        applicableType: 'Category',
        targetId: 'cat_cyber',
        targetName: 'Cyber Security',
        minimumPurchaseAmount: 1000,
        maximumDiscountAmount: null,
        usageLimit: null,
        usedCount: 120,
        usagePerStudent: null,
        startDate: '2024-10-01T00:00:00Z',
        endDate: '2024-10-31T23:59:59Z',
        status: 'Scheduled',
    },
    {
        id: '3',
        name: 'Welcome Bonus',
        code: 'WELCOME20',
        offerType: 'Coupon Code',
        discountType: 'Percentage',
        discountValue: 20,
        applicableType: 'All Courses',
        targetId: null,
        targetName: 'All Courses',
        minimumPurchaseAmount: null,
        maximumDiscountAmount: 1000,
        usageLimit: null,
        usedCount: 1540,
        usagePerStudent: 1,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'Active',
    }
];
exports.studentOffersController = {
    // Get automatic offers
    getAutomaticOffers: async (req, res) => {
        try {
            const automaticOffers = offers.filter((o) => (o.offerType === 'Course Offer' || o.offerType === 'Category Offer') && o.status === 'Active');
            res.status(200).json({
                success: true,
                data: automaticOffers,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // Validate coupon
    validateCoupon: async (req, res) => {
        try {
            const { code } = req.body;
            if (!code) {
                return res.status(400).json({ success: false, message: 'Coupon code is required' });
            }
            const offer = offers.find((o) => o.code === code.toUpperCase() && o.offerType === 'Coupon Code');
            if (!offer) {
                return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
            }
            if (offer.status !== 'Active') {
                return res.status(400).json({ success: false, message: 'This coupon is not active' });
            }
            res.status(200).json({
                success: true,
                data: offer,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};
