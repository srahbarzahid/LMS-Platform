import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import apiClient, { getApiErrorMessage } from "../../../api/client";
import CourseApprovalTable from "../../../components/admin/courses/CourseApprovalTable";
import CourseReviewModal from "../../../components/admin/courses/CourseReviewModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import SuccessModal from "../../../components/common/SuccessModal";
const AdminCourseApprovals = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    courseId: null,
    action: null
  });
  const [successModalState, setSuccessModalState] = useState({
    isOpen: false,
    title: "",
    message: ""
  });
  const fetchPendingCourses = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/admin/courses/pending", {
        params: { page, limit: 10, search: searchTerm }
      });
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load pending courses"));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingCourses();
  }, [page, searchTerm]);
  const handleAction = (action, row) => {
    if (action === "review") {
      setSelectedCourse(row);
      setReviewModalOpen(true);
    } else if (action === "approve") {
      setConfirmModalState({ isOpen: true, courseId: row.id, action: "approve" });
    } else if (action === "reject") {
      setSelectedCourse(row);
      setReviewModalOpen(true);
    }
  };
  const handleModalApprove = (id) => {
    setReviewModalOpen(false);
    setConfirmModalState({ isOpen: true, courseId: id, action: "approve" });
  };
  const handleModalReject = (id, reason) => {
    setReviewModalOpen(false);
    setConfirmModalState({ isOpen: true, courseId: id, action: "reject", reason });
  };
  const executeAction = async () => {
    const { courseId, action, reason } = confirmModalState;
    if (!courseId || !action) return;
    try {
      if (action === "approve") {
        await apiClient.patch(`/admin/courses/${courseId}/status`, {
          status: "Published",
          notes: "Approved by Administrator"
        });
        setSuccessModalState({
          isOpen: true,
          title: "Course Approved!",
          message: "The course has been published and is now available to students."
        });
      } else if (action === "reject") {
        await apiClient.patch(`/admin/courses/${courseId}/status`, {
          status: "Rejected",
          reason: reason || "Does not meet platform standards",
          notes: "Rejected by Administrator"
        });
        setSuccessModalState({
          isOpen: true,
          title: "Course Rejected",
          message: "The course has been rejected. The instructor will be notified with the provided reason."
        });
      }
      fetchPendingCourses();
    } catch (err) {
      toast.error(getApiErrorMessage(err, `Failed to ${action} course`));
    } finally {
      setConfirmModalState({ isOpen: false, courseId: null, action: null });
    }
  };
  const columns = [
    {
      key: "title",
      label: "Course Name",
      render: (val, row) => <div className="flex items-center gap-3">
          <div className="font-bold text-heading text-sm max-w-[250px] truncate" title={val}>{val}</div>
        </div>
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (val) => <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {val.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-heading text-sm">{val.name}</div>
            <div className="text-xs text-caption">{val.email}</div>
          </div>
        </div>
    },
    {
      key: "category",
      label: "Category",
      render: (val) => <span className="font-medium text-sm">{val}</span>
    },
    {
      key: "price",
      label: "Proposed Price",
      render: (val) => <span className="font-bold text-sm text-heading">₹{val}</span>
    },
    {
      key: "updatedDate",
      label: "Submitted On",
      render: (val) => <span className="text-caption font-medium text-sm">{new Date(val).toLocaleDateString()}</span>
    }
  ];
  const statCards = stats ? [
    { label: "Pending Courses", value: stats.pendingCourses, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Approved Today", value: stats.approvedToday, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Rejected Today", value: stats.rejectedToday, icon: XCircle, color: "bg-red-50 text-red-600" },
    { label: "Total Pending Reviews", value: stats.totalPendingReviews, icon: BookOpen, color: "bg-blue-50 text-blue-600" }
  ] : [];
  return <div>
      {
    /* Header */
  }
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-1">Course Approvals</h1>
          <p className="text-body text-sm">Review, approve, or reject courses submitted by instructors.</p>
        </div>
      </div>

      {
    /* Stats Cards */
  }
      {statCards.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
    const Icon = stat.icon;
    return <div
      key={idx}
      className="relative overflow-hidden bg-white p-4 rounded-xl border border-border group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 pointer-events-none text-gray-900">
                  <Icon className="w-24 h-24" />
                </div>
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-2xl font-heading font-black text-heading tracking-tight leading-tight">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-caption uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              </div>;
  })}
        </div>}

      {
    /* Table */
  }
      <CourseApprovalTable
    columns={columns}
    data={data}
    total={total}
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
    onSearch={setSearchTerm}
    onAction={handleAction}
  />

      {
    /* Modals */
  }
      <CourseReviewModal
    isOpen={reviewModalOpen}
    onClose={() => setReviewModalOpen(false)}
    course={selectedCourse}
    onApprove={handleModalApprove}
    onReject={handleModalReject}
  />

      <ConfirmModal
    isOpen={confirmModalState.isOpen}
    title={confirmModalState.action === "approve" ? "Approve Course" : "Reject Course"}
    message={confirmModalState.action === "approve" ? "Are you sure you want to approve this course? It will be published immediately to the platform." : "Are you sure you want to reject this course? The instructor will be notified with the reason you provided."}
    onConfirm={executeAction}
    onCancel={() => setConfirmModalState({ isOpen: false, courseId: null, action: null })}
    confirmText={confirmModalState.action === "approve" ? "Yes, Approve" : "Yes, Reject"}
    cancelText="Cancel"
    isDestructive={confirmModalState.action === "reject"}
  />

      <SuccessModal
    isOpen={successModalState.isOpen}
    title={successModalState.title}
    message={successModalState.message}
    onContinue={() => setSuccessModalState({ ...successModalState, isOpen: false })}
  />
    </div>;
};
var stdin_default = AdminCourseApprovals;
export {
  stdin_default as default
};
