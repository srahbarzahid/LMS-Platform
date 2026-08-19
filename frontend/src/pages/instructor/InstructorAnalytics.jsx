import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  Award,
  ClipboardCheck,
  Download,
  Filter,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  MonitorPlay,
  TrendingUp,
  CheckSquare,
  PlayCircle,
  FileText
} from "lucide-react";
import StatCard from "../../components/analytics/StatCard";
import {
  ChartCard,
  CustomLineChart,
  CustomVerticalBarChart,
  CustomDonutChart,
  CircularProgressChart,
  CustomHorizontalBarChart
} from "../../components/analytics/ChartCards";
import ActivityTimeline from "../../components/analytics/ActivityTimeline";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";

const LoadingSkeleton = () => <div className="max-w-[1600px] mx-auto space-y-8 pb-16 bg-[#f9fafb] min-h-screen pt-6 px-4 sm:px-6 lg:px-8 animate-pulse">
    <div className="h-24 bg-gray-200 rounded-2xl w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-96 bg-gray-200 rounded-2xl" />
      <div className="h-96 bg-gray-200 rounded-2xl" />
    </div>
  </div>;
const sparklineData = Array.from({ length: 14 }).map(() => ({ value: Math.floor(Math.random() * 50) + 10 }));
const sparklineUp = [...sparklineData].sort((a, b) => a.value - b.value);
const sparklineDown = [...sparklineData].sort((a, b) => b.value - a.value);
const InstructorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await instructorApi.getAnalytics();
        setData(response.data || response);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(getApiErrorMessage(err, "Failed to load analytics dashboard."));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500 p-8 font-bold text-center flex items-center justify-center min-h-[50vh]"><AlertTriangle className="mr-2" /> {error}</div>;
  const sparklineData = (data.revenue?.monthly || []).map((m) => ({ value: Number(m.revenue || 0) }));
  const sparklineUp = sparklineData.length ? sparklineData : [{ value: 0 }, { value: 5 }, { value: 10 }];
  const sparklineDown = sparklineData.length ? sparklineData : [{ value: 10 }, { value: 5 }, { value: 0 }];

  const timeOptions = ["Today", "Last Week", "Last Month", "Last Year"];
  const courseOptions = ["All Courses", ...(data.courses || []).map((c) => c.name)];
  return <div className="max-w-[1600px] mx-auto space-y-8 pb-16 bg-[#f9fafb] min-h-screen pt-6 px-4 sm:px-6 lg:px-8">
      
      {
    /* 1. Header Section */
  }
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#f3f4f6] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative">
        {(timeDropdownOpen || courseDropdownOpen) && <div className="fixed inset-0 z-40" onClick={() => {
    setTimeDropdownOpen(false);
    setCourseDropdownOpen(false);
  }} />}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-50">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Analytics</h1>
            <p className="text-[#4B5563] mt-1 text-sm font-medium">Track your course performance, student engagement and business growth.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            
            {
    /* Custom Time Dropdown */
  }
            <div className="relative">
              <button
    onClick={() => {
      setTimeDropdownOpen(!timeDropdownOpen);
      setCourseDropdownOpen(false);
    }}
    className="flex items-center gap-2 pl-9 pr-4 py-2.5 bg-[#f9fafb] border border-[#f3f4f6] rounded-xl text-sm font-semibold text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#ff6b00]/20"
  >
                <CalendarIcon className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                {timeRange}
              </button>
              {timeDropdownOpen && <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-[#f3f4f6] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden cursor-pointer">
                  {timeOptions.map((opt) => <div
    key={opt}
    onClick={() => {
      setTimeRange(opt);
      setTimeDropdownOpen(false);
    }}
    className={`px-4 py-2.5 text-sm font-medium hover:bg-[#fff4ed] hover:text-[#ff6b00] transition-colors ${timeRange === opt ? "bg-[#fff4ed] text-[#ff6b00]" : "text-[#4B5563]"}`}
  >
                      {opt}
                    </div>)}
                </div>}
            </div>

            {
    /* Custom Course Filter Dropdown */
  }
            <div className="relative">
              <button
    onClick={() => {
      setCourseDropdownOpen(!courseDropdownOpen);
      setTimeDropdownOpen(false);
    }}
    className="flex items-center gap-2 pl-9 pr-4 py-2.5 bg-[#f9fafb] border border-[#f3f4f6] rounded-xl text-sm font-semibold text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#ff6b00]/20"
  >
                <Filter className="w-4 h-4 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                <span className="max-w-[120px] truncate">{selectedCourse}</span>
              </button>
              {courseDropdownOpen && <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#f3f4f6] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden cursor-pointer">
                  {courseOptions.map((opt) => <div
    key={opt}
    onClick={() => {
      setSelectedCourse(opt);
      setCourseDropdownOpen(false);
    }}
    className={`px-4 py-2.5 text-sm font-medium hover:bg-[#fff4ed] hover:text-[#ff6b00] transition-colors ${selectedCourse === opt ? "bg-[#fff4ed] text-[#ff6b00]" : "text-[#4B5563]"}`}
  >
                      {opt}
                    </div>)}
                </div>}
            </div>

            <button
    onClick={() => {
      setToastMessage(`Exporting report for ${selectedCourse} (${timeRange})...`);
      setTimeout(() => setToastMessage(null), 3e3);
      if (!data || !data.courses) return;
      const headers = ["Course Name", "Students", "Revenue", "Completion Rate", "Rating"];
      const filteredCourses = selectedCourse === "All Courses" ? data.courses : data.courses.filter((c) => c.name === selectedCourse);
      const csvRows = filteredCourses.map((course) => [
        `"${course.name}"`,
        course.students,
        course.revenue,
        `${course.completion}%`,
        course.rating
      ]);
      const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics_report_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-[#1f2937] text-white rounded-xl text-sm font-semibold shadow-md transition-colors cursor-pointer"
  >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {
    /* 2. Top KPI Section */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={data.overview?.totalStudents?.value?.toLocaleString() || "0"} icon={<Users className="w-5 h-5" />} trend={data.overview?.totalStudents?.growth || "0%"} trendDesc={data.overview?.totalStudents?.description || "live database"} sparklineData={sparklineUp} />
        <StatCard title="Total Courses" value={data.overview?.totalCourses?.value || "0"} icon={<BookOpen className="w-5 h-5" />} trend={data.overview?.totalCourses?.growth || "0"} trendDesc={data.overview?.totalCourses?.description || "live database"} sparklineData={sparklineUp} />
        <StatCard title="Total Revenue" value={data.overview?.totalRevenue?.value || "$0"} icon={<DollarSign className="w-5 h-5" />} trend={data.overview?.totalRevenue?.growth || "0%"} trendDesc={data.overview?.totalRevenue?.description || "live database"} sparklineData={sparklineUp} />
        <StatCard title="Average Rating" value={data.overview?.averageRating?.value || "0"} icon={<Star className="w-5 h-5" />} trend={data.overview?.averageRating?.growth || "0"} trendDesc={data.overview?.averageRating?.description || "live database"} sparklineData={sparklineUp} />
        
        <StatCard title="Course Completion" value={data.overview?.courseCompletionRate?.value || "0%"} icon={<CheckCircle className="w-5 h-5" />} trend={data.overview?.courseCompletionRate?.growth || "0%"} trendDesc={data.overview?.courseCompletionRate?.description || "completion rate"} sparklineData={sparklineUp} />
        <StatCard title="Certificates Issued" value={data.overview?.certificatesIssued?.value?.toLocaleString() || "0"} icon={<Award className="w-5 h-5" />} trend={data.overview?.certificatesIssued?.growth || "0"} trendDesc={data.overview?.certificatesIssued?.description || "issued records"} sparklineData={sparklineUp} />
        <StatCard title="Pending Reviews" value={data.overview?.pendingAssignments?.value || 0} icon={<ClipboardCheck className="w-5 h-5" />} trend={String(data.overview?.pendingAssignments?.value || 0)} trendDesc={data.overview?.pendingAssignments?.description || "requires action"} sparklineData={sparklineDown} />
        <StatCard title="Pending Projects" value={data.overview?.pendingProjects?.value || 0} icon={<AlertTriangle className="w-5 h-5" />} trend={String(data.overview?.pendingProjects?.value || 0)} trendDesc={data.overview?.pendingProjects?.description || "requires action"} sparklineData={sparklineUp} />
      </div>

      {
    /* 3. Second Section (Enrollment & Revenue) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Student Enrollment Trend">
          <CustomLineChart data={data.students || []} xKey="date" yKey="enrollments" color="#ff6b00" />
        </ChartCard>
        <ChartCard title="Revenue Analytics" action={<span className="text-sm font-semibold text-[#10B981]">{data.revenue?.growth || "0%"}</span>}>
          <CustomVerticalBarChart data={data.revenue?.monthly || []} xKey="name" yKey="revenue" color="#10B981" />
        </ChartCard>
      </div>

      {
    /* 4. Third Section (Course Performance) */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Course Completion Status">
          <CustomDonutChart data={data.certificates || []} nameKey="name" dataKey="value" />
        </ChartCard>
        <ChartCard title="Average Student Progress">
          <CircularProgressChart value={Number(data.learning?.lessonsCompleted?.progress || 0)} label={`${data.learning?.lessonsCompleted?.progress || 0}%`} subtext="Overall Progress" color="#06B6D4" />
        </ChartCard>
        <ChartCard title="Average Rating Distribution">
          <CircularProgressChart value={(data.ratings?.average || 0) * 20} label={(data.ratings?.average || 0).toString()} subtext="Average Rating" color="#F59E0B" />
        </ChartCard>
      </div>

      {
    /* 5. Fourth Section (Top Courses Table) */
  }
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#f3f4f6] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="p-6 border-b border-[#f3f4f6]">
          <h2 className="text-lg font-bold text-[#111827]">Top Performing Courses</h2>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-3 px-6 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Course</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Students</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Revenue</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Completion</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Rating</th>
                <th className="py-3 px-6 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data.courses || []).length > 0 ? (data.courses || []).map((course, i) => <tr key={i} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-[#111827]">{course.name}</td>
                  <td className="py-4 px-6 text-sm text-right text-[#4B5563] font-medium">{course.students.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-right text-[#10B981] font-semibold">${course.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-right text-[#4B5563] font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <span className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                        <span className="bg-[#ff6b00] h-full" style={{ width: `${course.completion}%` }} />
                      </span>
                      {course.completion}%
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-right text-[#F59E0B] font-semibold flex justify-end items-center gap-1">
                    {course.rating} <Star className="w-3.5 h-3.5 fill-current" />
                  </td>
                  <td className={`py-4 px-6 text-sm text-right font-semibold ${course.trend.startsWith("+") ? "text-[#10B981]" : "text-[#EF4444]"}`}>{course.trend}</td>
                </tr>) : <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-caption">No courses found yet.</td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* 6. Fifth Section (Learning Analytics) */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <EngagementCard title="Average Learning Time" value={data.learning?.averageLearningTime?.value || "0m"} icon={<Clock className="w-5 h-5" />} progress={data.learning?.averageLearningTime?.progress || 0} color="bg-[#ff6b00]" comparison={data.learning?.averageLearningTime?.comparison || "live database"} />
        <EngagementCard title="Avg Session Duration" value={data.learning?.averageSessionDuration?.value || "0m"} icon={<PlayCircle className="w-5 h-5" />} progress={data.learning?.averageSessionDuration?.progress || 0} color="bg-[#06B6D4]" comparison={data.learning?.averageSessionDuration?.comparison || "live database"} />
        <EngagementCard title="Lessons Completed" value={data.learning?.lessonsCompleted?.value || "0"} icon={<CheckCircle className="w-5 h-5" />} progress={data.learning?.lessonsCompleted?.progress || 0} color="bg-[#10B981]" comparison={data.learning?.lessonsCompleted?.comparison || "average progress"} />
        <EngagementCard title="Weekly Active Students" value={data.learning?.weeklyActiveStudents?.value || "0"} icon={<Users className="w-5 h-5" />} progress={data.learning?.weeklyActiveStudents?.progress || 0} color="bg-[#8B5CF6]" comparison={data.learning?.weeklyActiveStudents?.comparison || "active students"} />
      </div>

      {
    /* 7. Sixth Section (Assessment Analytics) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Quiz Analytics">
          <div className="relative w-full h-full flex items-center justify-center">
            <CustomDonutChart data={[
              { name: "Pass", value: data.assessments?.quizzes?.pass || 0, color: "#10B981" },
              { name: "Fail", value: data.assessments?.quizzes?.fail || 0, color: "#EF4444" }
            ]} nameKey="name" dataKey="value" emptyText="No quiz attempts recorded yet" />
            {((data.assessments?.quizzes?.pass || 0) + (data.assessments?.quizzes?.fail || 0)) > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pb-6">
                <span className="text-3xl font-bold text-[#111827]">{data.assessments?.quizzes?.averageScore || 0}%</span>
                <p className="text-sm text-[#4B5563] font-medium">Avg Score</p>
              </div>
            )}
          </div>
        </ChartCard>
        
        <ChartCard title="Assignment & Project Analytics">
          <div className="flex flex-col gap-6 justify-center h-full px-2 pt-2 pb-6">
            {[
              { label: "Graded", value: data.assessments?.assignments?.find((a) => a.name === "Graded")?.value ?? 0, color: "bg-[#10B981]", max: 100 },
              { label: "Submitted", value: data.assessments?.assignments?.find((a) => a.name === "Submitted")?.value ?? 0, color: "bg-[#06B6D4]", max: 100 },
              { label: "Pending", value: data.assessments?.assignments?.find((a) => a.name === "Pending")?.value ?? 0, color: "bg-[#F59E0B]", max: 100 },
              { label: "Resubmission Requested", value: data.assessments?.assignments?.find((a) => a.name === "Resubmission Requested")?.value ?? 0, color: "bg-[#EF4444]", max: 100 }
            ].map((item, idx) => <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#111827] flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-bold text-[#4B5563]">{item.value}</span>
                </div>
                <div className="w-full h-2.5 bg-white border border-[#f3f4f6] rounded-full overflow-hidden shadow-inner">
                  <div className={`${item.color} h-full rounded-full shadow-sm`} style={{ width: `${item.value / item.max * 100}%` }} />
                </div>
              </div>)}
          </div>
        </ChartCard>
      </div>

      {
    /* 8. Seventh Section (Course Insights) */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard icon={<TrendingUp className="text-[#10B981]" />} title="Revenue Growth" message={data.revenue?.growth ? `Revenue trend is ${data.revenue.growth} compared to last period.` : "Revenue metrics are up to date."} />
        <InsightCard icon={<MonitorPlay className="text-[#06B6D4]" />} title="Top Course" message={`Most popular course: ${data.reports?.mostPopularCourse || "None"}.`} />
        <InsightCard icon={<AlertTriangle className="text-[#EF4444]" />} title="Completion Status" message={`Overall course completion rate is currently at ${data.overview?.courseCompletionRate?.value || "0%"}.`} />
        <InsightCard icon={<ClipboardCheck className="text-[#F59E0B]" />} title="Highest Rating" message={`Highest rated course: ${data.reports?.highestRatedCourse || "None"}.`} />
        <InsightCard icon={<DollarSign className="text-[#10B981]" />} title="Top Revenue" message={`Highest revenue course: ${data.reports?.highestRevenueCourse || "None"}.`} />
        <InsightCard icon={<FileText className="text-[#8B5CF6]" />} title="Tasks Pending" message={`${data.overview?.pendingAssignments?.value || 0} assignments and ${data.overview?.pendingProjects?.value || 0} projects waiting for review.`} />
      </div>

      {
    /* 9. Eighth Section (Course Comparison) */
  }
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Course Comparison (Top 5)">
          <CustomHorizontalBarChart data={data.courses.slice(0, 5)} xKey="name" yKey="students" color="#ff6b00" />
        </ChartCard>
      </div>

      {
    /* 10. Ninth & Tenth Sections (Recent Activity & Upcoming Tasks) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#f3f4f6] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 h-full">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Recent Activity</h2>
          <ActivityTimeline activities={data.activities} />
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#f3f4f6] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 h-full flex flex-col">
          <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#ff6b00]" /> Upcoming Tasks
          </h2>
          <div className="space-y-4 flex-1">
            {data.tasks.map((task) => <TaskCard
    key={task.id}
    count={task.count}
    label={task.title}
    color={task.priority === "High" ? "bg-[#EF4444]" : task.priority === "Medium" ? "bg-[#F59E0B]" : "bg-[#06B6D4]"}
    due={task.due}
  />)}
          </div>
        </div>
      </div>



      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-8 right-8 bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-[box-shadow,transform,color] duration-300">
          <CheckCircle className="w-5 h-5 text-[#10B981]" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>}

    </div>;
};
var stdin_default = InstructorAnalytics;
const EngagementCard = ({ title, value, icon, progress, color, comparison }) => {
  const rawColor = color.replace("bg-[", "").replace("]", "");
  return <div className="bg-white p-5 rounded-2xl border border-[#ff6b00]/10 shadow-[0_4px_20px_-5px_rgba(255,107,0,0.15)] hover:shadow-[0_8px_30px_-5px_rgba(255,107,0,0.25)] transition-[box-shadow,transform,color] flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div
    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
    style={{ backgroundColor: `${rawColor}15`, color: rawColor }}
  >
            {React.cloneElement(icon, { className: "w-5 h-5" })}
          </div>
          <p className="text-sm font-semibold text-[#4B5563] leading-snug">{title}</p>
        </div>
        <h3 className="text-3xl font-bold tracking-tight text-[#111827] mb-4">{value}</h3>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium text-[#9CA3AF]">{comparison}</p>
          <span className="text-xs font-bold" style={{ color: rawColor }}>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full rounded-full transition-[box-shadow,transform,color] duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: rawColor }} />
        </div>
      </div>
    </div>;
};
const InsightCard = ({ icon, title, message }) => <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#f3f4f6] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex gap-4 hover:border-[#ff6b00]/30 transition-colors cursor-pointer">
    <div className="w-10 h-10 rounded-full bg-[#f9fafb] border border-[#f3f4f6] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-[#111827] mb-1">{title}</h4>
      <p className="text-sm text-[#4B5563] leading-snug">{message}</p>
    </div>
  </div>;
const TaskCard = ({ count, label, color, due }) => <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f9fafb] border border-[#f3f4f6] hover:bg-white hover:shadow-sm transition-[box-shadow,transform,color] cursor-pointer">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm ${color}`}>
      {count}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-[#111827]">{label}</h4>
      <p className="text-xs font-medium text-[#9CA3AF] mt-0.5">Due {due}</p>
    </div>
    <button className="px-3 py-1.5 text-xs font-semibold text-[#111827] border border-[#f3f4f6] rounded-lg bg-white hover:bg-gray-50 transition-colors">
      Action
    </button>
  </div>;
export {
  stdin_default as default
};
