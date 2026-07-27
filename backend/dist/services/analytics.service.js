"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
class AnalyticsService {
    static getDashboardKPIs() {
        return {
            totalStudents: { value: 1248, growth: '+15%', description: 'vs last month' },
            totalCourses: { value: 12, growth: '+2', description: 'new this month' },
            totalRevenue: { value: '$24,500', growth: '+8%', description: 'vs last month' },
            averageRating: { value: 4.8, growth: '+0.2', description: 'vs last month' },
            courseCompletionRate: { value: '68%', growth: '+5%', description: 'vs last month' },
            certificatesIssued: { value: 845, growth: '+12%', description: 'vs last month' },
            pendingAssignments: { value: 24, description: 'requires action' },
            pendingProjects: { value: 12, description: 'requires action' }
        };
    }
    static getEnrollmentAnalytics() {
        return [
            { date: 'Mon', enrollments: 12, visitors: 45 },
            { date: 'Tue', enrollments: 19, visitors: 60 },
            { date: 'Wed', enrollments: 15, visitors: 50 },
            { date: 'Thu', enrollments: 22, visitors: 70 },
            { date: 'Fri', enrollments: 28, visitors: 85 },
            { date: 'Sat', enrollments: 35, visitors: 110 },
            { date: 'Sun', enrollments: 42, visitors: 130 }
        ];
    }
    static getRevenueAnalytics() {
        return [
            { name: 'UI/UX Masterclass', revenue: 12500 },
            { name: 'React Architecture', revenue: 8500 },
            { name: 'Digital Marketing', revenue: 3500 },
            { name: 'Advanced CSS', revenue: 2100 }
        ];
    }
    static getCourseCompletion() {
        return [
            { name: 'Completed', value: 450, color: '#10B981' },
            { name: 'In Progress', value: 650, color: '#F59E0B' },
            { name: 'Dropped', value: 148, color: '#EF4444' }
        ];
    }
    static getStudentProgress() {
        return [
            { range: '0-25%', students: 250 },
            { range: '26-50%', students: 400 },
            { range: '51-75%', students: 350 },
            { range: '76-100%', students: 248 }
        ];
    }
    static getTopPerformers() {
        return [
            { name: 'UI/UX Masterclass', enrollments: 842, revenue: 12500, rating: 4.9, completion: 75 },
            { name: 'React Architecture', enrollments: 650, revenue: 8500, rating: 4.8, completion: 68 },
            { name: 'Advanced CSS', enrollments: 420, revenue: 2100, rating: 4.7, completion: 82 }
        ];
    }
    static getLowestPerformers() {
        return [
            { name: 'Digital Marketing', enrollments: 120, rating: 3.8, dropRate: '25%', issue: 'High Drop Rate in Module 2' },
            { name: 'Intro to Python', enrollments: 85, rating: 4.1, dropRate: '15%', issue: 'Low Engagement in Assignments' }
        ];
    }
    static getQuizAnalytics() {
        return {
            averageScore: 78,
            passRate: 85,
            failRate: 15,
            totalAttempts: 1250,
            hardestQuiz: 'Module 3: State Management',
            scoreDistribution: [
                { range: '0-40', count: 45 },
                { range: '41-60', count: 120 },
                { range: '61-80', count: 450 },
                { range: '81-100', count: 635 }
            ]
        };
    }
    static getAssignmentAnalytics() {
        return [
            { name: 'Week 1', submitted: 120, pending: 15, graded: 105, late: 5 },
            { name: 'Week 2', submitted: 110, pending: 20, graded: 90, late: 12 },
            { name: 'Week 3', submitted: 95, pending: 45, graded: 50, late: 8 },
            { name: 'Week 4', submitted: 80, pending: 5, graded: 75, late: 15 }
        ];
    }
    static getProjectAnalytics() {
        return [
            { name: 'Submitted', value: 45 },
            { name: 'Under Review', value: 12 },
            { name: 'Approved', value: 28 },
            { name: 'Resubmission Required', value: 5 }
        ];
    }
    static getCertificateAnalytics() {
        return [
            { name: 'Issued', value: 845, color: '#10B981' },
            { name: 'Eligible', value: 120, color: '#06B6D4' },
            { name: 'Pending', value: 45, color: '#F59E0B' }
        ];
    }
    static getRatingsAnalytics() {
        return {
            average: 4.8,
            distribution: [
                { stars: 5, count: 850 },
                { stars: 4, count: 250 },
                { stars: 3, count: 50 },
                { stars: 2, count: 15 },
                { stars: 1, count: 5 }
            ]
        };
    }
    static getLearningTime() {
        return [
            { date: 'Mon', hours: 450 },
            { date: 'Tue', hours: 520 },
            { date: 'Wed', hours: 480 },
            { date: 'Thu', hours: 610 },
            { date: 'Fri', hours: 590 },
            { date: 'Sat', hours: 850 },
            { date: 'Sun', hours: 920 }
        ];
    }
    static getLessonAnalytics() {
        return {
            mostViewed: [
                { name: 'Introduction to React', views: 1250, avgDuration: '12:45' },
                { name: 'Understanding Hooks', views: 1100, avgDuration: '18:20' }
            ],
            leastViewed: [
                { name: 'Advanced Redux Patterns', views: 150, avgDuration: '4:15' },
                { name: 'Testing Components', views: 210, avgDuration: '5:30' }
            ],
            dropoff: [
                { step: 'Lesson 1', users: 1000 },
                { step: 'Lesson 2', users: 950 },
                { step: 'Lesson 3', users: 800 },
                { step: 'Lesson 4', users: 650 },
                { step: 'Lesson 5', users: 500 }
            ]
        };
    }
    static getDeviceAnalytics() {
        return [
            { name: 'Desktop', value: 65, color: '#3b82f6' },
            { name: 'Mobile', value: 25, color: '#10b981' },
            { name: 'Tablet', value: 10, color: '#f59e0b' }
        ];
    }
    static getCategoryAnalytics() {
        return [
            { name: 'Frontend Dev', enrollments: 1250 },
            { name: 'Backend Dev', enrollments: 850 },
            { name: 'UI/UX Design', enrollments: 640 },
            { name: 'Mobile Dev', enrollments: 420 },
            { name: 'Data Science', enrollments: 210 }
        ];
    }
    static getActivityHeatmap() {
        // Generate dummy heatmap data for 3 months
        const data = [];
        const now = new Date();
        for (let i = 0; i < 90; i++) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            data.push({
                date: d.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 50)
            });
        }
        return data.reverse();
    }
    static getRecentActivity() {
        return [
            { id: 1, type: 'enrollment', message: 'John enrolled in UI/UX Masterclass', time: '10 mins ago', icon: 'UserPlus' },
            { id: 2, type: 'completion', message: 'Sarah passed React Architecture Quiz', time: '1 hour ago', icon: 'CheckCircle' },
            { id: 3, type: 'submission', message: 'Rahul submitted Final Project', time: '2 hours ago', icon: 'FileText' },
            { id: 4, type: 'certificate', message: 'Certificate Generated for Diana Prince', time: '3 hours ago', icon: 'Award' }
        ];
    }
    static getCourseInsights() {
        return [
            { type: 'positive', message: 'Enrollment increased by 18% compared to last week.', highlight: '+18%' },
            { type: 'warning', message: 'Course completion dropped by 5% in "Advanced CSS".', highlight: '-5%' },
            { type: 'action', message: 'You have 24 assignments waiting for review.', highlight: '24 Pending' },
            { type: 'info', message: 'Students spend most time on "Module 3: State Management".', highlight: 'Most Time' },
            { type: 'negative', message: 'Lesson 5 in React Architecture has the highest drop rate.', highlight: 'Drop Risk' }
        ];
    }
}
exports.AnalyticsService = AnalyticsService;
