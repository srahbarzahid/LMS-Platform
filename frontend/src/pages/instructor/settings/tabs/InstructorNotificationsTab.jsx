import { useState, useEffect } from "react";
import { Mail, Smartphone, Users, Save, RefreshCw, FileCheck, HelpCircle, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import apiClient, { normalizeApiPath } from "../../../../api/client";
import { useTranslation } from "../../../../context/LanguageContext";

const InstructorNotificationsTab = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [studentActivityNotifications, setStudentActivityNotifications] = useState({
    assignmentSubmission: true,
    quizSubmission: true,
    newEnrollment: true,
    discussionReplies: true
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(normalizeApiPath("/instructor/settings/notifications"));
      const data = res.data;
      if (data.status === "success" && data.data) {
        if (typeof data.data.emailNotifications === "boolean") {
          setEmailNotifications(data.data.emailNotifications);
        }
        if (typeof data.data.inAppNotifications === "boolean") {
          setInAppNotifications(data.data.inAppNotifications);
        }
        if (data.data.studentActivityNotifications) {
          setStudentActivityNotifications({
            assignmentSubmission: !!data.data.studentActivityNotifications.assignmentSubmission,
            quizSubmission: !!data.data.studentActivityNotifications.quizSubmission,
            newEnrollment: !!data.data.studentActivityNotifications.newEnrollment,
            discussionReplies: !!data.data.studentActivityNotifications.discussionReplies
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch instructor notification preferences:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleActivity = (key) => {
    setStudentActivityNotifications((prev) => ({
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
      studentActivityNotifications
    };
    try {
      const res = await fetch("/api/instructor/settings/notifications", {
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
        <p className="text-sm text-caption">Configure delivery channels and student activity alerts.</p>
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
                <div className="text-xs text-caption mt-0.5">Receive student submission alerts and updates via email.</div>
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
    /* Student Activity & Submission Notifications */
  }
        <div className="bg-gray-50 rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-heading text-base">Student Activity & Submissions</h4>
          </div>
          <p className="text-xs text-caption mb-4">Choose which student activities trigger instructor notifications.</p>

          <div className="space-y-3">
            {
    /* Assignment Submitted */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Assignment Submitted</div>
                  <div className="text-xs text-caption">Alert when a student submits an assignment project for review.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={studentActivityNotifications.assignmentSubmission}
    onChange={() => handleToggleActivity("assignmentSubmission")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Quiz Submitted */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Quiz Submitted</div>
                  <div className="text-xs text-caption">Alert when a student completes a course quiz assessment.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={studentActivityNotifications.quizSubmission}
    onChange={() => handleToggleActivity("quizSubmission")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* New Enrollment */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">New Course Enrollment</div>
                  <div className="text-xs text-caption">Alert when a new student enrolls in one of your courses.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={studentActivityNotifications.newEnrollment}
    onChange={() => handleToggleActivity("newEnrollment")}
    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
  />
            </label>

            {
    /* Discussion / Q&A Replies */
  }
            <label className="flex items-center justify-between p-4 bg-white border border-border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-heading">Discussion & Q&A Replies</div>
                  <div className="text-xs text-caption">Alert when a student asks a question or posts a discussion reply.</div>
                </div>
              </div>
              <input
    type="checkbox"
    checked={studentActivityNotifications.discussionReplies}
    onChange={() => handleToggleActivity("discussionReplies")}
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
var stdin_default = InstructorNotificationsTab;
export {
  stdin_default as default
};
