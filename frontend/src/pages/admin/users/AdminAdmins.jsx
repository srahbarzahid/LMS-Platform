import { useState, useEffect } from "react";
import apiClient from "../../../api/client";
import { Shield, ShieldAlert, ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import UserStatCards from "../../../components/admin/users/UserStatCards";
import UserTable from "../../../components/admin/users/UserTable";
import CustomDropdown from "../../../components/common/CustomDropdown";
import ConfirmModal from "../../../components/common/ConfirmModal";
import toast from "react-hot-toast";
const AdminAdmins = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {
  } });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  useEffect(() => {
    fetchAdmins();
  }, [page, searchTerm, roleFilter]);
  const fetchAdmins = async () => {
    try {
      const res = await apiClient.get(`/admin/users/admins?page=${page}&limit=10&search=${searchTerm}&role=${roleFilter}`);
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load admins");
    }
  };
  const handleAction = async (action, ids, payload) => {
    try {
      if (action === "delete") {
        setConfirmDialog({
          isOpen: true,
          title: "Delete Administrators",
          message: "Are you sure you want to delete the selected administrators? This action cannot be undone.",
          onConfirm: async () => {
            try {
              await apiClient.delete(`/admin/users/${ids[0]}`);
              toast.success("Administrators deleted successfully");
              fetchAdmins();
            } catch (err) {
              toast.error("Action failed");
            }
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          }
        });
        return;
      } else if (action === "status") {
        await apiClient.patch(`/admin/users/${ids[0]}/status`, { status: payload?.status });
        toast.success(`Status updated to ${payload?.status}`);
        fetchAdmins();
      } else if (action === "reset") {
        await apiClient.post(`/admin/users/${ids[0]}/reset-password`, { password: payload?.password });
        toast.success("Password reset successfully");
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };
  const columns = [
    {
      key: "name",
      label: "Administrator",
      render: (val, row) => <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-heading font-bold">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-heading flex items-center gap-2">
              {val}
              {row.role === "Super Admin" && <ShieldAlert className="w-4 h-4 text-primary" />}
            </div>
            <div className="text-xs text-caption">{row.email}</div>
          </div>
        </div>
    },
    {
      key: "role",
      label: "Role",
      render: (val) => <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${val === "Super Admin" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-700"}`}>
          {val}
        </span>
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (val) => <div className="text-caption text-sm flex items-center gap-1"><LogIn className="w-4 h-4" /> {val}</div>
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const bg = val === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600";
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${bg}`}>{val}</span>;
      }
    }
  ];
  const statCards = stats ? [
    { label: "Total Admins", value: stats.total, icon: Shield, color: "bg-gray-100 text-gray-600" },
    { label: "Super Admins", value: stats.superAdmins, icon: ShieldAlert, color: "bg-primary/10 text-primary" },
    { label: "Active Admins", value: stats.active, icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" }
  ] : [];
  return <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">Administrators</h1>
          <p className="text-body">Manage platform administrators and their roles.</p>
        </div>
        <Link to="/admin/admins/add" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <UserPlus className="w-5 h-5" />
          Add Admin
        </Link>
      </div>

      {statCards.length > 0 && <UserStatCards stats={statCards} />}

      <UserTable
    entityName="Admins"
    columns={columns}
    data={data}
    total={total}
    page={page}
    totalPages={totalPages}
    onPageChange={setPage}
    onSearch={setSearchTerm}
    onAction={handleAction}
    searchPlaceholder="Search admins by name..."
    detailPathPrefix="/admin/admins"
    filters={<CustomDropdown
      value={roleFilter}
      onChange={(val) => setRoleFilter(val)}
      options={[
        { label: "All Roles", value: "All" },
        { label: "Super Admin", value: "Super Admin" },
        { label: "Admin", value: "Admin" }
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
var stdin_default = AdminAdmins;
export {
  stdin_default as default
};
