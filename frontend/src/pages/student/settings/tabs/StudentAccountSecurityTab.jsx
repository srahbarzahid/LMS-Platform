import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  Globe,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  AlertOctagon,
  UserX
} from "lucide-react";
import toast from "react-hot-toast";
const StudentAccountSecurityTab = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedSessionToDelete, setSelectedSessionToDelete] = useState(null);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [resendingType, setResendingType] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  useEffect(() => {
    fetchSessions();
  }, []);
  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch("/api/student/settings/sessions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (data.status === "success" && data.data) {
        setSessions(data.data);
      }
    } catch (err) {
      console.error("Failed to load student sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  };
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strengthScore = checkPasswordStrength(newPassword);
  const getStrengthLabel = (score) => {
    if (score <= 2) return { text: "Weak", color: "text-red-500", bg: "bg-red-500", width: "w-1/4" };
    if (score === 3 || score === 4) return { text: "Medium", color: "text-amber-500", bg: "bg-amber-500", width: "w-3/4" };
    return { text: "Strong", color: "text-green-500", bg: "bg-green-500", width: "w-full" };
  };
  const strengthInfo = getStrengthLabel(strengthScore);
  const handlePasswordSubmit = async () => {
    setShowPasswordModal(false);
    setSavingPassword(true);
    try {
      const res = await fetch("/api/student/settings/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success(data.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (err) {
      toast.error("An error occurred while changing password.");
    } finally {
      setSavingPassword(false);
    }
  };
  const handleResendVerification = async (type) => {
    setResendingType(type);
    try {
      const res = await fetch("/api/student/settings/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send verification.");
      }
    } catch (err) {
      toast.error("Failed to send verification.");
    } finally {
      setResendingType(null);
    }
  };
  const handleLogoutSession = async (sessionId) => {
    try {
      const res = await fetch(`/api/student/settings/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success("Session logged out successfully.");
        setSessions(sessions.filter((s) => s.id !== sessionId));
      } else {
        toast.error(data.message || "Failed to log out session.");
      }
    } catch (err) {
      toast.error("Error logging out session.");
    } finally {
      setSelectedSessionToDelete(null);
    }
  };
  const handleLogoutAllOtherSessions = async () => {
    setShowLogoutAllModal(false);
    try {
      const res = await fetch("/api/student/settings/sessions", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success("All other sessions logged out.");
        setSessions(sessions.filter((s) => s.isCurrent));
      } else {
        toast.error(data.message || "Failed to log out all sessions.");
      }
    } catch (err) {
      toast.error("Error logging out all sessions.");
    }
  };
  const handleDeactivateAccount = async () => {
    if (!deactivatePassword) {
      toast.error("Please enter your password to confirm account deactivation.");
      return;
    }
    setDeactivating(true);
    try {
      const res = await fetch("/api/student/settings/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ confirmPassword: deactivatePassword })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success(data.message || "Account deactivated.");
        setShowDeactivateModal(false);
      } else {
        toast.error(data.message || "Failed to deactivate account.");
      }
    } catch (err) {
      toast.error("Error deactivating account.");
    } finally {
      setDeactivating(false);
    }
  };
  return <div className="space-y-10 animate-fade-in">
      <div>
        <h3 className="font-bold text-heading text-lg mb-1">Account & Security</h3>
        <p className="text-sm text-caption">Manage password security, verification channels, active sessions, and account deactivation.</p>
      </div>

      {
    /* 1. Password Change Form */
  }
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-heading text-base">Change Password</h4>
            <p className="text-xs text-caption">Keep your account safe with a strong, complex password.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          {
    /* Current Password */
  }
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-1.5">Current Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type={showCurrentPassword ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    placeholder="Enter current password"
  />
              <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption hover:text-heading"
  >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {
    /* New Password & Strength Meter */
  }
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type={showNewPassword ? "text" : "password"}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    placeholder="Enter new password"
  />
              <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption hover:text-heading"
  >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {
    /* Strength meter */
  }
            {newPassword && <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-caption">Password Strength:</span>
                  <span className={`font-bold ${strengthInfo.color}`}>{strengthInfo.text}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthInfo.bg} ${strengthInfo.width}`} />
                </div>
                <p className="text-[11px] text-caption mt-1">Must contain min 8 characters with upper, lower, digit & special symbol.</p>
              </div>}
          </div>

          {
    /* Confirm Password */
  }
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    placeholder="Confirm new password"
  />
              <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption hover:text-heading"
  >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
    type="button"
    disabled={!currentPassword || !newPassword || !confirmPassword || savingPassword}
    onClick={() => setShowPasswordModal(true)}
    className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-secondary transition-colors disabled:opacity-50 inline-flex items-center gap-2"
  >
              {savingPassword ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </div>
      </div>

      {
    /* 2. Verification Status */
  }
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-heading text-base">Channel Verification Status</h4>
          <p className="text-xs text-caption">Active channels used for notifications and security resets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl p-4 bg-gray-50/50 flex justify-between items-center">
            <div>
              <div className="text-xs text-caption uppercase tracking-wider font-bold">Email Address</div>
              <div className="text-sm font-bold text-heading mt-0.5 inline-flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Verified & Active
              </div>
            </div>
            <button
    onClick={() => handleResendVerification("email")}
    disabled={resendingType === "email"}
    className="px-3 py-1.5 bg-white border border-border text-heading rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
  >
              Resend Check
            </button>
          </div>

          <div className="border border-border rounded-xl p-4 bg-gray-50/50 flex justify-between items-center">
            <div>
              <div className="text-xs text-caption uppercase tracking-wider font-bold">Mobile Phone</div>
              <div className="text-sm font-bold text-heading mt-0.5 inline-flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="w-4 h-4" /> Pending Verification
              </div>
            </div>
            <button
    onClick={() => handleResendVerification("mobile")}
    disabled={resendingType === "mobile"}
    className="px-3 py-1.5 bg-white border border-border text-heading rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
  >
              Resend SMS
            </button>
          </div>
        </div>
      </div>

      {
    /* 3. Active Sessions */
  }
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h4 className="font-bold text-heading text-base">Active Devices & Sessions</h4>
            <p className="text-xs text-caption">Devices currently logged into your student account.</p>
          </div>
          {sessions.length > 1 && <button
    onClick={() => setShowLogoutAllModal(true)}
    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
  >
              <LogOut className="w-3.5 h-3.5" /> Log Out All Other Sessions
            </button>}
        </div>

        {loadingSessions ? <div className="flex justify-center p-6">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          </div> : <div className="space-y-3">
            {sessions.map((sess) => <div key={sess.id} className="border border-border rounded-xl p-4 flex items-center justify-between gap-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-heading shrink-0">
                    {sess.device.toLowerCase().includes("mac") || sess.device.toLowerCase().includes("pc") || sess.device.toLowerCase().includes("windows") ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-heading flex items-center gap-2">
                      {sess.device}
                      {sess.isCurrent && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                          Current Session
                        </span>}
                    </div>
                    <div className="text-xs text-caption flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {sess.ipAddress} ({sess.location})
                      </span>
                      <span>•</span>
                      <span>Last active: {new Date(sess.lastActiveAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && <button
    onClick={() => setSelectedSessionToDelete(sess.id)}
    className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors shrink-0"
  >
                    Log Out
                  </button>}
              </div>)}
          </div>}
      </div>

      {
    /* 4. Deactivate Account Card (Soft Delete) */
  }
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-red-600 text-base">Deactivate Account</h4>
            <p className="text-xs text-red-500">Temporarily pause your student account, enrollments, and course access.</p>
          </div>
        </div>

        <p className="text-xs text-caption leading-relaxed">
          Deactivating your account will suspend your active course enrollments, quiz history, and progress tracking. Your data is safely preserved for soft-delete recovery and can be reactivated by contacting support.
        </p>

        <div>
          <button
    onClick={() => setShowDeactivateModal(true)}
    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-colors shadow-sm inline-flex items-center gap-2"
  >
            <UserX className="w-4 h-4" /> Deactivate Student Account
          </button>
        </div>
      </div>

      {
    /* Modal: Confirm Password Update */
  }
      {showPasswordModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <h4 className="font-bold text-heading text-lg">Confirm Password Change</h4>
            <p className="text-sm text-caption">Are you sure you want to update your password? You will need your new password on your next login.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
    onClick={() => setShowPasswordModal(false)}
    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-heading rounded-xl font-bold text-sm transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handlePasswordSubmit}
    className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-colors"
  >
                Confirm Update
              </button>
            </div>
          </div>
        </div>}

      {
    /* Modal: Logout Single Session */
  }
      {selectedSessionToDelete && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <h4 className="font-bold text-heading text-lg">Revoke Session Access</h4>
            <p className="text-sm text-caption">Are you sure you want to log out this active device? The session will be terminated immediately.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
    onClick={() => setSelectedSessionToDelete(null)}
    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-heading rounded-xl font-bold text-sm transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={() => handleLogoutSession(selectedSessionToDelete)}
    className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
  >
                Log Out Device
              </button>
            </div>
          </div>
        </div>}

      {
    /* Modal: Logout All Other Sessions */
  }
      {showLogoutAllModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <h4 className="font-bold text-heading text-lg">Log Out All Other Devices</h4>
            <p className="text-sm text-caption">Are you sure you want to disconnect all other active sessions? Only your current device will stay logged in.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
    onClick={() => setShowLogoutAllModal(false)}
    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-heading rounded-xl font-bold text-sm transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleLogoutAllOtherSessions}
    className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
  >
                Log Out All Others
              </button>
            </div>
          </div>
        </div>}

      {
    /* Modal: Account Deactivation Confirmation */
  }
      {showDeactivateModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 text-red-600">
              <AlertOctagon className="w-6 h-6" />
              <h4 className="font-bold text-lg">Confirm Account Deactivation</h4>
            </div>
            
            <p className="text-sm text-caption leading-relaxed">
              Deactivating your account will suspend your student dashboard, enrolled course access, certificates, and submission history. Your data is soft-deleted and preserved safely for reactivation.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-1.5">Enter Password to Confirm</label>
              <input
    type="password"
    value={deactivatePassword}
    onChange={(e) => setDeactivatePassword(e.target.value)}
    placeholder="Your account password"
    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
  />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
    onClick={() => {
      setShowDeactivateModal(false);
      setDeactivatePassword("");
    }}
    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-heading rounded-xl font-bold text-sm transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleDeactivateAccount}
    disabled={!deactivatePassword || deactivating}
    className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
  >
                {deactivating && <RefreshCw className="w-4 h-4 animate-spin" />} Deactivate Now
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = StudentAccountSecurityTab;
export {
  stdin_default as default
};
