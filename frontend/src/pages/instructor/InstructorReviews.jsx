import { useState, useEffect, useRef } from "react";
import {
  Star,
  Search,
  Filter,
  MessageCircle,
  Flag,
  CornerDownRight,
  Check,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";

const CustomSelect = ({ value, onChange, options, icon: Icon, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-heading transition-all shadow-xs cursor-pointer"
      >
        {Icon && <Icon className="w-4 h-4 text-caption" />}
        <span>{value || placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-caption transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-border rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer ${value === "" ? "text-primary bg-primary/5 font-bold" : "text-heading"}`}
          >
            <span>{placeholder}</span>
            {value === "" && <Check className="w-3.5 h-3.5 text-primary" />}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer ${value === opt ? "text-primary bg-primary/5 font-bold" : "text-heading"}`}
            >
              <span>{opt}</span>
              {value === opt && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InstructorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getReviews();
        if (isMounted) {
          setReviews(Array.isArray(response.data) ? response.data : []);
          setAverageRating(response.averageRating || 0);
          setCourseOptions(Array.isArray(response.courses) ? response.courses : []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, "Failed to load reviews"));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleReplySubmit = async (id) => {
    const reply = replyText[id]?.trim();
    if (!reply) return;

    try {
      await instructorApi.replyToReview(id, reply);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reply } : r))
      );
      setShowReplyForm((prev) => ({ ...prev, [id]: false }));
      toast.success("Reply saved");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save reply"));
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "" ? true : r.course === filterCourse;
    let matchesRating = true;
    if (filterRating === "5 Stars") matchesRating = r.rating === 5;
    else if (filterRating === "4 Stars") matchesRating = r.rating === 4;
    else if (filterRating === "3 Stars") matchesRating = r.rating === 3;
    else if (filterRating === "2 Stars & Below") matchesRating = r.rating <= 2;
    return matchesSearch && matchesCourse && matchesRating;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Course Reviews</h1>
          <p className="text-body mt-1">Read and respond to feedback from your students.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <div className="text-xl font-heading font-bold text-heading">{averageRating}</div>
            <div className="text-xs text-caption">Overall Rating</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          />
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <CustomSelect
            value={filterCourse}
            onChange={setFilterCourse}
            options={courseOptions}
            icon={Filter}
            placeholder="Filter Course"
          />
          <CustomSelect
            value={filterRating}
            onChange={setFilterRating}
            options={["5 Stars", "4 Stars", "3 Stars", "2 Stars & Below"]}
            icon={Star}
            placeholder="All Ratings"
          />
        </div>
      </div>

      {/* Reviews List */}
      {error ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center text-red-600 font-bold">
          {error}
        </div>
      ) : loading ? (
        <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {review.student.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-heading text-sm">{review.student}</h3>
                      <div className="text-xs text-caption flex items-center gap-2">
                        <span className="font-semibold">{review.course}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-body text-sm leading-relaxed">{review.text}</p>

                <div className="flex items-center gap-4 pt-2">
                  {!review.reply && !showReplyForm[review.id] && (
                    <button
                      onClick={() => setShowReplyForm((prev) => ({ ...prev, [review.id]: true }))}
                      className="flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" /> Reply
                    </button>
                  )}
                  <button className="flex items-center gap-2 text-sm font-bold text-caption hover:text-red-500 transition-colors cursor-pointer">
                    <Flag className="w-4 h-4" /> Flag
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyForm[review.id] && !review.reply && (
                  <div className="bg-gray-50 border border-border rounded-xl p-4 mt-2 animate-fade-in flex gap-4 items-start">
                    <CornerDownRight className="w-5 h-5 text-gray-400 mt-2 shrink-0" />
                    <div className="flex-1 space-y-3">
                      <textarea
                        placeholder="Write your response..."
                        rows={3}
                        value={replyText[review.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))
                        }
                        className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setShowReplyForm((prev) => ({ ...prev, [review.id]: false }))
                          }
                          className="px-4 py-2 text-sm font-bold text-caption hover:text-heading transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReplySubmit(review.id)}
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-secondary transition-colors cursor-pointer"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Reply */}
                {review.reply && (
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-2 flex gap-4 items-start">
                    <CornerDownRight className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Instructor Reply
                        </span>
                      </div>
                      <p className="text-body text-sm leading-relaxed">{review.reply}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center text-caption">
              No reviews found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;
