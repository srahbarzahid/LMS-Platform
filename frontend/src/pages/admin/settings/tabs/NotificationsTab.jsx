import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone, ShieldAlert, Save, RefreshCw, UserPlus, AlertOctagon, HardDrive } from "lucide-react";
import toast from "react-hot-toast";
const NotificationsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState({
    newUserRegistrations: true,
    failedBackgroundJobs: true,
    storageWarnings: true,
    securityAlerts: true
  });
  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (data.status === "success" && data.data) {
        if (typeof data.data.emailNotifications === "boolean") {
          setEmailNotifications(data.data.emailNotifications);
        }
        if (typeof data.data.inAppNotifications === "boolean") {
          setInAppNotifications(data.data.inAppNotifications);
        }
        if (data.data.systemAlerts) {
          setSystemAlerts({
            newUserRegistrations: !!data.data.systemAlerts.newUserRegistrations,
            failedBackgroundJobs: !!data.data.systemAlerts.failedBackgroundJobs,
            storageWarnings: !!data.data.systemAlerts.storageWarnings,
            securityAlerts: !!data.data.systemAlerts.securityAlerts
          });
        }
      }
    } catch (err) {
      console.error("Failed to load notifications preferences:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleSystemAlert = (key) => {
    setSystemAlerts((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      emailNotifications,
      inAppNotifications,
      systemAlerts
    };
    try {
      const res = await fetch("/api/admin/settings/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ notificationPreferences: payload })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success("Notification preferences saved!");
      } else {
        toast.error(data.message || "Failed to save notifications.");
      }
    } catch (err) {
      toast.error("Error saving notification preferences.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>;
  }
  return <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
      <div>
        <h3 className="font-bold text-heading text-lg mb-1">Notification Preferences</h3>
        <p className="text-sm text-caption">Configure delivery channels and system-level administrative alerts.</p>
      </div>

      <div className="space-y-6">
        {
    /* Global Delivery Channels */
  }
        <div className="bg-gray-50 rounded-2xl border border-border p-6 space-y-4">
          <h4 className="font-bold text-heading text-sm uppercase tracking-wider text-caption mb-4">Delivery Channels</h4>

          <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading">Email Notifications</div>
                <div className="text-xs text-caption mt-0.5">Receive digests and high-priority administrative emails.</div>
              </div>
            </div>
            <input
    type="checkbox"
    checked={emailNotifications}
    onChange={(e) => setEmailNotifications(e.target.checked)}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
          </label>

          <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading">In-App Notifications</div>
                <div className="text-xs text-caption mt-0.5">Live popup alerts and navbar bell updates while browsing.</div>
              </div>
            </div>
            <input
    type="checkbox"
    checked={inAppNotifications}
    onChange={(e) => setInAppNotifications(e.target.checked)}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
          </label>
        </div>

        {
    /* System / Admin Alerts */
  }
        <div className="bg-gray-50 rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-heading text-base">System & Admin Alerts</h4>
          </div>
          <p className="text-xs text-caption mb-4">Select which critical event categories trigger admin warnings.</p>

          <div className="space-y-3">
            {
    /* New User Registrations */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">New User Registrations</div>
                  <div className="text-xs text-caption">Alert when a new instructor or admin account registers.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={systemAlerts.newUserRegistrations}
    onChange={() => handleToggleSystemAlert("newUserRegistrations")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Failed Background Jobs */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Failed Background Jobs</div>
                  <div className="text-xs text-caption">Alert when cron tasks, certificate renders, or emails fail.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={systemAlerts.failedBackgroundJobs}
    onChange={() => handleToggleSystemAlert("failedBackgroundJobs")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Storage Warnings */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Storage & Disk Capacity Warnings</div>
                  <div className="text-xs text-caption">Alert when upload disk usage exceeds 80% threshold.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={systemAlerts.storageWarnings}
    onChange={() => handleToggleSystemAlert("storageWarnings")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Security Alerts */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Security & Anomaly Alerts</div>
                  <div className="text-xs text-caption">Alert on multiple failed logins, unrecognized IPs, or role escalations.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={systemAlerts.securityAlerts}
    onChange={() => handleToggleSystemAlert("securityAlerts")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
    type="submit"
    disabled={saving}
    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors disabled:opacity-50"
  >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Preferences
        </button>
      </div>
    </form>;
};
var stdin_default = NotificationsTab;
export {
  stdin_default as default
};
