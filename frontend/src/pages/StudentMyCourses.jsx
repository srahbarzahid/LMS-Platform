import { useState, useEffect, useMemo } from "react";
import { Search, BookOpen, Clock, Award, PlayCircle, Filter, Download, ChevronRight, Compass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CustomDropdown from "../components/common/CustomDropdown";
import { studentApi } from "../api/studentApi";

const StudentMyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await studentApi.getMyCourses();
        if (response.success && Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch my courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const tabs = ["All Courses", "In Progress", "Completed", "Not Started", "Certificate Available"];
  const categories = ["All Categories", ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (activeTab === "In Progress" && course.status !== "In Progress") return false;
      if (activeTab === "Completed" && course.status !== "Completed") return false;
      if (activeTab === "Not Started" && course.status !== "Not Started") return false;
      if (activeTab === "Certificate Available" && course.certificateStatus !== "Available") return false;
      if (categoryFilter !== "All Categories" && course.category !== categoryFilter) return false;
      if (searchQuery && !course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [courses, activeTab, searchQuery, categoryFilter]);

  const handleCourseAction = (courseId, action) => {
    if (action === "view") {
      navigate(`/student/courses/${courseId}`);
    } else {
      navigate(`/student/course-player/${courseId}`);
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
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-heading">My Courses</h1>
        <p className="text-body mt-2 mb-8">Continue learning from where you left off in your enrolled courses.</p>

        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="flex w-full xl:w-auto overflow-x-auto custom-scrollbar gap-2 pb-2 xl:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-gray-100 text-caption hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full xl:w-auto items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search enrolled courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="w-full sm:w-auto">
              <CustomDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categories.map((cat) => ({ value: cat, label: cat }))}
                icon={Filter}
                align="right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden border-b border-border">
                <img
                  src={course.thumbnail}
                  alt={course.courseTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium">
                  {course.category}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-heading group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {course.courseTitle}
                  </h3>
                  <p className="text-xs text-caption font-medium">By {course.instructorName}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-heading">
                    <span>Progress</span>
                    <span>{course.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-caption truncate">
                    {course.completedLessons}/{course.totalLessons} Lessons • {course.duration}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border gap-2">
                  <button
                    onClick={() => handleCourseAction(course.courseId, "view")}
                    className="text-xs font-bold text-caption hover:text-heading transition-colors py-2 px-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleCourseAction(course.courseId, "play")}
                    className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" /> {course.progressPercentage > 0 ? "Resume" : "Start"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-border text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-heading text-lg">No Enrolled Courses Found</h3>
            <p className="text-caption text-sm max-w-md mx-auto mt-1">
              You have not enrolled in any courses yet or no courses match your active filter. Browse our course catalog to get started!
            </p>
          </div>
          <Link
            to="/student/browse-courses"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-secondary transition-colors"
          >
            <Compass className="w-4 h-4" /> Browse Courses Catalog
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentMyCourses;
