import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, Clock, Edit3, XCircle, EyeOff, Star, Sparkles, Download, Award } from "lucide-react";
import CourseTable from "../../../components/admin/courses/CourseTable";
import CustomDropdown from "../../../components/common/CustomDropdown";
import toast from "react-hot-toast";
const AdminCourses = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  useEffect(() => {
    fetchCourses();
  }, [page, searchTerm, statusFilter, categoryFilter]);
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/courses?page=${page}&limit=10&search=${searchTerm}&status=${statusFilter}&category=${categoryFilter}`);
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: "", ids: [] });
  const handleAction = async (action, ids) => {
    if (["approve", "reject", "publish", "unpublish", "delete", "feature", "unfeature"].includes(action)) {
      setConfirmModal({ isOpen: true, action, ids, reason: "" });
    } else {
      executeAction(action, ids);
    }
  };
  const executeAction = async (action, ids, reason) => {
    try {
      if (action === "delete") {
        await Promise.all(ids.map((id) => axios.delete(`http://localhost:5000/api/admin/courses/${id}`)));
        toast.success("Course(s) deleted successfully");
        fetchCourses();
      } else if (["approve", "reject", "publish", "unpublish"].includes(action)) {
        const newStatus = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : action === "publish" ? "Published" : "Unpublished";
        await Promise.all(ids.map((id) => axios.patch(`http://localhost:5000/api/admin/courses/${id}/status`, {
          status: newStatus,
          reason: reason || ""
        })));
        toast.success(`Course(s) ${newStatus.toLowerCase()}`);
        fetchCourses();
      } else if (action === "feature" || action === "unfeature") {
        const isFeatured = action === "feature";
        await Promise.all(ids.map((id) => axios.patch(`http://localhost:5000/api/admin/courses/${id}/featured`, {
          featured: isFeatured
        })));
        toast.success(`Course(s) ${isFeatured ? "featured" : "unfeatured"}`);
        fetchCourses();
      }
    } catch (err) {
      toast.error("Action failed");
    }
    setConfirmModal({ isOpen: false, action: "", ids: [] });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Pending Approval":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "Approved":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-200";
      case "Unpublished":
        return "bg-orange-50 text-orange-600 border-orange-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };
  const columns = [
    {
      key: "title",
      label: "Course",
      render: (val, row) => <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
            <img src={`https://picsum.photos/seed/${row.id}/100/80`} alt={val} className="w-full h-full object-cover" />
            {row.featured && <div className="absolute top-0 right-0 bg-yellow-400 p-0.5 rounded-bl-lg">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>}
          </div>
          <div className="min-w-[200px]">
            <div className="font-bold text-heading truncate max-w-[250px]" title={val}>{val}</div>
            <div className="text-xs text-caption truncate max-w-[250px]">{row.category}</div>
          </div>
        </div>
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (val) => <div>
          <div className="font-medium text-heading">{val.name}</div>
          <div className="text-xs text-caption">{val.email}</div>
        </div>
    },
    { key: "students", label: "Students", render: (val) => <span className="font-medium">{val.toLocaleString()}</span> },
    { key: "price", label: "Price", render: (val) => <span className="font-bold text-heading">₹{val}</span> },
    {
      key: "rating",
      label: "Rating",
      render: (val) => <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
          <span className="font-medium">{val}</span>
        </div>
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(val)}`}>{val}</span>;
      }
    },
    {
      key: "updatedDate",
      label: "Last Updated",
      render: (val) => <span className="text-caption text-sm">{new Date(val).toLocaleDateString()}</span>
    }
  ];
  const statCards = stats ? [
    { label: "Total Courses", value: stats.total, icon: BookOpen, color: "bg-blue-50 text-blue-600", onClick: () => setStatusFilter("All") },
    { label: "Published", value: stats.published, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", onClick: () => setStatusFilter("Published") },
    { label: "Pending Approval", value: stats.pending, icon: Clock, color: "bg-yellow-50 text-yellow-600", onClick: () => setStatusFilter("Pending Approval") },
    { label: "Drafts", value: stats.draft, icon: Edit3, color: "bg-gray-50 text-gray-600", onClick: () => setStatusFilter("Draft") },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-50 text-red-600", onClick: () => setStatusFilter("Rejected") },
    { label: "Unpublished", value: stats.unpublished, icon: EyeOff, color: "bg-orange-50 text-orange-600", onClick: () => setStatusFilter("Unpublished") },
    { label: "Featured", value: stats.featured, icon: Star, color: "bg-purple-50 text-purple-600" },
    { label: "New This Month", value: stats.newThisMonth, icon: Sparkles, color: "bg-teal-50 text-teal-600" }
  ] : [];
  return <div className="p-6 md:p-8 pt-4 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0 shadow-inner shadow-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Courses</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage, review, approve, publish and monitor all courses across the platform.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
    onClick={() => navigate("/admin/courses/certificates")}
    className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-gray-200 shadow-sm"
  >
            <Award className="w-4 h-4 text-primary" />
            Assign Certificates
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 hover:-translate-y-0.5 border border-orange-400/50">
            <Download className="w-4 h-4" />
            Export Courses
          </button>
        </div>
      </div>

      {
    /* Since there are 8 cards, UserStatCards will display them in a grid. Wait, UserStatCards maps through them. It will be a 4-col grid natively if it uses grid-cols-4. */
  }
      {statCards.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
    const Icon = stat.icon;
    return <div
      key={idx}
      onClick={stat.onClick}
      className={`relative overflow-hidden bg-white p-4 rounded-xl border border-border group ${stat.onClick ? "cursor-pointer hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300" : "hover:shadow-md hover:-translate-y-1 transition-all duration-300"}`}
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
                  <div className="text-2xl font-heading font-black text-heading tracking-tight leading-tight">{stat.value.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-caption uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              </div>;
  })}
        </div>}

      <CourseTable
    entityName="Courses"
    columns={columns}
    data={data}
    total={total}
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
    onSearch={setSearchTerm}
    onAction={handleAction}
    searchPlaceholder="Search courses by title or instructor..."
    detailPathPrefix="/admin/courses"
    filters={<>
            <CustomDropdown
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      options={[
        { label: "All Status", value: "All" },
        { label: "Published", value: "Published" },
        { label: "Pending Approval", value: "Pending Approval" },
        { label: "Approved", value: "Approved" },
        { label: "Draft", value: "Draft" },
        { label: "Rejected", value: "Rejected" },
        { label: "Unpublished", value: "Unpublished" }
      ]}
    />
            <CustomDropdown
      value={categoryFilter}
      onChange={(val) => setCategoryFilter(val)}
      options={[
        { label: "All Categories", value: "All" },
        { label: "Web Development", value: "Web Development" },
        { label: "Data Science", value: "Data Science" },
        { label: "Design", value: "Design" },
        { label: "Marketing", value: "Marketing" },
        { label: "Business", value: "Business" }
      ]}
    />
          </>}
  />

      {
    /* Confirmation Modal */
  }
      {confirmModal.isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden transform scale-100 opacity-100 transition-all duration-300">
            <div className={`h-2 w-full ${confirmModal.action === "delete" || confirmModal.action === "reject" ? "bg-red-500" : confirmModal.action === "approve" ? "bg-emerald-500" : confirmModal.action === "feature" ? "bg-yellow-500" : "bg-primary"}`} />
            
            <div className="p-8 text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${confirmModal.action === "delete" || confirmModal.action === "reject" ? "bg-red-50 text-red-500" : confirmModal.action === "approve" ? "bg-emerald-50 text-emerald-500" : confirmModal.action === "feature" ? "bg-yellow-50 text-yellow-500" : "bg-primary/10 text-primary"}`}>
                {confirmModal.action === "delete" && <XCircle className="w-8 h-8" />}
                {confirmModal.action === "reject" && <XCircle className="w-8 h-8" />}
                {confirmModal.action === "approve" && <CheckCircle className="w-8 h-8" />}
                {confirmModal.action === "publish" && <BookOpen className="w-8 h-8" />}
                {confirmModal.action === "unpublish" && <EyeOff className="w-8 h-8" />}
                {confirmModal.action === "feature" && <Star className="w-8 h-8" />}
                {confirmModal.action === "unfeature" && <Star className="w-8 h-8 text-gray-500" />}
              </div>

              <h2 className="text-2xl font-heading font-black text-heading mb-2 capitalize">
                {confirmModal.action} Course{confirmModal.ids.length > 1 ? "s" : ""}?
              </h2>
              <p className="text-body mb-6">
                Are you sure you want to {confirmModal.action} the selected {confirmModal.ids.length} course{confirmModal.ids.length > 1 ? "s" : ""}? 
                {confirmModal.action === "delete" && " This action cannot be undone."}
              </p>

              {confirmModal.action === "reject" && <div className="w-full text-left mb-6">
                  <label className="block text-sm font-bold text-heading mb-2">Reason for rejection (Optional)</label>
                  <textarea
    value={confirmModal.reason || ""}
    onChange={(e) => setConfirmModal({ ...confirmModal, reason: e.target.value })}
    placeholder="E.g., Does not meet quality guidelines..."
    className="w-full px-4 py-3 rounded-xl border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all h-24 resize-none"
  />
                </div>}

              <div className="flex gap-3 w-full">
                <button
    onClick={() => setConfirmModal({ isOpen: false, action: "", ids: [] })}
    className="flex-1 px-5 py-3 rounded-xl font-bold text-heading bg-gray-100 hover:bg-gray-200 transition-colors"
  >
                  Cancel
                </button>
                <button
    onClick={() => executeAction(confirmModal.action, confirmModal.ids, confirmModal.reason)}
    className={`flex-1 px-5 py-3 rounded-xl font-bold text-white transition-colors ${confirmModal.action === "delete" || confirmModal.action === "reject" ? "bg-red-500 hover:bg-red-600" : confirmModal.action === "approve" ? "bg-emerald-500 hover:bg-emerald-600" : confirmModal.action === "feature" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-primary hover:bg-primary/90"}`}
  >
                  Yes, {confirmModal.action}
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminCourses;
export {
  stdin_default as default
};
