import { useState } from "react";
import { Shield, ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomDropdown from "../../../components/common/CustomDropdown";
const AdminAddAdmin = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Admin");
  const [status, setStatus] = useState("Active");
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Admin added successfully");
    navigate("/admin/admins");
  };
  return <div className="p-8">
      {
    /* Header */
  }
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/admins" className="flex items-center gap-2 text-caption hover:text-primary transition-colors mb-2 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Admins
          </Link>
          <h1 className="text-3xl font-heading font-bold text-heading">Add New Administrator</h1>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border shadow-sm p-8 space-y-6">
          <div className="border-b border-border pb-6 flex items-start gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-heading mb-1">Administrative Privileges</h2>
              <p className="text-sm text-caption">Creating an admin grants high-level access to the platform. Ensure you only provision trusted users.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Full Name</label>
              <input type="text" required placeholder="Alice Johnson" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Email Address</label>
              <input type="email" required placeholder="alice@lms.com" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Temporary Password</label>
              <input type="text" required placeholder="e.g. TempPass123!" className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Role</label>
              <CustomDropdown
    value={role}
    onChange={setRole}
    options={[
      { label: "Admin", value: "Admin" },
      { label: "Super Admin", value: "Super Admin" }
    ]}
  />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-heading">Initial Status</label>
              <CustomDropdown
    value={status}
    onChange={setStatus}
    options={[
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" }
    ]}
  />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Link to="/admin/admins" className="px-6 py-2.5 font-bold text-heading hover:bg-gray-50 border border-transparent rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              Create Administrator
            </button>
          </div>
        </form>
      </div>
    </div>;
};
var stdin_default = AdminAddAdmin;
export {
  stdin_default as default
};
