import { useState, useEffect } from "react";
import axios from "axios";
import { UserCog, UserCheck, UserX, UserPlus, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import UserStatCards from "../../../components/admin/users/UserStatCards";
import UserTable from "../../../components/admin/users/UserTable";
import CustomDropdown from "../../../components/common/CustomDropdown";
import ConfirmModal from "../../../components/common/ConfirmModal";
import toast from "react-hot-toast";
const AdminInstructors = () => {
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
    fetchInstructors();
  }, [page, searchTerm, statusFilter]);
  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users/instructors?page=${page}&limit=10&search=${searchTerm}&status=${statusFilter}`);
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load instructors");
    }
  };
  const handleAction = async (action, ids, payload) => {
    try {
      if (action === "delete") {
        setConfirmDialog({
          isOpen: true,
          title: "Delete Instructors",
          message: "Are you sure you want to delete the selected instructors? This action cannot be undone.",
          onConfirm: async () => {
            try {
              await axios.delete(`http://localhost:5000/api/admin/users/${ids[0]}`);
              toast.success("Instructors deleted successfully");
              fetchInstructors();
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
        fetchInstructors();
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
      label: "Instructor",
      render: (val, row) => <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-heading">{val}</div>
            <div className="text-xs text-caption">{row.email}</div>
          </div>
        </div>
    },
    { key: "phone", label: "Phone" },
    { key: "courses", label: "Courses" },
    { key: "students", label: "Students" },
    {
      key: "revenue",
      label: "Revenue",
      render: (val) => <span className="font-bold text-heading">₹{val.toLocaleString()}</span>
    },
    {
      key: "rating",
      label: "Rating",
      render: (val) => <div className="flex items-center gap-1 text-orange-500 font-bold">
          ⭐ {val}
        </div>
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const bg = val === "Active" ? "bg-emerald-50 text-emerald-600" : val === "Suspended" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600";
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${bg}`}>{val}</span>;
      }
    }
  ];
  const statCards = stats ? [
    { label: "Total Instructors", value: stats.total, icon: UserCog, color: "bg-purple-50 text-purple-600" },
    { label: "Active Instructors", value: stats.active, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
    { label: "Suspended", value: stats.suspended, icon: UserX, color: "bg-red-50 text-red-600" },
    { label: "Total Revenue", value: `\u20B9${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "bg-orange-50 text-orange-600" }
  ] : [];
  return <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">Instructors</h1>
          <p className="text-body">Manage instructors and monitor their teaching performance.</p>
        </div>
        <Link to="/admin/instructors/add" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <UserPlus className="w-5 h-5" />
          Add Instructor
        </Link>
      </div>

      {statCards.length > 0 && <UserStatCards stats={statCards} />}

      <UserTable
    entityName="Instructors"
    columns={columns}
    data={data}
    total={total}
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
    onSearch={setSearchTerm}
    onAction={handleAction}
    searchPlaceholder="Search instructors by name or email..."
    detailPathPrefix="/admin/instructors"
    filters={<CustomDropdown
      value={statusFilter}
      onChange={(val) => setStatusFilter(val)}
      options={[
        { label: "All Status", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Suspended", value: "Suspended" },
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
var stdin_default = AdminInstructors;
export {
  stdin_default as default
};
