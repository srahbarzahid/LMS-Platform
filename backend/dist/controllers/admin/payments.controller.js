"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPaymentsController = void 0;
// Mock Data
let mockPayments = Array.from({ length: 45 }).map((_, i) => {
    const statusOptions = ['Paid', 'Paid', 'Paid', 'Pending', 'Failed'];
    const methodOptions = ['Razorpay', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const amount = Math.floor(Math.random() * 5000) + 500;
    return {
        id: `PAY${1000 + i}`,
        studentName: `Student ${i + 1}`,
        studentEmail: `student${i + 1}@example.com`,
        studentPhone: `+91 90000${Math.floor(Math.random() * 90000 + 10000)}`,
        courseName: ['Advanced React', 'Node.js Masterclass', 'UI/UX Fundamentals', 'Data Science Bootcamp'][Math.floor(Math.random() * 4)],
        instructorName: ['Amit Patel', 'Sarah Smith', 'John Doe'][Math.floor(Math.random() * 3)],
        category: ['Web Development', 'Design', 'Data Science'][Math.floor(Math.random() * 3)],
        amount: amount,
        discount: Math.floor(amount * 0.1),
        finalAmount: amount - Math.floor(amount * 0.1),
        paymentMethod: methodOptions[Math.floor(Math.random() * methodOptions.length)],
        paymentGateway: 'Razorpay',
        transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
        status: status,
        paymentDate: date.toISOString(),
        invoiceNumber: `INV-${2026}-${1000 + i}`,
        invoiceDate: date.toISOString(),
        taxAmount: Math.floor((amount - Math.floor(amount * 0.1)) * 0.18)
    };
});
exports.adminPaymentsController = {
    // GET /api/admin/payments
    getPayments: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = (req.query.search || '').toLowerCase();
            const status = req.query.status;
            const method = req.query.method;
            let filtered = [...mockPayments];
            if (search) {
                filtered = filtered.filter(p => p.studentName.toLowerCase().includes(search) ||
                    p.studentEmail.toLowerCase().includes(search) ||
                    p.courseName.toLowerCase().includes(search) ||
                    p.transactionId.toLowerCase().includes(search) ||
                    p.invoiceNumber.toLowerCase().includes(search));
            }
            if (status) {
                filtered = filtered.filter(p => p.status === status);
            }
            if (method) {
                filtered = filtered.filter(p => p.paymentMethod === method);
            }
            // Sort by date descending
            filtered.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
            const total = filtered.length;
            const startIndex = (page - 1) * limit;
            const paginated = filtered.slice(startIndex, startIndex + limit);
            res.status(200).json({
                success: true,
                data: paginated,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        }
        catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/payments/summary
    getPaymentsSummary: async (req, res) => {
        try {
            const successfulPayments = mockPayments.filter(p => p.status === 'Paid');
            const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.finalAmount, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todaysRevenue = successfulPayments
                .filter(p => new Date(p.paymentDate) >= today)
                .reduce((sum, p) => sum + p.finalAmount, 0);
            const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const thisMonthRevenue = successfulPayments
                .filter(p => new Date(p.paymentDate) >= thisMonth)
                .reduce((sum, p) => sum + p.finalAmount, 0);
            const summary = {
                totalRevenue,
                todaysRevenue,
                thisMonthRevenue,
                averageOrderValue: successfulPayments.length ? Math.floor(totalRevenue / successfulPayments.length) : 0,
                totalOrders: mockPayments.length,
                successful: successfulPayments.length,
                pending: mockPayments.filter(p => p.status === 'Pending').length,
                failed: mockPayments.filter(p => p.status === 'Failed').length,
                refunded: mockPayments.filter(p => p.status === 'Refunded').length
            };
            res.status(200).json({ success: true, data: summary });
        }
        catch (error) {
            console.error('Error fetching payments summary:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/payments/revenue
    getPaymentsRevenue: async (req, res) => {
        try {
            // Generate mock monthly data for the chart
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const data = months.slice(0, new Date().getMonth() + 1).map(month => ({
                name: month,
                revenue: Math.floor(Math.random() * 50000) + 10000,
                orders: Math.floor(Math.random() * 100) + 20
            }));
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            console.error('Error fetching revenue data:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/payments/:id
    getPaymentDetails: async (req, res) => {
        try {
            const payment = mockPayments.find(p => p.id === req.params.id);
            if (!payment) {
                return res.status(404).json({ success: false, message: 'Payment not found' });
            }
            res.status(200).json({ success: true, data: payment });
        }
        catch (error) {
            console.error('Error fetching payment details:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/payments/:id/invoice
    getPaymentInvoice: async (req, res) => {
        try {
            const payment = mockPayments.find(p => p.id === req.params.id);
            if (!payment) {
                return res.status(404).json({ success: false, message: 'Payment not found' });
            }
            // Return a simulated invoice object
            res.status(200).json({
                success: true,
                data: {
                    invoiceNumber: payment.invoiceNumber,
                    date: payment.invoiceDate,
                    subtotal: payment.amount,
                    discount: payment.discount,
                    tax: payment.taxAmount,
                    total: payment.finalAmount,
                    billedTo: {
                        name: payment.studentName,
                        email: payment.studentEmail,
                        address: '123 Main St, Tech Park, City'
                    }
                }
            });
        }
        catch (error) {
            console.error('Error fetching invoice:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};
