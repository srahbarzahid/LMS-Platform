"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCertificatesController = void 0;
// --- MOCK DATABASE ---
let templates = [
    {
        id: 'tpl_1',
        name: 'Standard Completion',
        orientation: 'landscape',
        background: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop',
        description: 'Standard template for course completion.',
        isDefault: true,
        status: 'Active',
        assignedCourses: [],
        fieldPositions: {
            studentName: { x: 50, y: 40, width: 60, height: 10, fontSize: 32, alignment: 'center', visible: true, color: '#000000' },
            courseName: { x: 50, y: 55, width: 80, height: 10, fontSize: 24, alignment: 'center', visible: true, color: '#333333' },
            instructorName: { x: 25, y: 75, width: 30, height: 5, fontSize: 16, alignment: 'left', visible: true, color: '#000000' },
            completionDate: { x: 75, y: 75, width: 30, height: 5, fontSize: 16, alignment: 'right', visible: true, color: '#000000' },
            issueDate: { x: 75, y: 80, width: 30, height: 5, fontSize: 16, alignment: 'right', visible: true, color: '#000000' },
            certificateId: { x: 50, y: 90, width: 40, height: 5, fontSize: 12, alignment: 'center', visible: true, color: '#666666' },
            qrCode: { x: 10, y: 80, width: 15, height: 15, visible: true }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'tpl_2',
        name: 'Premium Honors',
        orientation: 'portrait',
        background: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2829&auto=format&fit=crop',
        description: 'Honors template for exceptional performance.',
        isDefault: false,
        status: 'Draft',
        assignedCourses: [],
        fieldPositions: {
            studentName: { x: 50, y: 35, width: 80, height: 8, fontSize: 36, alignment: 'center', visible: true, color: '#ffffff' },
            courseName: { x: 50, y: 45, width: 80, height: 8, fontSize: 28, alignment: 'center', visible: true, color: '#f0f0f0' },
            instructorName: { x: 50, y: 60, width: 40, height: 5, fontSize: 18, alignment: 'center', visible: true, color: '#ffffff' },
            completionDate: { x: 50, y: 68, width: 40, height: 5, fontSize: 18, alignment: 'center', visible: true, color: '#ffffff' },
            issueDate: { x: 50, y: 72, width: 40, height: 5, fontSize: 18, alignment: 'center', visible: false, color: '#ffffff' },
            certificateId: { x: 50, y: 90, width: 50, height: 4, fontSize: 14, alignment: 'center', visible: true, color: '#dddddd' },
            qrCode: { x: 50, y: 80, width: 20, height: 20, visible: true }
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
];
let issuedCertificates = [
    {
        id: 'cert_1',
        certificateId: 'CERT-101-ABCD',
        studentName: 'Rahul Sharma',
        courseName: 'Advanced Web Development',
        instructorName: 'Sarah Jenkins',
        templateId: 'tpl_1',
        issueDate: new Date().toISOString(),
        completionDate: new Date().toISOString(),
        verificationUrl: 'http://localhost:5173/verify-certificate/CERT-101-ABCD',
        qrCode: 'mock-qr-code-url',
        status: 'Valid',
        createdAt: new Date().toISOString()
    },
    {
        id: 'cert_2',
        certificateId: 'CERT-202-WXYZ',
        studentName: 'Priya Patel',
        courseName: 'UI/UX Design Masterclass',
        instructorName: 'David Chen',
        templateId: 'tpl_1',
        issueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        completionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        verificationUrl: 'http://localhost:5173/verify-certificate/CERT-202-WXYZ',
        qrCode: 'mock-qr-code-url',
        status: 'Revoked',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
];
let verificationLogs = [];
exports.adminCertificatesController = {
    // --- TEMPLATES ---
    getTemplates: async (req, res) => {
        try {
            res.status(200).json({ success: true, data: templates });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getTemplateById: async (req, res) => {
        try {
            const template = templates.find(t => t.id === req.params.id);
            if (!template)
                return res.status(404).json({ success: false, message: 'Template not found' });
            res.status(200).json({ success: true, data: template });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    createTemplate: async (req, res) => {
        try {
            const newTemplate = {
                ...req.body,
                id: `tpl_${Date.now()}`,
                isDefault: templates.length === 0, // Make default if it's the first
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            if (req.body.isDefault) {
                templates.forEach(t => t.isDefault = false);
                newTemplate.isDefault = true;
            }
            templates.push(newTemplate);
            res.status(201).json({ success: true, data: newTemplate });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateTemplate: async (req, res) => {
        try {
            const index = templates.findIndex(t => t.id === req.params.id);
            if (index === -1)
                return res.status(404).json({ success: false, message: 'Template not found' });
            templates[index] = { ...templates[index], ...req.body, updatedAt: new Date().toISOString() };
            res.status(200).json({ success: true, data: templates[index] });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteTemplate: async (req, res) => {
        try {
            const index = templates.findIndex(t => t.id === req.params.id);
            if (index === -1)
                return res.status(404).json({ success: false, message: 'Template not found' });
            if (templates[index].isDefault) {
                return res.status(400).json({ success: false, message: 'Cannot delete the default template' });
            }
            templates.splice(index, 1);
            res.status(200).json({ success: true, message: 'Template deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    setDefaultTemplate: async (req, res) => {
        try {
            const id = req.params.id;
            const index = templates.findIndex(t => t.id === id);
            if (index === -1)
                return res.status(404).json({ success: false, message: 'Template not found' });
            templates.forEach(t => t.isDefault = false);
            templates[index].isDefault = true;
            templates[index].updatedAt = new Date().toISOString();
            res.status(200).json({ success: true, data: templates[index] });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // --- ISSUED CERTIFICATES ---
    getIssuedCertificates: async (req, res) => {
        try {
            res.status(200).json({ success: true, data: issuedCertificates });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getIssuedCertificateById: async (req, res) => {
        try {
            const cert = issuedCertificates.find(c => c.id === req.params.id);
            if (!cert)
                return res.status(404).json({ success: false, message: 'Certificate not found' });
            res.status(200).json({ success: true, data: cert });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    revokeCertificate: async (req, res) => {
        try {
            const { reason } = req.body;
            if (!reason)
                return res.status(400).json({ success: false, message: 'Reason is required' });
            const index = issuedCertificates.findIndex(c => c.id === req.params.id);
            if (index === -1)
                return res.status(404).json({ success: false, message: 'Certificate not found' });
            issuedCertificates[index].status = 'Revoked';
            issuedCertificates[index].revokeReason = reason;
            issuedCertificates[index].revokedAt = new Date().toISOString();
            res.status(200).json({ success: true, data: issuedCertificates[index] });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    downloadCertificate: async (req, res) => {
        try {
            // Mock download logic
            res.status(200).json({ success: true, message: 'PDF generated for download', downloadUrl: '#' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // --- VERIFICATION (Can be accessed publicly usually) ---
    verifyCertificate: async (req, res) => {
        try {
            const { certificateId } = req.params;
            // Searching by certificateId (or potentially student name if extended via query params)
            const cert = issuedCertificates.find(c => c.certificateId === certificateId || String(c.studentName).toLowerCase() === String(certificateId).toLowerCase());
            if (!cert) {
                return res.status(404).json({ success: false, message: 'Certificate not found' });
            }
            verificationLogs.push({
                id: `vlog_${Date.now()}`,
                certificateId: cert.certificateId,
                verifiedAt: new Date().toISOString(),
                ipAddress: req.ip || '127.0.0.1'
            });
            res.status(200).json({ success: true, data: cert });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
