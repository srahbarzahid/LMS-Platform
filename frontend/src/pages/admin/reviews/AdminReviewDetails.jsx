import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  User,
  BookOpen,
  EyeOff,
  Eye,
  Trash2,
  Calendar,
  Mail,
  AlertTriangle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const AdminReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHideModal, setShowHideModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    fetchReview();
  }, [id]);
  const fetchReview = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/admin/reviews/${id}`, { withCredentials: true });
      if (res.data.success) {
        setReview(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch review details", error);
      toast.error("Review not found");
      navigate("/admin/reviews");
    } finally {
      setIsLoading(false);
    }
  };
  const handleHideUnhide = async () => {
    try {
      const action = review.status === "Published" ? "hide" : "unhide";
      const res = await axios.put(`http://localhost:5000/api/admin/reviews/${id}/${action}`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(`Review ${action === "hide" ? "hidden" : "published"} successfully`);
        fetchReview();
      }
    } catch (error) {
      console.error("Failed to change review status", error);
      toast.error("Failed to change review status");
    } finally {
      setShowHideModal(false);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Review deleted permanently");
        navigate("/admin/reviews");
      }
    } catch (error) {
      console.error("Failed to delete review", error);
      toast.error("Failed to delete review");
      setShowDeleteModal(false);
    }
  };
  const renderStars = (rating) => {
    return <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => <Star
      key={star}
      className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
    />)}
      </div>;
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-body">Loading review details...</div>;
  }
  if (!review) {
    return <div className="flex justify-center items-center h-64 text-body">Review not found.</div>;
  }
  return <div className="space-y-6 max-w-4xl mx-auto">
      {
    /* Back Button */
  }
      <button
    onClick={() => navigate("/admin/reviews")}
    className="flex items-center gap-2 text-body hover:text-primary transition-colors font-medium text-sm w-fit"
  >
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </button>

      {
    /* Header and Actions */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-heading">Review Details</h1>
        <div className="flex items-center gap-3">
          <button
    onClick={() => setShowHideModal(true)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${review.status === "Published" ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
  >
            {review.status === "Published" ? <><EyeOff className="w-4 h-4" /> Hide Review</> : <><Eye className="w-4 h-4" /> Unhide Review</>}
          </button>
          <button
    onClick={() => setShowDeleteModal(true)}
    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
  >
            <Trash2 className="w-4 h-4" />
            Delete Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
    /* Left Column: Student & Course Info */
  }
        <div className="md:col-span-1 space-y-6">
          
          {
    /* Student Info */
  }
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-sm font-bold text-caption uppercase tracking-wider mb-4 border-b border-border pb-2">
              Student Information
            </h2>
            <div className="flex flex-col items-center text-center">
              <img
    src={review.studentPhoto}
    alt={review.studentName}
    className="w-20 h-20 rounded-full object-cover border-4 border-primary/10 mb-3"
  />
              <h3 className="font-bold text-heading text-lg">{review.studentName}</h3>
              <div className="flex items-center gap-1.5 text-body text-sm mt-1">
                <Mail className="w-4 h-4" />
                {review.studentEmail}
              </div>
            </div>
          </div>

          {
    /* Course Info */
  }
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-sm font-bold text-caption uppercase tracking-wider mb-4 border-b border-border pb-2">
              Course Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-caption font-bold mb-1">Course Name</p>
                <div className="flex items-start gap-2 text-heading font-medium">
                  <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{review.courseName}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-caption font-bold mb-1">Instructor</p>
                <div className="flex items-center gap-2 text-heading font-medium">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{review.instructorName}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-caption font-bold mb-1">Category</p>
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold uppercase">
                  {review.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {
    /* Right Column: Review Content */
  }
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm h-full">
            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
              <h2 className="text-sm font-bold text-caption uppercase tracking-wider">
                Review Details
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${review.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}>
                {review.status === "Published" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {review.status}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-border">
                <div>
                  <p className="text-xs font-bold text-caption uppercase tracking-wider mb-2">Rating</p>
                  {renderStars(review.rating)}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-caption uppercase tracking-wider mb-2">Submitted On</p>
                  <div className="flex items-center gap-1.5 text-heading font-medium text-sm justify-end">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(review.reviewDate).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-3">Review Content</p>
                {review.reviewTitle && <h3 className="text-xl font-bold text-heading mb-3">{review.reviewTitle}</h3>}
                <div className="bg-gray-50 p-5 rounded-xl border border-border text-body leading-relaxed whitespace-pre-wrap">
                  {review.reviewDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Hide/Unhide Modal */
  }
      {showHideModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${review.status === "Published" ? "bg-orange-100 text-orange-500" : "bg-emerald-100 text-emerald-500"}`}>
                {review.status === "Published" ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-black text-heading">
                {review.status === "Published" ? "Hide Review?" : "Unhide Review?"}
              </h3>
              <p className="text-body text-sm">
                {review.status === "Published" ? "Are you sure you want to hide this review? It will be removed from the public course page but stored in the system." : "Are you sure you want to unhide this review? It will be visible to everyone on the course page again."}
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
    className={`py-4 font-bold transition-colors ${review.status === "Published" ? "text-orange-600 hover:bg-orange-50" : "text-emerald-600 hover:bg-emerald-50"}`}
  >
                Yes, {review.status === "Published" ? "Hide it" : "Unhide it"}
              </button>
            </div>
          </div>
        </div>}

      {
    /* Delete Modal */
  }
      {showDeleteModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
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
var stdin_default = AdminReviewDetails;
export {
  stdin_default as default
};
