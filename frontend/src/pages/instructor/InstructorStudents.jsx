import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Users,
  CheckCircle,
  Activity,
  BarChart,
  Award,
  FileText,
  Eye,
  BarChart2,
  Folder,
  Clock,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
const InstructorStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProgress, setFilterProgress] = useState("");
  const [sortBy, setSortBy] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setStudents([
        {
          id: "1",
          studentId: "stu_1",
          name: "Alice Smith",
          email: "alice.smith@example.com",
          avatar: "A",
          course: "UI/UX Masterclass",
          progress: 85,
          lastActive: "2 hours ago",
          courseStatus: "Active",
          certificateStatus: "Pending"
        },
        {
          id: "2a",
          studentId: "stu_2",
          name: "Bob Johnson",
          email: "bob.j@example.com",
          avatar: "B",
          course: "UI/UX Masterclass",
          progress: 100,
          lastActive: "1 day ago",
          courseStatus: "Completed",
          certificateStatus: "Generated"
        },
        {
          id: "2b",
          studentId: "stu_2",
          name: "Bob Johnson",
          email: "bob.j@example.com",
          avatar: "B",
          course: "React Architecture",
          progress: 10,
          lastActive: "1 day ago",
          courseStatus: "Active",
          certificateStatus: "Pending"
        },
        {
          id: "3",
          studentId: "stu_3",
          name: "Charlie Brown",
          email: "charlie.b@example.com",
          avatar: "C",
          course: "React Architecture",
          progress: 100,
          lastActive: "3 days ago",
          courseStatus: "Completed",
          certificateStatus: "Generated"
        },
        {
          id: "4",
          studentId: "stu_4",
          name: "Diana Prince",
          email: "diana.p@example.com",
          avatar: "D",
          course: "Digital Marketing Pro",
          progress: 0,
          lastActive: "1 week ago",
          courseStatus: "Inactive",
          certificateStatus: "Pending"
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "" ? true : s.course === filterCourse;
    const matchesStatus = filterStatus === "" ? true : s.courseStatus === filterStatus;
    let matchesProgress = true;
    if (filterProgress === "0-25%") matchesProgress = s.progress >= 0 && s.progress <= 25;
    else if (filterProgress === "26-50%") matchesProgress = s.progress >= 26 && s.progress <= 50;
    else if (filterProgress === "51-75%") matchesProgress = s.progress >= 51 && s.progress <= 75;
    else if (filterProgress === "76-100%") matchesProgress = s.progress >= 76 && s.progress <= 100;
    return matchesSearch && matchesCourse && matchesStatus && matchesProgress;
  }).sort((a, b) => {
    if (sortBy === "Highest Progress") return b.progress - a.progress;
    if (sortBy === "Lowest Progress") return a.progress - b.progress;
    if (sortBy === "Oldest") return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });
  return <div className="max-w-7xl mx-auto space-y-6 pb-8">
      
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Students</h1>
          <p className="text-body mt-1">Monitor student progress, submissions and course performance.</p>
        </div>
      </div>

      {
    /* Statistics Cards */
  }
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
    { title: "Total Students", value: "4,850", icon: <Users className="w-5 h-5 text-blue-500" />, color: "bg-blue-50" },
    { title: "Active Students", value: "3,210", icon: <Activity className="w-5 h-5 text-green-500" />, color: "bg-green-50" },
    { title: "Completed", value: "1,540", icon: <CheckCircle className="w-5 h-5 text-purple-500" />, color: "bg-purple-50" },
    { title: "Avg Progress", value: "68%", icon: <BarChart className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
    { title: "Certificates", value: "1,420", icon: <Award className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-50" },
    { title: "Pending Reviews", value: "45", icon: <FileText className="w-5 h-5 text-red-500" />, color: "bg-red-50" }
  ].map((stat, idx) => <div key={idx} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-xl font-heading font-bold text-heading">{stat.value}</div>
            <div className="text-xs text-caption mt-1">{stat.title}</div>
          </div>)}
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80 shrink-0">
          <input
    type="text"
    placeholder="Search Student..."
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
    options={["UI/UX Masterclass", "React Architecture"]}
  />
          <CustomDropdown
    placeholder="Filter Status"
    value={filterStatus}
    onChange={setFilterStatus}
    options={["Active", "Completed", "Inactive"]}
  />
          <CustomDropdown
    placeholder="Filter Progress"
    value={filterProgress}
    onChange={setFilterProgress}
    options={["0-25%", "26-50%", "51-75%", "76-100%"]}
  />
          <CustomDropdown
    placeholder="Sort By: Newest"
    value={sortBy}
    onChange={setSortBy}
    options={["Oldest", "Highest Progress", "Lowest Progress"]}
  />
        </div>
      </div>

      {
    /* Students List */
  }
      {loading ? <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div> : <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Profile</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Course</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Progress</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Last Active</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider">Certificate</th>
                  <th className="py-4 px-4 text-xs font-bold text-caption uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.length > 0 ? filteredStudents.map((student) => <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {student.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-heading text-sm">{student.name}</h3>
                          <div className="text-[11px] text-caption">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-heading">
                        {student.course}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full min-w-[120px]">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-bold text-heading">{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
    className={`h-1.5 rounded-full ${student.progress === 100 ? "bg-green-500" : "bg-primary"}`}
    style={{ width: `${student.progress}%` }}
  />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-heading">{student.lastActive}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${student.courseStatus === "Active" ? "bg-green-100 text-green-700" : student.courseStatus === "Completed" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                        {student.courseStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${student.certificateStatus === "Generated" ? "bg-blue-100 text-blue-700" : student.certificateStatus === "Eligible" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                        {student.certificateStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
    onClick={() => navigate(`/instructor/students/${student.studentId}`)}
    title="View Details"
    className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
  >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => navigate(`/instructor/students/${student.studentId}/progress`)}
    title="View Progress"
    className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
  >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => navigate(`/instructor/students/${student.studentId}/submissions`)}
    title="View Submissions"
    className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
  >
                          <Folder className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => navigate(`/instructor/students/${student.studentId}/activity`)}
    title="View Activity Timeline"
    className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
  >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="text-gray-400 mb-2">
                        <Users className="w-10 h-10 mx-auto" />
                      </div>
                      <h3 className="text-lg font-bold text-heading">No students found</h3>
                      <p className="text-caption text-sm">
                        No students found matching your criteria.
                      </p>
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};
var stdin_default = InstructorStudents;
export {
  stdin_default as default
};
