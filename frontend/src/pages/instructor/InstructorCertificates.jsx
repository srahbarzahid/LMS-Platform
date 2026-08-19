import { useState, useEffect, useRef } from "react";
import {
  Award,
  Search,
  Filter,
  Eye,
  BarChart2,
  CheckCircle,
  Clock,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";

const CustomDropdown = ({ icon: Icon, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return <div className="relative shrink-0" ref={dropdownRef}>
      <button
    onClick={() => setIsOpen(!isOpen)}
    className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2 transition-all outline-none cursor-pointer min-w-[140px] text-left ${isOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:bg-gray-100"}`}
  >
        {Icon && <Icon className="w-3.5 h-3.5 text-caption" />}
        <span className="text-xs font-medium text-heading flex-1 truncate">
          {value === "" ? placeholder : value}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-caption transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && <div className="absolute top-full left-0 mt-2 w-full min-w-[160px] bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1.5 transform origin-top transition-all">
          <button
    onClick={() => {
      onChange("");
      setIsOpen(false);
    }}
    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${value === "" ? "text-primary bg-primary/5" : "text-heading"}`}
  >
            {placeholder}
          </button>
          {options.map((opt, idx) => <button
    key={idx}
    onClick={() => {
      onChange(opt);
      setIsOpen(false);
    }}
    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${value === opt ? "text-primary bg-primary/5" : "text-heading"}`}
  >
              {opt}
            </button>)}
        </div>}
    </div>;
};
const InstructorCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({ issued: 0, eligible: 0, pending: 0, avgCompletion: 0 });
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;

    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getCertificates();
        if (isMounted) {
          setCertificates(Array.isArray(response.data) ? response.data : []);
          setStats((prev) => ({ ...prev, ...(response.stats || {}) }));
          setCourseOptions(Array.isArray(response.courses) ? response.courses : []);
          setError("");
        }
      } catch (error) {
        if (isMounted) {
          setError(getApiErrorMessage(error, "Failed to load certificates"));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCertificates();
    return () => {
      isMounted = false;
    };
  }, []);
  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch = c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || c.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) || c.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "" ? true : c.courseName === filterCourse;
    const matchesStatus = filterStatus === "" ? true : c.certificateStatus === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "Student Name") return a.studentName.localeCompare(b.studentName);
    if (sortBy === "Oldest") return new Date(a.completionDate || a.enrollmentDate).getTime() - new Date(b.completionDate || b.enrollmentDate).getTime();
    return new Date(b.completionDate || b.enrollmentDate).getTime() - new Date(a.completionDate || a.enrollmentDate).getTime();
  });
  return <div className="max-w-7xl mx-auto space-y-6 pb-8">
      
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Certificates</h1>
          <p className="text-body mt-1">Monitor certificate eligibility and issued certificates for students enrolled in your courses.</p>
        </div>
      </div>

      {
    /* Statistics Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Certificates Issued",
            value: stats.issued.toLocaleString(),
            icon: <Award className="w-5 h-5 text-blue-500" />,
            color: "bg-blue-50",
            trendText: stats.issued === 0 ? "No records issued" : `${stats.issued} issued`,
            trendType: stats.issued > 0 ? "up" : "neutral",
            changeText: stats.issued > 0 ? "+100%" : "0%"
          },
          {
            title: "Eligible Students",
            value: stats.eligible.toLocaleString(),
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
            color: "bg-green-50",
            trendText: stats.eligible === 0 ? "No students eligible" : `${stats.eligible} ready`,
            trendType: stats.eligible > 0 ? "up" : "neutral",
            changeText: stats.eligible > 0 ? "+100%" : "0%"
          },
          {
            title: "Pending Certificates",
            value: stats.pending.toLocaleString(),
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            color: "bg-orange-50",
            trendText: stats.pending === 0 ? "No active progress" : `${stats.pending} in progress`,
            trendType: stats.pending > 0 ? "up" : "neutral",
            changeText: stats.pending > 0 ? "+100%" : "0%"
          },
          {
            title: "Avg Course Completion",
            value: `${stats.avgCompletion}%`,
            icon: <BarChart2 className="w-5 h-5 text-purple-500" />,
            color: "bg-purple-50",
            trendText: stats.avgCompletion === 0 ? "No progress data" : `${stats.avgCompletion}% average progress`,
            trendType: stats.avgCompletion >= 50 ? "up" : "neutral",
            changeText: stats.avgCompletion > 0 ? `+${stats.avgCompletion}%` : "0%"
          }
        ].map((stat, idx) => <div key={idx} className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-caption uppercase tracking-wider mb-1">{stat.title}</div>
              <div className="text-2xl font-heading font-bold text-heading">{stat.value}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                  stat.trendType === "up" ? "bg-green-100 text-green-700" : stat.trendType === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {stat.trendType === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trendType === "down" && <TrendingDown className="w-3 h-3" />}
                  {stat.trendType === "neutral" && <Minus className="w-3 h-3" />}
                  {stat.changeText}
                </span>
                <span className="text-xs text-caption font-medium">{stat.trendText}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>)}
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80 shrink-0">
          <input
    type="text"
    placeholder="Search Student or ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto z-10 relative">
          <CustomDropdown
    icon={Filter}
    placeholder="Filter Course"
    value={filterCourse}
    onChange={setFilterCourse}
    options={courseOptions}
  />
          <CustomDropdown
    placeholder="Filter Status"
    value={filterStatus}
    onChange={setFilterStatus}
    options={["Issued", "Eligible", "Pending"]}
  />
          <CustomDropdown
    placeholder="Sort By: Latest"
    value={sortBy}
    onChange={setSortBy}
    options={["Oldest", "Student Name"]}
  />
        </div>
      </div>

      {
    /* Certificates List */
  }
      {error ? <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center text-red-600 font-bold">{error}</div> : loading ? <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div> : filteredCertificates.length > 0 ? <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Student</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Course</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Completion Date</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Issued Date</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Certificate ID</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCertificates.map((cert) => <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {cert.studentAvatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-heading text-sm">{cert.studentName}</h3>
                          <div className="text-[11px] text-caption">{cert.studentEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-heading">{cert.courseName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-heading">{cert.completionDate || "--"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-heading">{cert.issueDate || "--"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${cert.certificateStatus === "Issued" ? "bg-green-100 text-green-700" : cert.certificateStatus === "Eligible" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                        {cert.certificateStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-mono text-heading">{cert.certificateId !== "N/A" ? cert.certificateId : "--"}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
    onClick={() => navigate(`/instructor/certificates/${cert.id}`)}
    title="View Details"
    className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
  >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => navigate(`/instructor/students/${cert.studentId}/progress`)}
    title="View Progress"
    className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
  >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-heading mb-2">No certificates issued yet</h2>
          <p className="text-body max-w-md mx-auto">
            No certificates have been issued for your courses yet. Certificates will automatically appear after students successfully complete the course.
          </p>
        </div>}

    </div>;
};
var stdin_default = InstructorCertificates;
export {
  stdin_default as default
};
