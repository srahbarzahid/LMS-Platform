import { useState, useEffect, useMemo } from "react";
import { Search, Filter, PlayCircle, CheckCircle2, Clock, Calendar, RefreshCcw, FileText, BarChart2, ArrowUpDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CustomDropdown from "../components/common/CustomDropdown";
import CustomSelect from "../components/common/CustomSelect";
import { studentApi } from "../api/studentApi";

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [sortBy, setSortBy] = useState("Due Date");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await studentApi.getQuizzes();
        if (response.success && Array.isArray(response.data)) {
          setQuizzes(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch student quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const courses = ["All Courses", ...Array.from(new Set(quizzes.map((q) => q.course).filter(Boolean)))];
  const statuses = ["All", "Not Started", "In Progress", "Completed", "Expired"];

  const filteredQuizzes = useMemo(() => {
    let result = quizzes.filter((quiz) => {
      if (statusFilter !== "All" && quiz.status !== statusFilter) return false;
      if (courseFilter !== "All Courses" && quiz.course !== courseFilter) return false;
      if (searchQuery && !quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
  }, [quizzes, searchQuery, statusFilter, courseFilter, sortBy]);

  const totalQuizzes = quizzes.length;
  const pendingQuizzes = quizzes.filter((q) => q.status === "Not Started" || q.status === "In Progress").length;
  const completedQuizzes = quizzes.filter((q) => q.status === "Completed").length;

  const completedScores = quizzes.filter((q) => q.status === "Completed" && q.score !== null && q.score !== undefined);
  const avgScore =
    completedScores.length > 0
      ? Math.round(completedScores.reduce((acc, q) => acc + (q.score / (q.totalMarks || 100)) * 100, 0) / completedScores.length)
      : 0;

  const handleAction = (quizId, status) => {
    if (status === "Completed" || status === "Expired") {
      navigate(`/student/quiz-result/${quizId}`);
    } else {
      navigate(`/student/quiz-player/${quizId}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Expired":
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
        <h1 className="text-3xl font-heading font-bold text-heading">My Quizzes</h1>
        <p className="text-body mt-2 mb-8">Test your knowledge with real quizzes from your enrolled courses.</p>

        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quizzes..."
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
          <span className="text-xs text-caption font-bold uppercase tracking-wider block mb-1">Total Quizzes</span>
          <span className="text-2xl font-bold text-heading">{totalQuizzes}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-orange-600 font-bold uppercase tracking-wider block mb-1">Pending</span>
          <span className="text-2xl font-bold text-orange-600">{pendingQuizzes}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block mb-1">Completed</span>
          <span className="text-2xl font-bold text-emerald-600">{completedQuizzes}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-1">Average Score</span>
          <span className="text-2xl font-bold text-blue-600">{avgScore}%</span>
        </div>
      </div>

      {/* Quiz List */}
      {filteredQuizzes.length > 0 ? (
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(quiz.status)}`}>
                    {quiz.status}
                  </span>
                  <span className="text-xs text-caption font-semibold bg-gray-100 px-2.5 py-0.5 rounded-md">
                    {quiz.course}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-heading">{quiz.title}</h3>

                <div className="flex items-center gap-4 text-xs text-caption font-medium flex-wrap">
                  <span>Questions: {quiz.questions}</span>
                  <span>Time Limit: {quiz.timeLimit}</span>
                  <span>Passing Score: {quiz.passingMarks}/{quiz.totalMarks}</span>
                  <span>Attempts: {quiz.attemptsUsed}/{quiz.allowedAttempts}</span>
                  {quiz.dueDate && <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => handleAction(quiz.id, quiz.status)}
                  className="w-full md:w-auto bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  {quiz.status === "Completed" ? "View Result" : "Start Quiz"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-border text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-heading text-lg">No Quizzes Found</h3>
            <p className="text-caption text-sm max-w-sm mx-auto mt-1">
              You currently have no quizzes assigned or matching your active search filter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
