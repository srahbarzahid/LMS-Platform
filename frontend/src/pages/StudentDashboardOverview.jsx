import { useState, useEffect } from "react";
import { BookOpen, Clock, Award, CheckCircle2, Flame, FileText, Bell, TrendingUp, Compass, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardAnnouncements from "../components/DashboardAnnouncements";
import { studentApi } from "../api/studentApi";
import { useTranslation } from "../context/LanguageContext";

const StudentDashboardOverview = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({
    stats: { enrolled: 0, completed: 0, learningHours: "0 hrs", streak: "0 Days", xpPoints: "0 XP" },
    continueLearning: [],
    categoryBreakdown: [],
    pendingTasks: [],
    notifications: []
  });

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const response = await studentApi.getOverview();
        if (response.success && response.data) {
          setOverviewData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch student overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();

    const syncUser = () => setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    window.addEventListener("profileUpdate", syncUser);
    return () => window.removeEventListener("profileUpdate", syncUser);
  }, []);

  const stats = overviewData.stats || {};
  const continueLearning = overviewData.continueLearning || [];
  const pendingTasks = overviewData.pendingTasks || [];
  const notifications = overviewData.notifications || [];
  const categories = overviewData.categoryBreakdown || [];

  const userName = user.name || "Student";

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <DashboardAnnouncements endpoint="/student/announcements" />

      {/* Top Section: Welcome Banner & Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Welcome Banner */}
        <div className="xl:col-span-2 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2" />

          <div className="relative z-10 mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2 text-white">
              {t("dashboard.welcome", "Welcome back")}, {userName} 👋
            </h1>
            <p className="text-gray-400 max-w-md">
              {continueLearning.length > 0
                ? "Track your real-time course progress, upcoming tasks, and learning achievements."
                : "You have not enrolled in any courses yet. Explore our course catalog to start learning today!"}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            {continueLearning.length > 0 ? (
              <Link
                to={`/student/course-player/${continueLearning[0].courseId}`}
                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20"
              >
                Continue Learning
              </Link>
            ) : (
              <Link
                to="/student/browse-courses"
                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> Browse Courses
              </Link>
            )}

            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-orange-500 flex items-center justify-center mb-2 bg-gray-800/50 backdrop-blur-sm">
                  <span className="font-bold sm:text-lg">{stats.streak || "0"}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">Current streak</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-blue-500 flex items-center justify-center mb-2 bg-gray-800/50 backdrop-blur-sm">
                  <span className="font-bold sm:text-lg">{stats.learningHours || "0 hrs"}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">Learning hours</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-emerald-500 flex items-center justify-center mb-2 bg-gray-800/50 backdrop-blur-sm">
                  <span className="font-bold sm:text-lg">{stats.xpPoints || "0"}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">XP points</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Real Stat Cards */}
        <div className="xl:col-span-1 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Enrolled</span>
            </div>
            <div className="text-2xl font-bold text-heading">{stats.enrolled ?? 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Completed</span>
            </div>
            <div className="text-2xl font-bold text-heading">{stats.completed ?? 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Learning Hrs</span>
            </div>
            <div className="text-2xl font-bold text-heading">{stats.learningHours || "0 hrs"}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Streak</span>
            </div>
            <div className="text-2xl font-bold text-heading">{stats.streak || "0 Days"}</div>
          </div>
        </div>
      </div>

      {/* Middle Section: Continue Learning & Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Continue Learning</h2>
            <Link to="/student/my-courses" className="text-sm text-primary font-medium hover:underline">
              View My Courses
            </Link>
          </div>

          {continueLearning.length > 0 ? (
            <div className="space-y-6">
              {continueLearning.slice(0, 3).map((item) => (
                <div
                  key={item.courseId}
                  className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-border transition-all"
                >
                  <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden shrink-0 border border-border">
                    <img src={item.thumbnail} alt={item.courseTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="grow w-full">
                    <div className="text-[10px] text-blue-500 font-bold mb-1 uppercase tracking-wider bg-blue-50 w-max px-2 py-0.5 rounded">
                      {item.category}
                    </div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-heading font-bold text-heading">{item.courseTitle}</h3>
                      <Link
                        to={`/student/course-player/${item.courseId}`}
                        className="hidden sm:block px-5 py-1.5 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm shrink-0"
                      >
                        Resume Lesson
                      </Link>
                    </div>
                    <div className="flex justify-between text-xs text-caption mb-2 font-medium">
                      <span>
                        {item.completedLessons}/{item.totalLessons} Lessons
                      </span>
                      <span>{item.progressPercentage}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">No Enrolled Courses</h3>
                <p className="text-caption text-sm max-w-sm mx-auto mt-1">
                  You haven't enrolled in any courses yet. Browse our course catalog to start learning.
                </p>
              </div>
              <Link
                to="/student/browse-courses"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-secondary transition-colors"
              >
                <Compass className="w-4 h-4" /> Browse Catalog
              </Link>
            </div>
          )}
        </div>

        {/* Learning Progress Breakdown */}
        <div className="xl:col-span-1 bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Learning Progress</h2>
          </div>

          <div className="grow flex flex-col items-center justify-center gap-8 py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - 251.2 * (categories[0]?.percentage ? categories[0].percentage / 100 : 0)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center">
                <div className="text-2xl font-bold text-heading">
                  {categories.length > 0 ? `${categories[0].percentage}%` : "0%"}
                </div>
                <div className="text-xs text-caption">Overall</div>
              </div>
            </div>

            <div className="w-full space-y-3">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-sm ${idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-purple-500" : "bg-emerald-500"}`} />
                      <span className="text-body font-medium">{cat.name}</span>
                    </div>
                    <span className="font-bold text-heading">{cat.percentage}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-caption text-center">No categories active yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Pending Tasks & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Tasks */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Pending Tasks</h2>
            <Link to="/student/assignments" className="text-sm text-primary font-medium hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            {pendingTasks.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-xs text-caption uppercase tracking-wider border-b border-border">
                    <th className="pb-3 font-medium">Task Name</th>
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Due Date</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {pendingTasks.map((task) => (
                    <tr key={task.id} className="border-b border-border/50 hover:bg-gray-50/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-heading">{task.taskName}</span>
                        </div>
                      </td>
                      <td className="py-4 text-body">{task.course}</td>
                      <td className="py-4 font-medium text-red-500">{task.dueDate}</td>
                      <td className="py-4 text-right">
                        <Link
                          to="/student/assignments"
                          className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-secondary transition-colors inline-block"
                        >
                          Start
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-caption text-sm">No pending tasks remaining! All caught up.</div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-heading font-bold text-heading mb-6">Notifications</h2>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-heading">{n.title}</h4>
                      <p className="text-xs text-body mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-caption mt-1 block font-medium">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-caption text-center py-4">No new notifications</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardOverview;
