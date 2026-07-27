"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
class CertificateService {
    // Mock Data
    static mockCertificates = [
        {
            id: '1',
            studentName: 'Alice Smith',
            studentEmail: 'alice.smith@example.com',
            studentAvatar: 'A',
            courseName: 'UI/UX Masterclass',
            courseId: 'course_1',
            enrollmentDate: '2023-08-15',
            completionDate: '2023-10-24',
            issueDate: '2023-10-24',
            certificateStatus: 'Issued',
            certificateId: 'CERT-104928A',
            templateName: 'Modern Pro',
            qrVerification: 'Verified'
        },
        {
            id: '2',
            studentName: 'Bob Johnson',
            studentEmail: 'bob.j@example.com',
            studentAvatar: 'B',
            courseName: 'React Architecture',
            courseId: 'course_2',
            enrollmentDate: '2023-09-01',
            completionDate: null,
            issueDate: null,
            certificateStatus: 'Pending',
            certificateId: 'N/A',
            templateName: 'Standard',
            qrVerification: 'N/A'
        },
        {
            id: '3',
            studentName: 'Charlie Brown',
            studentEmail: 'charlie.b@example.com',
            studentAvatar: 'C',
            courseName: 'React Architecture',
            courseId: 'course_2',
            enrollmentDate: '2023-09-10',
            completionDate: '2023-10-15',
            issueDate: '2023-10-15',
            certificateStatus: 'Issued',
            certificateId: 'CERT-847291B',
            templateName: 'Standard',
            qrVerification: 'Verified'
        },
        {
            id: '4',
            studentName: 'Diana Prince',
            studentEmail: 'diana.p@example.com',
            studentAvatar: 'D',
            courseName: 'Digital Marketing Pro',
            courseId: 'course_3',
            enrollmentDate: '2023-08-01',
            completionDate: '2023-09-10',
            issueDate: null,
            certificateStatus: 'Eligible',
            certificateId: 'N/A',
            templateName: 'Modern Pro',
            qrVerification: 'N/A'
        }
    ];
    static mockProgress = {
        lessons: { completed: 24, total: 24 },
        quizzes: { completed: 4, total: 4 },
        assignments: { completed: 2, total: 2 },
        projects: { completed: 1, total: 1 },
        overall: 100
    };
    static mockTimeline = [
        { id: 1, title: 'Course Enrolled', date: '2023-08-15 09:00 AM', status: 'completed' },
        { id: 2, title: 'Lessons Completed', date: '2023-10-20 14:30 PM', status: 'completed' },
        { id: 3, title: 'Quiz Completed', date: '2023-10-21 11:15 AM', status: 'completed' },
        { id: 4, title: 'Assignment Submitted', date: '2023-10-22 16:45 PM', status: 'completed' },
        { id: 5, title: 'Project Submitted', date: '2023-10-23 10:00 AM', status: 'completed' },
        { id: 6, title: 'Course Completed', date: '2023-10-24 13:20 PM', status: 'completed' },
        { id: 7, title: 'Certificate Generated', date: '2023-10-24 13:25 PM', status: 'completed' }
    ];
    static async getInstructorCertificates(instructorId) {
        return this.mockCertificates;
    }
    static async getCertificateDetails(certificateId, instructorId) {
        const cert = this.mockCertificates.find(c => c.certificateId === certificateId || c.id === certificateId);
        if (!cert)
            return null;
        return cert;
    }
    static async getCertificateProgress(certificateId, instructorId) {
        const cert = this.mockCertificates.find(c => c.certificateId === certificateId || c.id === certificateId);
        if (!cert)
            return null;
        if (cert.certificateStatus === 'Pending') {
            return {
                lessons: { completed: 12, total: 24 },
                quizzes: { completed: 2, total: 4 },
                assignments: { completed: 1, total: 2 },
                projects: { completed: 0, total: 1 },
                overall: 45
            };
        }
        return this.mockProgress;
    }
    static async getCertificateTimeline(certificateId, instructorId) {
        const cert = this.mockCertificates.find(c => c.certificateId === certificateId || c.id === certificateId);
        if (!cert)
            return null;
        if (cert.certificateStatus === 'Pending') {
            return this.mockTimeline.map((item, index) => {
                if (index > 2)
                    return { ...item, status: 'pending', date: null };
                return item;
            });
        }
        return this.mockTimeline;
    }
}
exports.CertificateService = CertificateService;
