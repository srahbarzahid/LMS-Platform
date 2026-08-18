import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  User,
  Book,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  Check,
  Activity,
  BarChart2
} from "lucide-react";
const CircularProgress = ({ percentage, color = "text-primary" }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  return <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
    className="text-gray-100"
    strokeWidth="8"
    stroke="currentColor"
    fill="transparent"
    r={radius}
    cx="48"
    cy="48"
  />
        <circle
    className={`${color} transition-all duration-1000 ease-out`}
    strokeWidth="8"
    strokeDasharray={circumference}
    strokeDashoffset={strokeDashoffset}
    strokeLinecap="round"
    stroke="currentColor"
    fill="transparent"
    r={radius}
    cx="48"
    cy="48"
  />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold text-heading">{percentage}%</span>
      </div>
    </div>;
};
const ProgressBar = ({ label, completed, total, color }) => {
  const percentage = total === 0 ? 0 : Math.round(completed / total * 100);
  return <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-heading">{label}</span>
        <span className="text-caption font-bold">{completed} / {total}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
    className={`h-2 rounded-full ${color}`}
    style={{ width: `${percentage}%` }}
  />
      </div>
    </div>;
};
const InstructorCertificateDetails = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [progress, setProgress] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const [detailsRes, progressRes, timelineRes] = await Promise.all([
          fetch(`/api/instructor/certificates/${certificateId}`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`/api/instructor/certificates/${certificateId}/progress`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`/api/instructor/certificates/${certificateId}/student`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);
        if (detailsRes.ok && progressRes.ok && timelineRes.ok) {
          const detailsData = await detailsRes.json();
          const progressData = await progressRes.json();
          const timelineData = await timelineRes.json();
          setDetails(detailsData.data);
          setProgress(progressData.data);
          setTimeline(timelineData.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [certificateId]);
  if (loading) {
    return <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  if (error || !details) {
    return <div className="max-w-7xl mx-auto space-y-6 pb-8 text-center pt-12">
        <h2 className="text-2xl font-bold text-heading">Certificate Not Found</h2>
        <p className="text-body mt-2">The certificate you are looking for does not exist or you don't have access.</p>
        <button
      onClick={() => navigate("/instructor/certificates")}
      className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-bold"
    >
          Back to Certificates
        </button>
      </div>;
  }
  return <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
    onClick={() => navigate("/instructor/certificates")}
    className="p-2 hover:bg-white rounded-xl transition-colors text-heading"
  >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-heading">Certificate Details</h1>
            <p className="text-sm text-caption mt-1">Viewing certificate information for {details.studentName}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${details.certificateStatus === "Issued" ? "bg-green-100 text-green-700" : details.certificateStatus === "Eligible" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
          {details.certificateStatus === "Issued" && <CheckCircle className="w-4 h-4" />}
          {details.certificateStatus === "Pending" && <Clock className="w-4 h-4" />}
          {details.certificateStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Left Column - Details */
  }
        <div className="lg:col-span-2 space-y-6">
          
          {
    /* Info Cards Row */
  }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
    /* Student Info */
  }
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-sm font-bold text-caption uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Student Information
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold shrink-0">
                  {details.studentAvatar}
                </div>
                <div>
                  <h4 className="font-bold text-heading text-lg">{details.studentName}</h4>
                  <div className="text-sm text-caption flex items-center gap-1 mt-1">
                    <Mail className="w-3.5 h-3.5" /> {details.studentEmail}
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-caption">Enrollment Date</span>
                  <span className="font-medium text-heading flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {details.enrollmentDate}
                  </span>
                </div>
              </div>
            </div>

            {
    /* Course Info */
  }
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-sm font-bold text-caption uppercase tracking-wider mb-4 flex items-center gap-2">
                <Book className="w-4 h-4" /> Course Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-caption mb-1">Course Name</div>
                  <div className="font-bold text-heading">{details.courseName}</div>
                </div>
                <div>
                  <div className="text-xs text-caption mb-1">Completion Status</div>
                  <div className="font-bold text-heading text-primary">{progress?.overall}% Completed</div>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-border">
                  <span className="text-caption">Completion Date</span>
                  <span className="font-medium text-heading">
                    {details.completionDate || "Not Completed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Progress */
  }
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-bold text-caption uppercase tracking-wider mb-6 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Course Progress
            </h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex flex-col items-center">
                <CircularProgress percentage={progress?.overall || 0} color={progress?.overall === 100 ? "text-green-500" : "text-primary"} />
                <span className="text-sm font-bold text-heading mt-3">Overall Progress</span>
              </div>
              <div className="flex-1 w-full space-y-4">
                <ProgressBar label="Lessons" completed={progress?.lessons.completed} total={progress?.lessons.total} color="bg-blue-500" />
                <ProgressBar label="Quizzes" completed={progress?.quizzes.completed} total={progress?.quizzes.total} color="bg-orange-500" />
                <ProgressBar label="Assignments" completed={progress?.assignments.completed} total={progress?.assignments.total} color="bg-purple-500" />
                <ProgressBar label="Projects" completed={progress?.projects.completed} total={progress?.projects.total} color="bg-green-500" />
              </div>
            </div>
          </div>

          {
    /* Certificate Info */
  }
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-bold text-caption uppercase tracking-wider mb-6 flex items-center gap-2">
              <Award className="w-4 h-4" /> Certificate Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-caption mb-1">Certificate ID</div>
                <div className="font-bold text-heading font-mono">{details.certificateId}</div>
              </div>
              <div>
                <div className="text-xs text-caption mb-1">Status</div>
                <div className="font-bold text-heading">{details.certificateStatus}</div>
              </div>
              <div>
                <div className="text-xs text-caption mb-1">Issued Date</div>
                <div className="font-bold text-heading">{details.issueDate || "--"}</div>
              </div>
              <div>
                <div className="text-xs text-caption mb-1">Template</div>
                <div className="font-bold text-heading">{details.templateName}</div>
              </div>
              <div>
                <div className="text-xs text-caption mb-1">QR Verification</div>
                <div className="font-bold text-heading">{details.qrVerification}</div>
              </div>
            </div>
            {details.certificateStatus === "Issued" && <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-green-800 text-sm">Certificate Successfully Issued</h4>
                  <p className="text-green-700 text-sm mt-1">This certificate has been generated and sent to the student. It is available in their student portal for download and verification.</p>
                </div>
              </div>}
          </div>

        </div>

        {
    /* Right Column - Timeline */
  }
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-sm font-bold text-caption uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Activity Timeline
          </h3>
          <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {timeline.map((item, idx) => <div key={idx} className="relative">
                <div className="flex items-center mb-1">
                  <div className={`absolute -left-[33px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm
                    ${item.status === "completed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}
                  `}>
                    {item.status === "completed" ? <Check className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <h4 className={`text-sm font-bold ${item.status === "completed" ? "text-heading" : "text-caption"}`}>{item.title}</h4>
                </div>
                {item.date && <div className="text-xs text-caption">{item.date}</div>}
              </div>)}
          </div>
        </div>

      </div>
    </div>;
};
var stdin_default = InstructorCertificateDetails;
export {
  stdin_default as default
};
