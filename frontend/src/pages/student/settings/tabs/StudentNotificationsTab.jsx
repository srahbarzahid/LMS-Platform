import { useState, useEffect } from "react";
import { Mail, Smartphone, BookOpen, Save, RefreshCw, FileText, Award, Clock, Megaphone } from "lucide-react";
import toast from "react-hot-toast";
const StudentNotificationsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [courseNotifications, setCourseNotifications] = useState({
    newAssignment: true,
    gradePosted: true,
    deadlineReminder: true,
    announcements: true
  });
  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/settings/notifications", {
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
        if (data.data.courseNotifications) {
          setCourseNotifications({
            newAssignment: !!data.data.courseNotifications.newAssignment,
            gradePosted: !!data.data.courseNotifications.gradePosted,
            deadlineReminder: !!data.data.courseNotifications.deadlineReminder,
            announcements: !!data.data.courseNotifications.announcements
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch student notification preferences:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleCourseNotification = (key) => {
    setCourseNotifications((prev) => ({
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
      courseNotifications
    };
    try {
      const res = await fetch("/api/student/settings/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ notificationPreferences: payload })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success("Notification preferences saved successfully!");
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
        <p className="text-sm text-caption">Configure delivery channels and course-level alerts.</p>
      </div>

      <div className="space-y-6">
        {
    /* Global Delivery Channels */
  }
        <div className="bg-gray-50 rounded-2xl border border-border p-6 space-y-4">
          <h4 className="font-bold text-heading text-xs uppercase tracking-wider text-caption mb-4">Delivery Channels</h4>

          <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading">Email Notifications</div>
                <div className="text-xs text-caption mt-0.5">Receive course updates and deadline reminders via email.</div>
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
                <div className="text-xs text-caption mt-0.5">Live popup alerts and navbar bell updates while logged in.</div>
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
    /* Course & Learning Alerts */
  }
        <div className="bg-gray-50 rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-heading text-base">Course & Learning Notifications</h4>
          </div>
          <p className="text-xs text-caption mb-4">Choose which student activity updates trigger alerts.</p>

          <div className="space-y-3">
            {
    /* New Assignment */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">New Assignment Published</div>
                  <div className="text-xs text-caption">Alert when an instructor posts a new assignment or project.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={courseNotifications.newAssignment}
    onChange={() => handleToggleCourseNotification("newAssignment")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Grade Posted */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Grade / Feedback Posted</div>
                  <div className="text-xs text-caption">Alert when grades or review feedback are released.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={courseNotifications.gradePosted}
    onChange={() => handleToggleCourseNotification("gradePosted")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Deadline Reminders */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Assignment Deadline Reminders</div>
                  <div className="text-xs text-caption">Alert 24 hours before assignment or quiz due dates.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={courseNotifications.deadlineReminder}
    onChange={() => handleToggleCourseNotification("deadlineReminder")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Announcements */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Course & Platform Announcements</div>
                  <div className="text-xs text-caption">Alert when instructors or admins publish announcements.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={courseNotifications.announcements}
    onChange={() => handleToggleCourseNotification("announcements")}
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
    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-secondary transition-colors disabled:opacity-50"
  >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Preferences
        </button>
      </div>
    </form>;
};
var stdin_default = StudentNotificationsTab;
export {
  stdin_default as default
};
