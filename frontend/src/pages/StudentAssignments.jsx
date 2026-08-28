import { useState, useEffect, useMemo } from "react";
import { Search, Filter, CheckCircle2, Clock, Calendar, UploadCloud, Eye, MessageSquare, Briefcase, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { studentApi } from "../api/studentApi";
import CustomSelect from "../components/common/CustomSelect";

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [sortBy, setSortBy] = useState("Due Date");

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const response = await studentApi.getAssignments();
        if (response.success && Array.isArray(response.data)) {
          setAssignments(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch student assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const courses = ["All Courses", ...Array.from(new Set(assignments.map((a) => a.course).filter(Boolean)))];
  const statuses = ["All", "Pending", "Submitted", "Under Review", "Graded", "Resubmission Required"];

  const filteredAssignments = useMemo(() => {
    let result = assignments.filter((assignment) => {
      if (statusFilter !== "All" && assignment.status !== statusFilter) return false;
      if (courseFilter !== "All Courses" && assignment.course !== courseFilter) return false;
      if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === "Due Date") {
        return new Date(a.dueDate || "2099-01-01").getTime() - new Date(b.dueDate || "2099-01-01").getTime();
      }
      if (sortBy === "Course Name") {
        return (a.course || "").localeCompare(b.course || "");
      }
      return 0;
    });

    return result;
  }, [assignments, searchQuery, statusFilter, courseFilter, sortBy]);

  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter((a) => a.status === "Pending" || a.status === "Overdue").length;
  const submittedAssignments = assignments.filter((a) => a.status === "Submitted" || a.status === "Under Review").length;
  const gradedAssignments = assignments.filter((a) => a.status === "Graded").length;

  const handleAction = (assignmentId) => {
    navigate(`/student/assignment/${assignmentId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Graded":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Submitted":
      case "Under Review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Resubmission Required":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-heading">My Assignments</h1>
        <p className="text-body mt-2 mb-8">Manage and submit real assignments from your enrolled courses.</p>

        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
            <div>
              <CustomSelect
                options={courses.map((cat) => ({ value: cat, label: cat }))}
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              />
            </div>

            <div>
              <CustomSelect
                options={statuses.map((st) => ({ value: st, label: st === "All" ? "All Statuses" : st }))}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>

            <div>
              <CustomSelect
                options={[
                  { value: "Due Date", label: "Sort by Due Date" },
                  { value: "Course Name", label: "Sort by Course Name" }
                ]}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-caption font-bold uppercase tracking-wider block mb-1">Total Assignments</span>
          <span className="text-2xl font-bold text-heading">{totalAssignments}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-orange-600 font-bold uppercase tracking-wider block mb-1">Pending</span>
          <span className="text-2xl font-bold text-orange-600">{pendingAssignments}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-1">Submitted</span>
          <span className="text-2xl font-bold text-blue-600">{submittedAssignments}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block mb-1">Graded</span>
          <span className="text-2xl font-bold text-emerald-600">{gradedAssignments}</span>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  <span className="text-xs text-caption font-semibold bg-gray-100 px-2.5 py-0.5 rounded-md">
                    {assignment.course}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-heading">{assignment.title}</h3>

                <div className="flex items-center gap-4 text-xs text-caption font-medium flex-wrap">
                  <span>Module: {assignment.module}</span>
                  <span>Max Marks: {assignment.maxMarks}</span>
                  <span>Instructor: {assignment.instructor}</span>
                  {assignment.dueDate && <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>}
                </div>

                {assignment.submission?.feedback && (
                  <div className="bg-blue-50/70 border border-blue-200 text-blue-900 text-xs p-3 rounded-xl mt-2">
                    <strong>Instructor Feedback:</strong> {assignment.submission.feedback}
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => handleAction(assignment.id)}
                  className="w-full md:w-auto bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  {assignment.status === "Graded" ? "View Grade" : assignment.status === "Pending" ? "Submit Assignment" : "View Submission"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-border text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-heading text-lg">No Assignments Found</h3>
            <p className="text-caption text-sm max-w-sm mx-auto mt-1">
              You currently have no assignments assigned or matching your active search filter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
