"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminReviewsController = void 0;
// In-memory mock data for reviews
let mockReviews = [
    {
        reviewId: 'rev_1',
        studentId: 'st_1',
        studentName: 'Alice Johnson',
        studentPhoto: 'https://i.pravatar.cc/150?u=alice',
        studentEmail: 'alice@example.com',
        courseId: 'c_1',
        courseName: 'Complete Web Development Bootcamp',
        category: 'Development',
        instructorId: 'inst_1',
        instructorName: 'Sarah Smith',
        rating: 5,
        reviewTitle: 'Amazing Course!',
        reviewDescription: 'This course was incredibly detailed and easy to follow. I learned so much about React and Node.js.',
        reviewDate: new Date('2023-10-15T10:30:00Z'),
        status: 'Published',
        createdAt: new Date('2023-10-15T10:30:00Z'),
        updatedAt: new Date('2023-10-15T10:30:00Z')
    },
    {
        reviewId: 'rev_2',
        studentId: 'st_2',
        studentName: 'Bob Smith',
        studentPhoto: 'https://i.pravatar.cc/150?u=bob',
        studentEmail: 'bob@example.com',
        courseId: 'c_2',
        courseName: 'Advanced Data Science',
        category: 'Data Science',
        instructorId: 'inst_2',
        instructorName: 'Dr. John Doe',
        rating: 4,
        reviewTitle: 'Good but challenging',
        reviewDescription: 'The content is great, but some of the machine learning algorithms were explained a bit too fast for beginners.',
        reviewDate: new Date('2023-11-05T14:20:00Z'),
        status: 'Published',
        createdAt: new Date('2023-11-05T14:20:00Z'),
        updatedAt: new Date('2023-11-05T14:20:00Z')
    },
    {
        reviewId: 'rev_3',
        studentId: 'st_3',
        studentName: 'Charlie Brown',
        studentPhoto: 'https://i.pravatar.cc/150?u=charlie',
        studentEmail: 'charlie@example.com',
        courseId: 'c_3',
        courseName: 'UI/UX Design Masterclass',
        category: 'Design',
        instructorId: 'inst_3',
        instructorName: 'Emily Chen',
        rating: 1,
        reviewTitle: 'Terrible quality',
        reviewDescription: 'This is spam content. Do not buy this course. The instructor is terrible.',
        reviewDate: new Date('2023-12-01T09:15:00Z'),
        status: 'Hidden',
        createdAt: new Date('2023-12-01T09:15:00Z'),
        updatedAt: new Date('2023-12-02T10:00:00Z')
    },
    {
        reviewId: 'rev_4',
        studentId: 'st_4',
        studentName: 'Diana Prince',
        studentPhoto: 'https://i.pravatar.cc/150?u=diana',
        studentEmail: 'diana@example.com',
        courseId: 'c_1',
        courseName: 'Complete Web Development Bootcamp',
        category: 'Development',
        instructorId: 'inst_1',
        instructorName: 'Sarah Smith',
        rating: 5,
        reviewTitle: 'Best bootcamp ever',
        reviewDescription: 'I got a job right after finishing this bootcamp. Highly recommend to everyone.',
        reviewDate: new Date('2024-01-10T11:45:00Z'),
        status: 'Published',
        createdAt: new Date('2024-01-10T11:45:00Z'),
        updatedAt: new Date('2024-01-10T11:45:00Z')
    },
    {
        reviewId: 'rev_5',
        studentId: 'st_5',
        studentName: 'Ethan Hunt',
        studentPhoto: 'https://i.pravatar.cc/150?u=ethan',
        studentEmail: 'ethan@example.com',
        courseId: 'esp32-mastering',
        courseName: 'Mastering ESP32 for Advanced IoT Projects',
        category: 'IoT & Robotics',
        instructorId: 'inst_4',
        instructorName: 'John Doe',
        rating: 5,
        reviewTitle: 'Exceptional IoT Course',
        reviewDescription: 'The hands-on projects were incredible. I successfully built the smart weather station and it works flawlessly.',
        reviewDate: new Date('2024-02-15T14:30:00Z'),
        status: 'Published',
        createdAt: new Date('2024-02-15T14:30:00Z'),
        updatedAt: new Date('2024-02-15T14:30:00Z')
    },
    {
        reviewId: 'rev_6',
        studentId: 'st_6',
        studentName: 'Fiona Gallagher',
        studentPhoto: 'https://i.pravatar.cc/150?u=fiona',
        studentEmail: 'fiona@example.com',
        courseId: 'esp32-mastering',
        courseName: 'Mastering ESP32 for Advanced IoT Projects',
        category: 'IoT & Robotics',
        instructorId: 'inst_4',
        instructorName: 'John Doe',
        rating: 4,
        reviewTitle: 'Great for intermediates',
        reviewDescription: 'Lots of good content, though the MQTT section was a bit rushed. Overall highly recommended for IoT enthusiasts.',
        reviewDate: new Date('2024-03-20T09:15:00Z'),
        status: 'Published',
        createdAt: new Date('2024-03-20T09:15:00Z'),
        updatedAt: new Date('2024-03-20T09:15:00Z')
    },
    {
        reviewId: 'rev_7',
        studentId: 'st_7',
        studentName: 'George Costanza',
        studentPhoto: 'https://i.pravatar.cc/150?u=george',
        studentEmail: 'george@example.com',
        courseId: 'esp32-mastering',
        courseName: 'Mastering ESP32 for Advanced IoT Projects',
        category: 'IoT & Robotics',
        instructorId: 'inst_4',
        instructorName: 'John Doe',
        rating: 5,
        reviewTitle: 'Exactly what I needed',
        reviewDescription: 'I needed to learn ESP32 for a work project and this bootcamp covered everything from basic GPIO to cloud integration perfectly.',
        reviewDate: new Date('2024-04-10T16:45:00Z'),
        status: 'Published',
        createdAt: new Date('2024-04-10T16:45:00Z'),
        updatedAt: new Date('2024-04-10T16:45:00Z')
    },
    {
        reviewId: 'rev_8',
        studentId: 'st_8',
        studentName: 'Hannah Abbott',
        studentPhoto: 'https://i.pravatar.cc/150?u=hannah',
        studentEmail: 'hannah@example.com',
        courseId: 'c_2',
        courseName: 'Advanced Data Science',
        category: 'Data Science',
        instructorId: 'inst_2',
        instructorName: 'Dr. John Doe',
        rating: 5,
        reviewTitle: 'Comprehensive and deep',
        reviewDescription: 'The section on neural networks was exactly what I needed for my thesis.',
        reviewDate: new Date('2024-05-01T10:00:00Z'),
        status: 'Published',
        createdAt: new Date('2024-05-01T10:00:00Z'),
        updatedAt: new Date('2024-05-01T10:00:00Z')
    },
    {
        reviewId: 'rev_9',
        studentId: 'st_9',
        studentName: 'Ian Malcolm',
        studentPhoto: 'https://i.pravatar.cc/150?u=ian',
        studentEmail: 'ian@example.com',
        courseId: 'c_1',
        courseName: 'Complete Web Development Bootcamp',
        category: 'Development',
        instructorId: 'inst_1',
        instructorName: 'Sarah Smith',
        rating: 3,
        reviewTitle: 'A bit outdated',
        reviewDescription: 'Good concepts, but some of the React hooks syntax feels a bit old.',
        reviewDate: new Date('2024-05-15T11:20:00Z'),
        status: 'Published',
        createdAt: new Date('2024-05-15T11:20:00Z'),
        updatedAt: new Date('2024-05-15T11:20:00Z')
    },
    {
        reviewId: 'rev_10',
        studentId: 'st_10',
        studentName: 'Julia Roberts',
        studentPhoto: 'https://i.pravatar.cc/150?u=julia',
        studentEmail: 'julia@example.com',
        courseId: 'c_3',
        courseName: 'UI/UX Design Masterclass',
        category: 'Design',
        instructorId: 'inst_3',
        instructorName: 'Emily Chen',
        rating: 5,
        reviewTitle: 'Changed my career',
        reviewDescription: 'I transitioned from marketing to UX design purely because of this masterclass.',
        reviewDate: new Date('2024-06-05T09:30:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-05T09:30:00Z'),
        updatedAt: new Date('2024-06-05T09:30:00Z')
    },
    {
        reviewId: 'rev_11',
        studentId: 'st_11',
        studentName: 'Kevin Hart',
        studentPhoto: 'https://i.pravatar.cc/150?u=kevin',
        studentEmail: 'kevin@example.com',
        courseId: 'esp32-mastering',
        courseName: 'Mastering ESP32 for Advanced IoT Projects',
        category: 'IoT & Robotics',
        instructorId: 'inst_4',
        instructorName: 'John Doe',
        rating: 5,
        reviewTitle: 'So much fun!',
        reviewDescription: 'I loved building the home automation project. My lights are all connected now.',
        reviewDate: new Date('2024-06-10T14:45:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-10T14:45:00Z'),
        updatedAt: new Date('2024-06-10T14:45:00Z')
    },
    {
        reviewId: 'rev_12',
        studentId: 'st_12',
        studentName: 'Laura Palmer',
        studentPhoto: 'https://i.pravatar.cc/150?u=laura',
        studentEmail: 'laura@example.com',
        courseId: 'c_1',
        courseName: 'Complete Web Development Bootcamp',
        category: 'Development',
        instructorId: 'inst_1',
        instructorName: 'Sarah Smith',
        rating: 4,
        reviewTitle: 'Solid Foundation',
        reviewDescription: 'Gives a very solid foundation. Sometimes pacing is slow, but good overall.',
        reviewDate: new Date('2024-06-12T09:00:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-12T09:00:00Z'),
        updatedAt: new Date('2024-06-12T09:00:00Z')
    },
    {
        reviewId: 'rev_13',
        studentId: 'st_13',
        studentName: 'Michael Scott',
        studentPhoto: 'https://i.pravatar.cc/150?u=michael',
        studentEmail: 'michael@example.com',
        courseId: 'c_2',
        courseName: 'Advanced Data Science',
        category: 'Data Science',
        instructorId: 'inst_2',
        instructorName: 'Dr. John Doe',
        rating: 2,
        reviewTitle: 'Too complex',
        reviewDescription: 'I thought this would be easier. The math went way over my head.',
        reviewDate: new Date('2024-06-15T10:15:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-15T10:15:00Z'),
        updatedAt: new Date('2024-06-15T10:15:00Z')
    },
    {
        reviewId: 'rev_14',
        studentId: 'st_14',
        studentName: 'Nina Williams',
        studentPhoto: 'https://i.pravatar.cc/150?u=nina',
        studentEmail: 'nina@example.com',
        courseId: 'c_3',
        courseName: 'UI/UX Design Masterclass',
        category: 'Design',
        instructorId: 'inst_3',
        instructorName: 'Emily Chen',
        rating: 5,
        reviewTitle: 'Amazing visuals',
        reviewDescription: 'Emily is a fantastic teacher. My Figma skills skyrocketed.',
        reviewDate: new Date('2024-06-18T14:20:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-18T14:20:00Z'),
        updatedAt: new Date('2024-06-18T14:20:00Z')
    },
    {
        reviewId: 'rev_15',
        studentId: 'st_15',
        studentName: 'Oscar Martinez',
        studentPhoto: 'https://i.pravatar.cc/150?u=oscar',
        studentEmail: 'oscar@example.com',
        courseId: 'esp32-mastering',
        courseName: 'Mastering ESP32 for Advanced IoT Projects',
        category: 'IoT & Robotics',
        instructorId: 'inst_4',
        instructorName: 'John Doe',
        rating: 5,
        reviewTitle: 'Very detailed hardware guides',
        reviewDescription: 'The wiring diagrams were super clear. I did not burn a single board!',
        reviewDate: new Date('2024-06-20T16:00:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-20T16:00:00Z'),
        updatedAt: new Date('2024-06-20T16:00:00Z')
    },
    {
        reviewId: 'rev_16',
        studentId: 'st_16',
        studentName: 'Pam Beesly',
        studentPhoto: 'https://i.pravatar.cc/150?u=pam',
        studentEmail: 'pam@example.com',
        courseId: 'c_3',
        courseName: 'UI/UX Design Masterclass',
        category: 'Design',
        instructorId: 'inst_3',
        instructorName: 'Emily Chen',
        rating: 4,
        reviewTitle: 'Inspiring course',
        reviewDescription: 'Really helped me build a portfolio. Would love more focus on typography.',
        reviewDate: new Date('2024-06-22T11:45:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-22T11:45:00Z'),
        updatedAt: new Date('2024-06-22T11:45:00Z')
    },
    {
        reviewId: 'rev_17',
        studentId: 'st_17',
        studentName: 'Quinn Fabray',
        studentPhoto: 'https://i.pravatar.cc/150?u=quinn',
        studentEmail: 'quinn@example.com',
        courseId: 'c_1',
        courseName: 'Complete Web Development Bootcamp',
        category: 'Development',
        instructorId: 'inst_1',
        instructorName: 'Sarah Smith',
        rating: 1,
        reviewTitle: 'Scam',
        reviewDescription: 'This is completely ripped off from youtube videos. DO NOT BUY.',
        reviewDate: new Date('2024-06-25T08:30:00Z'),
        status: 'Hidden',
        createdAt: new Date('2024-06-25T08:30:00Z'),
        updatedAt: new Date('2024-06-25T08:30:00Z')
    },
    {
        reviewId: 'rev_18',
        studentId: 'st_18',
        studentName: 'Rachel Green',
        studentPhoto: 'https://i.pravatar.cc/150?u=rachel',
        studentEmail: 'rachel@example.com',
        courseId: 'c_2',
        courseName: 'Advanced Data Science',
        category: 'Data Science',
        instructorId: 'inst_2',
        instructorName: 'Dr. John Doe',
        rating: 5,
        reviewTitle: 'Helped me get into tech',
        reviewDescription: 'I was in fashion, now I am doing data analysis. This course changed my life!',
        reviewDate: new Date('2024-06-28T10:15:00Z'),
        status: 'Published',
        createdAt: new Date('2024-06-28T10:15:00Z'),
        updatedAt: new Date('2024-06-28T10:15:00Z')
    },
    {
        reviewId: 'rev_19',
        studentId: 'st_19',
        studentName: 'Steve Harrington',
        studentPhoto: 'https://i.pravatar.cc/150?u=steve',
        studentEmail: 'steve@example.com',
        courseId: 'esp32-mastering',
        courseName: 'Mastering ESP32 for Advanced IoT Projects',
        category: 'IoT & Robotics',
        instructorId: 'inst_4',
        instructorName: 'John Doe',
        rating: 4,
        reviewTitle: 'Pretty gnarly course',
        reviewDescription: 'Took a while to get the C++ syntax down, but the projects are cool.',
        reviewDate: new Date('2024-07-01T15:20:00Z'),
        status: 'Published',
        createdAt: new Date('2024-07-01T15:20:00Z'),
        updatedAt: new Date('2024-07-01T15:20:00Z')
    },
    {
        reviewId: 'rev_20',
        studentId: 'st_20',
        studentName: 'Tom Haverford',
        studentPhoto: 'https://i.pravatar.cc/150?u=tom',
        studentEmail: 'tom@example.com',
        courseId: 'c_1',
        courseName: 'Complete Web Development Bootcamp',
        category: 'Development',
        instructorId: 'inst_1',
        instructorName: 'Sarah Smith',
        rating: 5,
        reviewTitle: 'Dope tech skills',
        reviewDescription: 'Im making an app for my new business. This course was exactly what I needed to become a tech mogul.',
        reviewDate: new Date('2024-07-05T12:00:00Z'),
        status: 'Published',
        createdAt: new Date('2024-07-05T12:00:00Z'),
        updatedAt: new Date('2024-07-05T12:00:00Z')
    }
];
exports.adminReviewsController = {
    // GET /api/admin/reviews/summary
    getSummary: async (req, res) => {
        try {
            const totalReviews = mockReviews.length;
            const publishedReviews = mockReviews.filter(r => r.status === 'Published').length;
            const hiddenReviews = mockReviews.filter(r => r.status === 'Hidden').length;
            const totalRating = mockReviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
            res.status(200).json({
                success: true,
                data: {
                    totalReviews,
                    averageRating: Number(averageRating),
                    publishedReviews,
                    hiddenReviews
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/reviews
    getAllReviews: async (req, res) => {
        try {
            let filteredReviews = mockReviews;
            if (req.query.courseId) {
                filteredReviews = filteredReviews.filter(r => r.courseId === req.query.courseId);
            }
            // In a real app, we'd handle pagination, sorting, and other filtering here
            res.status(200).json({ success: true, data: filteredReviews });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // GET /api/admin/reviews/:reviewId
    getReviewById: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const review = mockReviews.find(r => r.reviewId === reviewId);
            if (!review) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }
            res.status(200).json({ success: true, data: review });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // PUT /api/admin/reviews/:reviewId/hide
    hideReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const reviewIndex = mockReviews.findIndex(r => r.reviewId === reviewId);
            if (reviewIndex === -1) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }
            mockReviews[reviewIndex].status = 'Hidden';
            mockReviews[reviewIndex].updatedAt = new Date();
            res.status(200).json({ success: true, message: 'Review hidden successfully', data: mockReviews[reviewIndex] });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // PUT /api/admin/reviews/:reviewId/unhide
    unhideReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const reviewIndex = mockReviews.findIndex(r => r.reviewId === reviewId);
            if (reviewIndex === -1) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }
            mockReviews[reviewIndex].status = 'Published';
            mockReviews[reviewIndex].updatedAt = new Date();
            res.status(200).json({ success: true, message: 'Review published successfully', data: mockReviews[reviewIndex] });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    // DELETE /api/admin/reviews/:reviewId
    deleteReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const reviewIndex = mockReviews.findIndex(r => r.reviewId === reviewId);
            if (reviewIndex === -1) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }
            mockReviews.splice(reviewIndex, 1);
            res.status(200).json({ success: true, message: 'Review deleted permanently' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};
