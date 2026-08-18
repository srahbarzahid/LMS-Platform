import { useState, useMemo } from "react";
import { Search, Filter, CheckCircle2, Clock, Calendar, UploadCloud, Eye, MessageSquare, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const mockAssignments = [
  {
    id: 1,
    title: "Design a Robot Arm (CAD)",
    course: "Introduction to Robotics",
    module: "Module 4: Mechanical Design",
    type: "Project Submission",
    dueDate: "2026-07-10T23:59:59Z",
    maxMarks: 100,
    status: "Pending",
    // Pending, Submitted, Under Review, Graded, Overdue
    instructor: "Hisham"
  },
  {
    id: 2,
    title: "Write a UART Driver",
    course: "Mastering Embedded Systems & IoT",
    module: "Module 3: Serial Communication",
    type: "Code Submission",
    dueDate: "2026-07-01T23:59:59Z",
    maxMarks: 50,
    status: "Graded",
    instructor: "Dr. Sarah Jenkins"
  },
  {
    id: 3,
    title: "Build a Weather App",
    course: "Advanced React Native",
    module: "Module 6: API Integration",
    type: "GitHub Repository",
    dueDate: "2026-07-15T23:59:59Z",
    maxMarks: 80,
    status: "Submitted",
    instructor: "Marcus Chen"
  },
  {
    id: 4,
    title: "High-Fidelity App Prototype",
    course: "UI/UX Design Masterclass",
    module: "Module 5: Prototyping",
    type: "Figma Link",
    dueDate: "2026-06-25T23:59:59Z",
    maxMarks: 100,
    status: "Under Review",
    instructor: "Emma Watson"
  },
  {
    id: 5,
    title: "Blink an LED (FreeRTOS)",
    course: "Mastering Embedded Systems & IoT",
    module: "Module 8: RTOS Basics",
    type: "Code Submission",
    dueDate: "2026-06-10T23:59:59Z",
    maxMarks: 20,
    status: "Overdue",
    instructor: "Dr. Sarah Jenkins"
  }
];
const StudentAssignments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [sortBy, setSortBy] = useState("Due Date");
  const courses = ["All Courses", ...Array.from(new Set(mockAssignments.map((a) => a.course)))];
  const statuses = ["All", "Pending", "Submitted", "Under Review", "Graded", "Overdue"];
  const filteredAssignments = useMemo(() => {
    let result = mockAssignments.filter((assignment) => {
      if (statusFilter !== "All" && assignment.status !== statusFilter) return false;
      if (courseFilter !== "All Courses" && assignment.course !== courseFilter) return false;
      if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    result.sort((a, b) => {
      if (sortBy === "Due Date") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "Course Name") {
        return a.course.localeCompare(b.course);
      }
      return 0;
    });
    return result;
  }, [searchQuery, statusFilter, courseFilter, sortBy]);
  const totalAssignments = mockAssignments.length;
  const pendingAssignments = mockAssignments.filter((a) => a.status === "Pending" || a.status === "Overdue").length;
  const submittedAssignments = mockAssignments.filter((a) => a.status === "Submitted" || a.status === "Under Review").length;
  const gradedAssignments = mockAssignments.filter((a) => a.status === "Graded").length;
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
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  return <div className="space-y-8 pb-8">
      {
    /* Header */
  }
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-heading">My Assignments</h1>
        <p className="text-body mt-2 mb-8">Manage and submit assignments from your enrolled courses.</p>
        
        {
    /* Filters */
  }
        <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
    type="text"
    placeholder="Search assignments..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
  />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
            <div className="relative">
              <select
    value={courseFilter}
    onChange={(e) => setCourseFilter(e.target.value)}
    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
  >
                {courses.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
  >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
  >
                <option value="Recently Added">Recently Added</option>
                <option value="Due Date">Due Date</option>
                <option value="Course Name">Course Name</option>
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {
    /* Statistics */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Total Assignments</div>
            <div className="text-2xl font-heading font-bold text-heading">{totalAssignments}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Pending</div>
            <div className="text-2xl font-heading font-bold text-heading">{pendingAssignments}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Submitted</div>
            <div className="text-2xl font-heading font-bold text-heading">{submittedAssignments}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Graded</div>
            <div className="text-2xl font-heading font-bold text-heading">{gradedAssignments}</div>
          </div>
        </div>
      </div>

      {
    /* Assignments List */
  }
      {filteredAssignments.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => <div key={assignment.id} className="bg-white rounded-3xl border border-border shadow-sm p-6 flex flex-col hover:shadow-lg transition-shadow">
              
              {
    /* Card Header */
  }
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getStatusBadge(assignment.status)}`}>
                  {assignment.status}
                </span>
                <span className={`text-xs flex items-center gap-1 ${assignment.status === "Overdue" ? "text-red-500 font-bold" : "text-caption"}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>

              {
    /* Title & Course */
  }
              <h3 className="font-heading font-bold text-heading text-lg mb-1 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {assignment.title}
              </h3>
              <p className="text-sm text-primary font-medium mb-1 line-clamp-1">{assignment.course}</p>
              <p className="text-xs text-caption mb-5 line-clamp-1">{assignment.module}</p>

              {
    /* Details Grid */
  }
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-body mb-6 bg-gray-50 p-4 rounded-2xl mt-auto">
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption">Type</span>
                  <span className="font-bold text-heading truncate">{assignment.type}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption">Max Marks</span>
                  <span className="font-bold text-heading">{assignment.maxMarks}</span>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2">
                  <span className="text-caption">Instructor</span>
                  <span className="font-bold text-heading truncate">{assignment.instructor}</span>
                </div>
              </div>

              {
    /* Actions */
  }
              <div className="pt-4 border-t border-border mt-auto">
                {(assignment.status === "Pending" || assignment.status === "Overdue") && <button
    onClick={() => handleAction(assignment.id)}
    className="w-full py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
  >
                    <UploadCloud className="w-4 h-4" /> View & Submit
                  </button>}

                {(assignment.status === "Submitted" || assignment.status === "Under Review") && <button
    onClick={() => handleAction(assignment.id)}
    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-heading border border-border rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
  >
                    <Eye className="w-4 h-4" /> View Submission
                  </button>}

                {assignment.status === "Graded" && <button
    onClick={() => handleAction(assignment.id)}
    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
  >
                    <MessageSquare className="w-4 h-4" /> View Feedback & Marks
                  </button>}
              </div>

            </div>)}
        </div> : (
    /* Empty State */
    <div className="bg-white rounded-3xl border border-border p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Briefcase className="w-10 h-10 text-caption" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-heading mb-2">
            {searchQuery ? "No matching assignments found" : "You don't have any assignments yet."}
          </h2>
          <p className="text-body max-w-md mx-auto mb-8">
            {searchQuery ? "Try adjusting your search or filters to see more results." : "Enroll in courses that offer practical assignments to build your portfolio."}
          </p>
          {!searchQuery && <Link to="/courses" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20">
              Browse Courses
            </Link>}
        </div>
  )}

    </div>;
};
var stdin_default = StudentAssignments;
export {
  stdin_default as default
};
