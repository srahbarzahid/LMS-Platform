import { useState, useEffect } from "react";
import {
  Star,
  Search,
  Eye,
  EyeOff,
  Trash2,
  MessageSquare,
  User,
  BookOpen,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiClient, { getApiErrorMessage } from "../../../api/client";

const AdminReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
    publishedReviews: 0,
    hiddenReviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, ratingFilter]);

  const [showHideModal, setShowHideModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [reviewsRes, summaryRes] = await Promise.all([
        apiClient.get("/admin/reviews"),
        apiClient.get("/admin/reviews/summary")
      ]);
      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.data || []);
      }
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load reviews"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedReview) return;
    try {
      const action = selectedReview.status === "Published" ? "hide" : "unhide";
      const res = await apiClient.put(`/admin/reviews/${selectedReview.reviewId}/${action}`);
      if (res.data.success) {
        toast.success(`Review ${action === "hide" ? "hidden" : "published"} successfully`);
        fetchData();
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to change review status"));
    } finally {
      setShowHideModal(false);
      setSelectedReview(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      const res = await apiClient.delete(`/admin/reviews/${selectedReview.reviewId}`);
      if (res.data.success) {
        toast.success("Review deleted permanently");
        fetchData();
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete review"));
    } finally {
      setShowDeleteModal(false);
      setSelectedReview(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || r.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || r.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) || r.reviewDescription && r.reviewDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesRating = ratingFilter === "All" || r.rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const renderStars = (rating) => {
    return <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => <Star
      key={star}
      className={`w-3.5 h-3.5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
    />)}
      </div>;
  };
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Reviews</h1>
          <p className="text-body mt-1">Monitor and manage student reviews across all courses.</p>
        </div>
      </div>

      {
    /* Summary Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Total Reviews</p>
            <h3 className="text-2xl font-black text-heading">{summary.totalReviews}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Average Rating</p>
            <h3 className="text-2xl font-black text-heading">{summary.averageRating}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Published</p>
            <h3 className="text-2xl font-black text-heading">{summary.publishedReviews}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center shrink-0">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Hidden</p>
            <h3 className="text-2xl font-black text-heading">{summary.hiddenReviews}</h3>
          </div>
        </div>
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
          <input
    type="text"
    placeholder="Search by student, course, instructor..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
  />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
    value={ratingFilter}
    onChange={(e) => setRatingFilter(e.target.value)}
    className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-heading focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-auto"
  >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-heading focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-auto"
  >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      {
    /* Reviews Table */
  }
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Student</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Course & Instructor</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Rating & Review</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? <tr>
                  <td colSpan={5} className="py-8 text-center text-body">Loading reviews...</td>
                </tr> : currentReviews.length === 0 ? <tr>
                  <td colSpan={5} className="py-8 text-center text-body">
                    No reviews found matching your criteria.
                  </td>
                </tr> : currentReviews.map((review) => <tr key={review.reviewId} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-center gap-3">
                        <img src={review.studentPhoto} alt={review.studentName} className="w-10 h-10 rounded-full object-cover border border-border" />
                        <div>
                          <p className="font-bold text-heading text-sm">{review.studentName}</p>
                          <p className="text-xs text-caption">{review.studentEmail}</p>
                          <p className="text-xs text-caption mt-0.5">{new Date(review.reviewDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-heading">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          <span className="line-clamp-1">{review.courseName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-caption">
                          <User className="w-3.5 h-3.5" />
                          <span>{review.instructorName}</span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                          {review.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top max-w-xs">
                      <div className="space-y-1.5">
                        {renderStars(review.rating)}
                        {review.reviewTitle && <p className="font-bold text-sm text-heading line-clamp-1">{review.reviewTitle}</p>}
                        <p className="text-xs text-body line-clamp-2" title={review.reviewDescription}>
                          {review.reviewDescription}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${review.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}>
                        {review.status === "Published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {review.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
    onClick={() => navigate(`/admin/reviews/${review.reviewId}`)}
    className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
    title="View Details"
  >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => {
      setSelectedReview(review);
      setShowHideModal(true);
    }}
    className={`p-1.5 rounded-lg transition-colors ${review.status === "Published" ? "text-gray-500 hover:text-orange-500 hover:bg-orange-50" : "text-orange-500 bg-orange-50 hover:bg-orange-100"}`}
    title={review.status === "Published" ? "Hide Review" : "Unhide Review"}
  >
                          <EyeOff className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => {
      setSelectedReview(review);
      setShowDeleteModal(true);
    }}
    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    title="Delete Permanently"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Pagination Controls */
  }
        {totalPages > 1 && <div className="p-4 border-t border-border flex items-center justify-center gap-2 bg-white rounded-b-xl">
            <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-border text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => <button
    key={page}
    onClick={() => setCurrentPage(page)}
    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${currentPage === page ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-border text-heading hover:bg-gray-50"}`}
  >
                {page}
              </button>)}
            
            <button
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-border text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>}
      </div>

      {
    /* Hide/Unhide Modal */
  }
      {showHideModal && selectedReview && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${selectedReview.status === "Published" ? "bg-orange-100 text-orange-500" : "bg-emerald-100 text-emerald-500"}`}>
                {selectedReview.status === "Published" ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-black text-heading">
                {selectedReview.status === "Published" ? "Hide Review?" : "Unhide Review?"}
              </h3>
              <p className="text-body text-sm">
                {selectedReview.status === "Published" ? "Are you sure you want to hide this review? It will be removed from the public course page but stored in the system." : "Are you sure you want to unhide this review? It will be visible to everyone on the course page again."}
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-border bg-gray-50">
              <button
    onClick={() => setShowHideModal(false)}
    className="py-4 font-bold text-body hover:bg-gray-100 transition-colors border-r border-border"
  >
                Cancel
              </button>
              <button
    onClick={handleHideUnhide}
    className={`py-4 font-bold transition-colors ${selectedReview.status === "Published" ? "text-orange-600 hover:bg-orange-50" : "text-emerald-600 hover:bg-emerald-50"}`}
  >
                Yes, {selectedReview.status === "Published" ? "Hide it" : "Unhide it"}
              </button>
            </div>
          </div>
        </div>}

      {
    /* Delete Modal */
  }
      {showDeleteModal && selectedReview && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-heading">Delete Review?</h3>
              <p className="text-body text-sm">
                Are you sure you want to permanently delete this review? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-border bg-gray-50">
              <button
    onClick={() => setShowDeleteModal(false)}
    className="py-4 font-bold text-body hover:bg-gray-100 transition-colors border-r border-border"
  >
                Cancel
              </button>
              <button
    onClick={handleDelete}
    className="py-4 font-bold text-red-600 hover:bg-red-50 transition-colors"
  >
                Delete
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminReviews;
export {
  stdin_default as default
};
