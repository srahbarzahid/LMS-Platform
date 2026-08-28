import { useState, useEffect } from "react";
import { User, Mail, Phone, BookOpen, Clock, TrendingUp, Download, Eye, EyeOff, Award, ArrowLeft, X, Star, Users, CheckCircle, BarChart, DollarSign } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import apiClient from "../../../api/client";

const AdminInstructorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedCoursePerformance, setSelectedCoursePerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [instructor, setInstructor] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [publishedCoursesList, setPublishedCoursesList] = useState([]);

  useEffect(() => {
    fetchInstructorDetails();
  }, [id]);

  const fetchInstructorDetails = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await apiClient.get(`/admin/users/instructors/${id}`);
      } catch (e) {
        res = await apiClient.get(`/admin/users/${id}`);
      }
      if (res.data) {
        setInstructor(res.data.instructor || res.data);
        setEditFormData(res.data.instructor || res.data);
        setPayouts(res.data.payouts || []);
        setActivities(res.data.activities || []);
        setPublishedCoursesList(res.data.publishedCoursesList || []);
      }
    } catch (err) {
      console.error("Failed to load instructor details:", err);
      toast.error("Failed to load instructor details from database");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "teaching", label: "Courses & Teaching", icon: BookOpen },
    { id: "payouts", label: "Payouts", icon: DollarSign },
    { id: "activity", label: "Activity Timeline", icon: Clock }
  ];

  const handleDownloadPayoutStatement = (payout) => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text("PAYOUT STATEMENT", 20, 25);
    doc.setFontSize(10);
    doc.text(`Payout ID: ${payout.id}`, 20, 35);
    doc.text(`Date: ${payout.date}`, 20, 42);
    doc.text(`Period: ${payout.period}`, 20, 49);

    doc.line(20, 55, 190, 55);

    doc.setFontSize(12);
    doc.text("Instructor Details:", 20, 65);
    doc.setFontSize(10);
    doc.text(`Name: ${instructor?.name || "N/A"}`, 20, 72);
    doc.text(`Email: ${instructor?.email || "N/A"}`, 20, 79);

    doc.line(20, 85, 190, 85);

    doc.setFontSize(12);
    doc.text("Description", 20, 95);
    doc.text("Amount Paid", 160, 95);

    doc.setFontSize(10);
    doc.text(`Course Earnings (${payout.period})`, 20, 105);
    doc.text(payout.amount || "₹0", 160, 105);

    doc.line(20, 115, 190, 115);

    doc.setFontSize(12);
    doc.text("Net Paid Amount:", 120, 125);
    doc.text(payout.amount || "₹0", 160, 125);

    doc.save(`${payout.id}_PayoutStatement.pdf`);
    toast.success(`Downloaded statement ${payout.id}`);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-body font-medium">Loading Real Instructor Details...</p>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="p-8 text-center text-caption font-medium">
        Instructor record not found.
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/instructors")}
        className="flex items-center gap-2 text-caption hover:text-primary mb-6 transition-colors font-medium text-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Instructors List
      </button>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 lg:p-8 border border-border dark:border-neutral-800 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-heading font-black text-3xl shrink-0">
            {instructor.name ? instructor.name.charAt(0).toUpperCase() : "I"}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-heading dark:text-white">{instructor.name}</h1>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${instructor.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"}`}>
                {instructor.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-caption">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> {instructor.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" /> {instructor.phone}</span>
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
            <h3 className="text-lg font-bold text-heading dark:text-white mb-6">Instructor Profile & Qualifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-base font-semibold text-heading dark:text-white">{instructor.name}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-base font-semibold text-heading dark:text-white">{instructor.email}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-base font-semibold text-heading dark:text-white">{instructor.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Qualification</p>
                <p className="text-base font-semibold text-heading dark:text-white">{instructor.qualification}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Experience</p>
                <p className="text-base font-semibold text-heading dark:text-white">{instructor.experience}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                <p className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Expertise / Skills</p>
                <p className="text-base font-semibold text-heading dark:text-white">{instructor.skills}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "teaching" && (
        <div className="space-y-6 min-h-[560px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Published Courses</p>
                <p className="text-2xl font-bold text-heading dark:text-white">{instructor.courses}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Total Students</p>
                <p className="text-2xl font-bold text-heading dark:text-white">{instructor.students}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Total Revenue</p>
                <p className="text-2xl font-bold text-heading dark:text-white">₹{instructor.revenue?.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Star className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-caption font-semibold uppercase">Avg Rating</p>
                <p className="text-2xl font-bold text-heading dark:text-white">{instructor.rating}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedCoursesList.length > 0 ? (
              publishedCoursesList.map((course) => (
                <div key={course.id} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={course.image} alt={course.title} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div>
                      <h4 className="font-bold text-heading dark:text-white text-base line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-caption mt-1">{course.students} Enrolled Students • Rating: {course.rating} ★</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-sm">
                    <span className="text-caption font-medium">Earnings Generated</span>
                    <span className="font-bold text-emerald-600">{course.revenue}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-border dark:border-neutral-800 text-center text-caption font-medium">
                No active published courses found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "payouts" && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 lg:p-8 border border-border dark:border-neutral-800 shadow-sm space-y-6 min-h-[560px]">
          <h3 className="text-lg font-bold text-heading dark:text-white">Payout History</h3>
          {payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border dark:border-neutral-800 text-caption text-xs font-bold uppercase">
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-neutral-800 text-sm">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                      <td className="py-4 px-4 font-bold text-heading dark:text-white">{payout.id}</td>
                      <td className="py-4 px-4 font-medium text-body dark:text-neutral-300">{payout.period}</td>
                      <td className="py-4 px-4 text-caption">{payout.date}</td>
                      <td className="py-4 px-4 font-bold text-heading dark:text-white">{payout.amount}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDownloadPayoutStatement(payout)}
                          className="p-2 text-caption hover:text-primary transition-colors"
                          title="Download Statement PDF"
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
              No payout records found for this instructor.
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
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 z-10">
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
    </div>
  );
};

export default AdminInstructorDetails;
