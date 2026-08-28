import { prisma } from "../../prisma.js";

const helperFormatReview = (r) => {
  return {
    id: r.id,
    reviewId: r.id,
    studentId: r.userId,
    studentName: r.user?.name || "Student",
    studentPhoto: r.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "Student")}&background=random`,
    studentEmail: r.user?.email || "",
    courseId: r.courseId,
    courseName: r.course?.title || "Course",
    category: r.course?.category?.name || "General",
    instructorId: r.course?.instructor?.id || null,
    instructorName: r.course?.instructor?.name || "Instructor",
    rating: r.rating || 5,
    reviewTitle: r.title || (r.rating >= 4 ? "Great course!" : "Course Review"),
    reviewDescription: r.comment || "",
    reviewDate: r.createdAt,
    status: r.status || "Published",
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  };
};

const adminReviewsController = {
  // GET /api/admin/reviews/summary
  getSummary: async (req, res) => {
    try {
      const totalReviews = await prisma.review.count();
      const publishedReviews = await prisma.review.count({ where: { status: "Published" } });
      const hiddenReviews = await prisma.review.count({ where: { status: "Hidden" } });
      
      const aggregate = await prisma.review.aggregate({
        _avg: { rating: true }
      });
      const averageRating = aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0;

      res.status(200).json({
        success: true,
        data: {
          totalReviews,
          averageRating,
          publishedReviews,
          hiddenReviews
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  },

  // GET /api/admin/reviews
  getAllReviews: async (req, res) => {
    try {
      const { courseId, status, rating } = req.query;
      const whereClause = {};

      if (courseId) whereClause.courseId = courseId;
      if (status && status !== "All") whereClause.status = status;
      if (rating && rating !== "All") whereClause.rating = Number(rating);

      const reviews = await prisma.review.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true, email: true, profileImage: true } },
          course: {
            select: {
              id: true,
              title: true,
              category: { select: { name: true } },
              instructor: { select: { id: true, name: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      const formatted = reviews.map(helperFormatReview);
      res.status(200).json({ success: true, data: formatted });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  },

  // GET /api/admin/reviews/:reviewId
  getReviewById: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const r = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
          user: { select: { id: true, name: true, email: true, profileImage: true } },
          course: {
            select: {
              id: true,
              title: true,
              category: { select: { name: true } },
              instructor: { select: { id: true, name: true } }
            }
          }
        }
      });
      if (!r) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }
      res.status(200).json({ success: true, data: helperFormatReview(r) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  },

  // PUT /api/admin/reviews/:reviewId/hide
  hideReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: { status: "Hidden" },
        include: {
          user: { select: { id: true, name: true, email: true, profileImage: true } },
          course: { select: { id: true, title: true } }
        }
      });
      res.status(200).json({ success: true, message: "Review hidden successfully", data: helperFormatReview(updated) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  },

  // PUT /api/admin/reviews/:reviewId/unhide
  unhideReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: { status: "Published" },
        include: {
          user: { select: { id: true, name: true, email: true, profileImage: true } },
          course: { select: { id: true, title: true } }
        }
      });
      res.status(200).json({ success: true, message: "Review published successfully", data: helperFormatReview(updated) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  },

  // DELETE /api/admin/reviews/:reviewId
  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      await prisma.review.delete({
        where: { id: reviewId }
      });
      res.status(200).json({ success: true, message: "Review deleted permanently" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  }
};

export { adminReviewsController };
