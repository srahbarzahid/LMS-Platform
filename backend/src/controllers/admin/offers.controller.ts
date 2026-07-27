import { Request, Response } from 'express';

// Mock Data
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
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z',
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
    createdAt: '2024-06-10T11:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
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
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '4',
    name: 'Flash Sale',
    code: 'FLASH90',
    offerType: 'Coupon Code',
    discountType: 'Percentage',
    discountValue: 90,
    applicableType: 'All Courses',
    targetId: null,
    targetName: 'All Courses',
    minimumPurchaseAmount: null,
    maximumDiscountAmount: 5000,
    usageLimit: 50,
    usedCount: 50,
    usagePerStudent: 1,
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-05-02T23:59:59Z',
    status: 'Expired',
    createdAt: '2024-04-28T09:00:00Z',
    updatedAt: '2024-04-28T09:00:00Z',
  }
];

export const adminOffersController = {
  // Get all offers
  getOffers: async (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        data: offers,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get single offer by ID
  getOfferById: async (req: Request, res: Response) => {
    try {
      const offer = offers.find(o => o.id === req.params.id);
      if (!offer) {
        return res.status(404).json({ success: false, message: 'Offer not found' });
      }

      // Mock Usage History
      const usageHistory = [
        { id: '1', studentName: 'John Doe', courseName: 'Advanced Web Development', originalPrice: 3999, discountAmount: 1999.5, finalAmount: 1999.5, paymentId: 'PAY_123', usedDate: '2024-06-15T14:30:00Z' },
        { id: '2', studentName: 'Jane Smith', courseName: 'Advanced Web Development', originalPrice: 3999, discountAmount: 1999.5, finalAmount: 1999.5, paymentId: 'PAY_124', usedDate: '2024-06-16T09:15:00Z' }
      ];

      res.status(200).json({
        success: true,
        data: {
          ...offer,
          usageHistory
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create new offer
  createOffer: async (req: Request, res: Response) => {
    try {
      const newOffer = {
        id: (offers.length + 1).toString(),
        ...req.body,
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Basic validation
      if (!newOffer.name || !newOffer.offerType || !newOffer.discountType || !newOffer.discountValue) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      offers.push(newOffer);
      res.status(201).json({ success: true, data: newOffer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update offer
  updateOffer: async (req: Request, res: Response) => {
    try {
      const index = offers.findIndex(o => o.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Offer not found' });
      }

      offers[index] = {
        ...offers[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      res.status(200).json({ success: true, data: offers[index] });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete offer
  deleteOffer: async (req: Request, res: Response) => {
    try {
      const index = offers.findIndex(o => o.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Offer not found' });
      }

      offers.splice(index, 1);
      res.status(200).json({ success: true, message: 'Offer deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Activate/Deactivate offer
  toggleStatus: async (req: Request, res: Response) => {
    try {
      const index = offers.findIndex(o => o.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Offer not found' });
      }

      const currentStatus = offers[index].status;
      offers[index].status = currentStatus === 'Active' ? 'Inactive' : 'Active';
      offers[index].updatedAt = new Date().toISOString();

      res.status(200).json({ success: true, data: offers[index] });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
