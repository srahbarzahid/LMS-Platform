import { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserCheck, UserX, UserPlus, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import UserStatCards from "../../../components/admin/users/UserStatCards";
import UserTable from "../../../components/admin/users/UserTable";
import CustomDropdown from "../../../components/common/CustomDropdown";
import ConfirmModal from "../../../components/common/ConfirmModal";
import toast from "react-hot-toast";
const AdminStudents = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {
  } });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  useEffect(() => {
    fetchStudents();
  }, [page, searchTerm, statusFilter]);
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users/students?page=${page}&limit=10&search=${searchTerm}&status=${statusFilter}`);
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load students");
    }
  };
  const handleAction = async (action, ids, payload) => {
    try {
      if (action === "delete") {
        setConfirmDialog({
          isOpen: true,
          title: "Delete Students",
          message: "Are you sure you want to delete the selected students? This action cannot be undone.",
          onConfirm: async () => {
            try {
              await axios.delete(`http://localhost:5000/api/admin/users/${ids[0]}`);
              toast.success("Students deleted successfully");
              fetchStudents();
            } catch (err) {
              toast.error("Action failed");
            }
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          }
        });
        return;
      } else if (action === "status") {
        await axios.patch(`http://localhost:5000/api/admin/users/${ids[0]}/status`, { status: payload?.status });
        toast.success(`Status updated to ${payload?.status}`);
        fetchStudents();
      } else if (action === "reset") {
        await axios.post(`http://localhost:5000/api/admin/users/${ids[0]}/reset-password`, { password: payload?.password });
        toast.success("Password reset successfully");
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };
  const columns = [
    {
      key: "name",
      label: "Student",
      render: (val, row) => <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-heading">{val}</div>
            <div className="text-xs text-caption">{row.email}</div>
          </div>
        </div>
    },
    { key: "phone", label: "Phone" },
    { key: "enrolledCourses", label: "Enrolled Courses" },
    {
      key: "progress",
      label: "Progress",
      render: (val) => <div className="w-full max-w-[120px]">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">{val}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${val}%` }} />
          </div>
        </div>
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const bg = val === "Active" ? "bg-emerald-50 text-emerald-600" : val === "Blocked" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600";
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${bg}`}>{val}</span>;
      }
    },
    { key: "joinedDate", label: "Joined" }
  ];
  const statCards = stats ? [
    { label: "Total Students", value: stats.total, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Students", value: stats.active, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
    { label: "Blocked Students", value: stats.blocked, icon: UserX, color: "bg-red-50 text-red-600" },
    { label: "New This Month", value: stats.newThisMonth, icon: BookOpen, color: "bg-purple-50 text-purple-600" }
  ] : [];
  return <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">Students</h1>
          <p className="text-body">Manage all students enrolled on the platform.</p>
        </div>
        <Link to="/admin/students/add" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <UserPlus className="w-5 h-5" />
          Add Student
        </Link>
      </div>

      {statCards.length > 0 && <UserStatCards stats={statCards} />}

      <UserTable
    entityName="Students"
    columns={columns}
    data={data}
    total={total}
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
    onSearch={setSearchTerm}
    onAction={handleAction}
    searchPlaceholder="Search students by name or email..."
    detailPathPrefix="/admin/students"
    filters={<CustomDropdown
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      options={[
        { label: "All Status", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Blocked", value: "Blocked" },
        { label: "Inactive", value: "Inactive" }
      ]}
    />}
  />

      <ConfirmModal
    isOpen={confirmDialog.isOpen}
    title={confirmDialog.title}
    message={confirmDialog.message}
    onConfirm={confirmDialog.onConfirm}
    onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
    confirmText="Delete"
  />
    </div>;
};
var stdin_default = AdminStudents;
export {
  stdin_default as default
};
