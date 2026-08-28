import { prisma } from "../prisma.js";

// POST /api/reviews - Create a review for a course
export const createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId, rating, title, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required to submit a review." });
    }
    if (!courseId || !rating) {
      return res.status(400).json({ success: false, message: "Course ID and rating (1-5) are required." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5." });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // Check if user has already reviewed this course, if so update it!
    const existing = await prisma.review.findFirst({
      where: { userId, courseId }
    });

    let review;
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: numRating,
          title: title || existing.title,
          comment: comment || existing.comment,
          status: "Published"
        },
        include: {
          user: { select: { id: true, name: true, email: true, profileImage: true } },
          course: { select: { id: true, title: true } }
        }
      });
    } else {
      review = await prisma.review.create({
        data: {
          userId,
          courseId,
          rating: numRating,
          title: title || (numRating >= 4 ? "Great course!" : "Course Review"),
          comment: comment || "",
          status: "Published"
        },
        include: {
          user: { select: { id: true, name: true, email: true, profileImage: true } },
          course: { select: { id: true, title: true } }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: {
        id: review.id,
        reviewId: review.id,
        studentName: review.user?.name || "Student",
        studentPhoto: review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || "Student")}&background=random`,
        rating: review.rating,
        reviewTitle: review.title,
        reviewDescription: review.comment,
        reviewDate: review.createdAt,
        status: review.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// GET /api/reviews - Get reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.query;
    const whereClause = { status: "Published" };
    if (courseId) whereClause.courseId = courseId;

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, profileImage: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const total = reviews.length;
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = total > 0 ? Number((ratingSum / total).toFixed(1)) : 0;

    const breakdown = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length
    };

    const formatted = reviews.map((r) => ({
      id: r.id,
      reviewId: r.id,
      studentName: r.user?.name || "Student",
      studentPhoto: r.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "Student")}&background=random`,
      rating: r.rating,
      reviewTitle: r.title || (r.rating >= 4 ? "Great course!" : "Course Review"),
      reviewDescription: r.comment || "",
      reviewDate: r.createdAt,
      status: r.status
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      stats: {
        total,
        averageRating,
        breakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
