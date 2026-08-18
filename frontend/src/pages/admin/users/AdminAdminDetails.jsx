import { useState } from "react";
import { User, Mail, Shield, ShieldCheck, Clock, Activity, Lock, Settings, Users, BookOpen, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const AdminAdminDetails = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [admin, setAdmin] = useState({
    name: "Super Admin",
    email: "admin@lms.com",
    phone: "+1 555-9999",
    role: "Super Admin",
    status: "Active",
    lastLogin: "Today, 08:30 AM",
    permissions: [
      "Manage Users",
      "Manage Courses",
      "Manage Financials",
      "System Settings",
      "Platform Analytics"
    ]
  });
  const [editFormData, setEditFormData] = useState(admin);
  const activities = [
    { id: 1, type: "system_update", title: "System Settings Updated", description: "Modified email SMTP configuration", date: "Today at 09:15 AM", icon: Settings, color: "bg-gray-100 text-gray-600", dot: "bg-gray-500" },
    { id: 2, type: "user_suspended", title: "User Account Suspended", description: 'Suspended student account "john.doe@example.com" for terms violation', date: "Yesterday at 04:30 PM", icon: Users, color: "bg-red-100 text-red-600", dot: "bg-red-500" },
    { id: 3, type: "course_approved", title: "Course Approved", description: 'Approved "Advanced UI/UX Design" by Dr. Emily Carter', date: "2 days ago", icon: BookOpen, color: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-500" },
    { id: 4, type: "login", title: "Logged In", description: "Successful login from Web browser", date: "2 days ago", icon: Clock, color: "bg-blue-100 text-blue-600", dot: "bg-blue-400" }
  ];
  const tabs = [
    { id: "personal", label: "Contact & Role", icon: User },
    { id: "permissions", label: "Permissions", icon: ShieldCheck },
    { id: "activity", label: "Activity Log", icon: Activity }
  ];
  return <div className="p-8">
      {
    /* Back Button */
  }
      <button
    onClick={() => navigate("/admin/admins")}
    className="flex items-center gap-2 text-caption hover:text-primary transition-colors mb-6 font-bold"
  >
        <ArrowLeft className="w-5 h-5" /> Back to Admins
      </button>

      {
    /* Header */
  }
      <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
          {admin.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2 flex items-center gap-2">
            {admin.name}
            {admin.role === "Super Admin" && <Shield className="w-5 h-5 text-primary" />}
          </h1>
          <div className="flex items-center gap-4 text-sm text-body">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {admin.email}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">{admin.role}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">{admin.status}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button onClick={() => setResetPasswordModalOpen(true)} className="px-4 py-2 bg-white border border-border text-heading font-bold rounded-xl hover:bg-gray-50 transition-colors">Reset Password</button>
          <button onClick={() => {
    setEditFormData(admin);
    setEditProfileModalOpen(true);
  }} className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors">Edit Profile</button>
        </div>
      </div>

      {
    /* Tabs */
  }
      <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => {
    const Icon = tab.icon;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-caption hover:text-heading hover:border-gray-300"}`}
    >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>;
  })}
      </div>

      {
    /* Content */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm p-8 min-h-[400px]">
        {activeTab === "personal" && <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-heading mb-6">Contact & Authentication</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Full Name</div>
                  <div className="text-heading font-medium">{admin.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Role</div>
                  <div className="text-heading font-medium text-primary">{admin.role}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Email Address</div>
                  <div className="text-heading font-medium">{admin.email}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Phone Number</div>
                  <div className="text-heading font-medium">{admin.phone}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-caption uppercase mb-1">Last Login</div>
                  <div className="text-heading font-medium flex items-center gap-1"><Clock className="w-4 h-4 text-caption" /> {admin.lastLogin}</div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-heading font-bold rounded-xl transition-colors">
                  <Lock className="w-4 h-4" /> Send Password Reset
                </button>
              </div>
            </div>
          </div>}

        {activeTab === "permissions" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Active Permissions</h3>
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              {admin.permissions.map((perm) => <div key={perm} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-border">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-heading">{perm}</span>
                </div>)}
            </div>
            {admin.role === "Super Admin" && <p className="mt-6 text-sm text-caption">Super Admins inherently possess all platform permissions.</p>}
          </div>}

        {activeTab === "activity" && <div>
            <h3 className="text-lg font-bold text-heading mb-6">Activity Log</h3>
            <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 space-y-8 pb-4">
              {activities.map((activity) => {
    const Icon = activity.icon;
    return <div key={activity.id} className="relative pl-8 md:pl-10">
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white ${activity.dot}`} />
                    
                    <div className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-heading text-sm md:text-base">{activity.title}</h4>
                            <p className="text-xs text-caption font-medium">{activity.date}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-body ml-13">{activity.description}</p>
                    </div>
                  </div>;
  })}
            </div>
          </div>}
      </div>

      {
    /* Edit Profile Modal */
  }
      {editProfileModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl my-8">
            <h3 className="text-xl font-bold text-heading mb-6">Edit Profile</h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Full Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-heading mb-1">Email</label>
                  <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-heading mb-1">Phone Number</label>
                  <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-heading mb-1">Role</label>
                <select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white">
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditProfileModalOpen(false)} className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors">Cancel</button>
              <button onClick={() => {
    setAdmin(editFormData);
    setEditProfileModalOpen(false);
    toast.success("Profile updated successfully!", {
      style: { background: "#10B981", color: "#fff" },
      iconTheme: { primary: "#fff", secondary: "#10B981" }
    });
  }} className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>}

      {
    /* Reset Password Modal */
  }
      {resetPasswordModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-heading mb-2">Reset Password</h3>
            <p className="text-sm text-caption mb-6">Set a new password for this admin.</p>
            <div className="relative mb-6">
              <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full pl-4 pr-12 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-caption hover:text-primary transition-colors"
  >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => {
    setResetPasswordModalOpen(false);
    setNewPassword("");
    setShowPassword(false);
  }} className="px-4 py-2 font-bold text-caption hover:text-heading transition-colors">Cancel</button>
              <button onClick={() => {
    setResetPasswordModalOpen(false);
    setNewPassword("");
    toast.success("Password reset successfully!", {
      style: { background: "#10B981", color: "#fff" },
      iconTheme: { primary: "#fff", secondary: "#10B981" }
    });
  }} className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">Reset Password</button>
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminAdminDetails;
export {
  stdin_default as default
};
