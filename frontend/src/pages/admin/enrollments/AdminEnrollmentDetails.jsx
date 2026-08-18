import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, Clock, Tag, Activity, FileText, CheckCircle, Award, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
const AdminEnrollmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enrRes, progRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/admin/enrollments/${id}`),
          axios.get(`http://localhost:5000/api/admin/enrollments/${id}/progress`)
        ]);
        setEnrollment(enrRes.data.data);
        setProgress(progRes.data.data);
      } catch (err) {
        toast.error("Failed to load enrollment details");
        navigate("/admin/enrollments");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);
  if (loading) {
    return <div className="p-8 text-center text-caption font-medium">Loading details...</div>;
  }
  if (!enrollment) return null;
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center gap-4">
        <button
    onClick={() => navigate("/admin/enrollments")}
    className="p-2 border border-border rounded-xl text-heading hover:bg-gray-50 transition-colors"
  >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading flex items-center gap-3">
            Enrollment Details 
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${enrollment.status === "Active" ? "bg-indigo-50 text-indigo-700" : enrollment.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
              {enrollment.status}
            </span>
          </h1>
          <p className="text-body text-sm">ID: {enrollment.id} • Enrolled on {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
        </div>
      </div>

      {
    /* Top Banner: Progress Section */
  }
      {progress && <div className="bg-white p-8 rounded-3xl border border-border shadow-sm flex flex-col xl:flex-row items-center gap-10">
          <div className="flex-1 w-full xl:w-auto">
            <h3 className="font-heading font-bold text-heading text-xl mb-2 flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" /> Learning Progress
            </h3>
            <p className="text-body text-sm mb-6">Track the overall course completion and detailed assignment metrics.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-border transition-transform hover:scale-105 duration-300">
                <div className="text-caption text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Lessons
                </div>
                <div className="text-2xl font-bold text-heading">
                  {progress.lessons.completed} <span className="text-base text-caption font-medium">/ {progress.lessons.total}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-border transition-transform hover:scale-105 duration-300">
                <div className="text-caption text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Quizzes
                </div>
                <div className="text-2xl font-bold text-heading">
                  {progress.quizzes.completed} <span className="text-base text-caption font-medium">/ {progress.quizzes.total}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-border transition-transform hover:scale-105 duration-300">
                <div className="text-caption text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Assignments
                </div>
                <div className="text-2xl font-bold text-heading">
                  {progress.assignments.completed} <span className="text-base text-caption font-medium">/ {progress.assignments.total}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-border transition-transform hover:scale-105 duration-300">
                <div className="text-caption text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Last Active
                </div>
                <div className="text-lg font-bold text-heading mt-2 truncate" title={new Date(enrollment.lastActiveDate).toLocaleDateString()}>
                  {new Date(enrollment.lastActiveDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c2410c" /> {
    /* orange-700 */
  }
                    <stop offset="100%" stopColor="#fb923c" /> {
    /* orange-400 */
  }
                  </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="70" className="stroke-gray-100" strokeWidth="16" fill="none" />
                <circle
    cx="80"
    cy="80"
    r="70"
    stroke="url(#orangeGradient)"
    strokeWidth="16"
    fill="none"
    strokeLinecap="round"
    style={{ strokeDasharray: 440, strokeDashoffset: 440 - 440 * progress.overall / 100 }}
    className="transition-all duration-1000 ease-out"
  />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-heading font-black text-heading">{progress.overall}%</span>
                <span className="text-xs font-bold text-caption uppercase tracking-wider mt-1">Complete</span>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Info Cards Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
    /* Student Info */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col">
          <h3 className="font-heading font-bold text-heading mb-6 flex items-center gap-2 pb-4 border-b border-border/50">
            <User className="w-5 h-5 text-primary" /> Student Information
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0 shadow-sm">
              {enrollment.studentName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-heading text-lg">{enrollment.studentName}</div>
              <div className="text-sm text-caption">ID: {enrollment.studentId}</div>
            </div>
          </div>
          <div className="space-y-4 mt-auto">
            <div className="flex items-center gap-3 text-body bg-gray-50 p-3 rounded-xl border border-border/50">
              <Mail className="w-4 h-4 text-primary shrink-0" /> <span className="truncate">{enrollment.studentEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-body bg-gray-50 p-3 rounded-xl border border-border/50">
              <Phone className="w-4 h-4 text-primary shrink-0" /> <span>{enrollment.studentPhone}</span>
            </div>
            <div className="flex items-center gap-3 text-body bg-gray-50 p-3 rounded-xl border border-border/50">
              <Calendar className="w-4 h-4 text-primary shrink-0" /> <span>Joined {new Date(enrollment.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {
    /* Course Info */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col">
          <h3 className="font-heading font-bold text-heading mb-6 flex items-center gap-2 pb-4 border-b border-border/50">
            <BookOpen className="w-5 h-5 text-primary" /> Course Information
          </h3>
          <div className="mb-6">
            <div className="font-bold text-heading text-xl mb-2 leading-tight">{enrollment.courseName}</div>
            <div className="text-sm text-caption flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-3 h-3 text-gray-500" />
              </div>
              {enrollment.instructorName}
            </div>
          </div>
          <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between text-body bg-gray-50 p-3 rounded-xl border border-border/50">
              <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Category</span>
              <span className="font-bold text-heading text-right">{enrollment.category}</span>
            </div>
            <div className="flex items-center justify-between text-body bg-gray-50 p-3 rounded-xl border border-border/50">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Duration</span>
              <span className="font-bold text-heading text-right">{enrollment.courseDuration}</span>
            </div>
          </div>
        </div>

        {
    /* Payment & Cert Info */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col">
          <h3 className="font-heading font-bold text-heading mb-6 flex items-center gap-2 pb-4 border-b border-border/50">
            <CreditCard className="w-5 h-5 text-primary" /> Payment & Certificate
          </h3>
          <div className="space-y-4 text-sm mb-6 flex-1">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-border/50">
              <span className="text-body font-medium">Amount Paid</span>
              <span className="font-bold text-heading text-lg">₹{enrollment.amountPaid}</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-border/50">
              <span className="text-body font-medium">Payment Status</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${enrollment.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
                {enrollment.paymentStatus}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-border/50">
              <span className="text-body font-medium">Transaction ID</span>
              <span className="font-bold text-heading text-xs font-mono">{enrollment.transactionId}</span>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-body font-medium flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Certificate</span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${enrollment.certificateStatus === "Issued" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : enrollment.certificateStatus === "Eligible" ? "bg-yellow-400 text-yellow-900 shadow-md shadow-yellow-400/20" : "bg-gray-100 text-gray-500"}`}>
                {enrollment.certificateStatus}
              </span>
            </div>
            {enrollment.certificateId && <div className="flex items-center justify-between mt-3 bg-gray-50 p-3 rounded-xl border border-border/50">
                <span className="text-body text-sm font-medium">Cert ID</span>
                <span className="font-bold text-heading text-xs font-mono">{enrollment.certificateId}</span>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = AdminEnrollmentDetails;
export {
  stdin_default as default
};
