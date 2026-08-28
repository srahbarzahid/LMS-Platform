import { useState, useEffect } from "react";
import { User, Mail, Phone, BookOpen, Clock, FileText, Award, CheckCircle, Download, Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import apiClient from "../../../api/client";

const AdminStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedCourseProgress, setSelectedCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [enrolledCoursesList, setEnrolledCoursesList] = useState([]);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await apiClient.get(`/admin/users/students/${id}`);
      } catch (e) {
        res = await apiClient.get(`/admin/users/${id}`);
      }
      if (res.data) {
        setStudent(res.data.student || res.data);
        setEditFormData(res.data.student || res.data);
        setPayments(res.data.payments || []);
        setActivities(res.data.activities || []);
        setEnrolledCoursesList(res.data.enrolledCoursesList || []);
      }
    } catch (err) {
      console.error("Failed to load student details:", err);
      toast.error("Failed to load student details from database");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "learning", label: "Learning Info", icon: BookOpen },
    { id: "payments", label: "Payments", icon: FileText },
    { id: "activity", label: "Activity Timeline", icon: Clock }
  ];

  const handleDownloadInvoice = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text("PAYMENT INVOICE", 20, 25);
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${payment.id}`, 20, 35);
    doc.text(`Date: ${payment.date}`, 20, 42);
    doc.text(`Status: ${payment.status}`, 20, 49);

    doc.line(20, 55, 190, 55);

    doc.setFontSize(12);
    doc.text("Billed To:", 20, 65);
    doc.setFontSize(10);
    doc.text(`Student: ${student?.name || "N/A"}`, 20, 72);
    doc.text(`Email: ${student?.email || "N/A"}`, 20, 79);

    doc.line(20, 85, 190, 85);

    doc.setFontSize(12);
    doc.text("Description", 20, 95);
    doc.text("Amount", 160, 95);

    doc.setFontSize(10);
    doc.text(payment.course || "Course Purchase", 20, 105);
    doc.text(payment.amount || "₹0", 160, 105);

    doc.line(20, 115, 190, 115);

    doc.setFontSize(12);
    doc.text("Total Paid:", 120, 125);
    doc.text(payment.amount || "₹0", 160, 125);

    doc.save(`${payment.id}_Invoice.pdf`);
    toast.success(`Downloaded invoice ${payment.id}`);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await apiClient.post(`/admin/users/${id}/reset-password`, { password: newPassword });
      toast.success("Password reset successfully");
      setResetPasswordModalOpen(false);
      setNewPassword("");
    } catch (err) {
      toast.error("Failed to reset password");
    }
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch(`/admin/users/${id}/status`, { status: editFormData.status });
      setStudent(editFormData);
      toast.success("Profile updated successfully");
      setEditProfileModalOpen(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-body font-medium">Loading Real Student Details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center text-caption font-medium">
        Student record not found.
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/students")}
        className="flex items-center gap-2 text-caption hover:text-primary mb-6 transition-colors font-medium text-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Students List
      </button>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 lg:p-8 border border-border dark:border-neutral-800 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-3xl shrink-0">
            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-heading dark:text-white">{student.name}</h1>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${student.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"}`}>
                {student.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-caption">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> {student.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" /> {student.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setResetPasswordModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-border dark:border-neutral-700 text-heading dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Reset Password
          </button>
          <button
            onClick={() => setEditProfileModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-border dark:border-neutral-800 mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-caption hover:text-heading dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 lg:p-8 border border-border dark:border-neutral-800 shadow-sm space-y-8 min-h-[560px]">
          <div>
            <h3 className="text-lg font-bold text-heading dark:text-white mb-6">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-base font-semibold text-heading dark:text-white">{student.name}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-base font-semibold text-heading dark:text-white">{student.email}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-base font-semibold text-heading dark:text-white">{student.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Joined Date</p>
                <p className="text-base font-semibold text-heading dark:text-white">{student.joinedDate}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl md:col-span-2">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Account Status</p>
                <p className="text-base font-semibold text-heading dark:text-white">{student.status} Profile</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "learning" && (
        <div className="space-y-6 min-h-[560px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Enrolled Courses</p>
                <p className="text-2xl font-bold text-heading dark:text-white">{student.enrolledCourses}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Completed Courses</p>
                <p className="text-2xl font-bold text-heading dark:text-white">{student.completedCourses}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Award className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Certificates Earned</p>
                <p className="text-2xl font-bold text-heading dark:text-white">{student.certificates}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCoursesList.length > 0 ? (
              enrolledCoursesList.map((course) => (
                <div key={course.id} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={course.image} alt={course.title} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div>
                      <h4 className="font-bold text-heading dark:text-white text-base line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-caption mt-1">Last accessed: {course.lastAccessed}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-caption">Progress</span>
                      <span className="text-primary">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCourseProgress(course)}
                    className="w-full py-2.5 rounded-xl border border-border dark:border-neutral-700 text-xs font-bold text-heading dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    View Curriculum Progress
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-border dark:border-neutral-800 text-center text-caption font-medium">
                No active course enrollments found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 lg:p-8 border border-border dark:border-neutral-800 shadow-sm space-y-6 min-h-[560px]">
          <h3 className="text-lg font-bold text-heading dark:text-white">Transaction History</h3>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border dark:border-neutral-800 text-caption text-xs font-bold uppercase">
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-neutral-800 text-sm">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                      <td className="py-4 px-4 font-bold text-heading dark:text-white">{payment.id}</td>
                      <td className="py-4 px-4 font-medium text-body dark:text-neutral-300">{payment.course}</td>
                      <td className="py-4 px-4 text-caption">{payment.date}</td>
                      <td className="py-4 px-4 font-bold text-heading dark:text-white">{payment.amount}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(payment)}
                          className="p-2 text-caption hover:text-primary transition-colors"
                          title="Download Invoice PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-caption font-medium">
              No payment transactions found for this student.
            </div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 lg:p-8 border border-border dark:border-neutral-800 shadow-sm space-y-6 min-h-[560px]">
          <h3 className="text-lg font-bold text-heading dark:text-white">Activity Timeline</h3>
          <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100 dark:before:bg-neutral-800">
            {activities.map((act) => (
              <div key={act.id} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 z-10">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-heading dark:text-white text-sm">{act.title}</h4>
                  <p className="text-xs text-body dark:text-neutral-300 mt-0.5">{act.description}</p>
                  <span className="text-[11px] text-caption font-medium mt-1 block">{act.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Modal */}
      {selectedCourseProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-heading dark:text-white">{selectedCourseProgress.title}</h3>
              <button onClick={() => setSelectedCourseProgress(null)}><X className="w-5 h-5 text-caption" /></button>
            </div>
            <div className="space-y-3">
              {selectedCourseProgress.modules.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl text-sm">
                  <span className="font-medium text-heading dark:text-white">{m.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-heading dark:text-white">Reset Student Password</h3>
              <button onClick={() => setResetPasswordModalOpen(false)}><X className="w-5 h-5 text-caption" /></button>
            </div>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-caption uppercase mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-caption"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90">
                Confirm Reset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentDetails;
