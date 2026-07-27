import { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, Award, PlayCircle, Filter, Download, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const enrolledCourses = [
  {
    courseId: 1,
    courseTitle: 'Mastering Embedded Systems & IoT',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
    instructorName: 'Dr. Sarah Jenkins',
    category: 'Engineering',
    progressPercentage: 65,
    lastWatchedLesson: 'Module 2: Setting up the IDE & Toolchain',
    duration: '18 Hours',
    totalLessons: 42,
    completedLessons: 27,
    certificateStatus: 'Not Eligible Yet',
    status: 'In Progress', // 'Not Started', 'In Progress', 'Completed'
    lastAccessedDate: '2026-07-03T10:00:00Z',
  },
  {
    courseId: 2,
    courseTitle: 'Introduction to Robotics',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400',
    instructorName: 'Hisham',
    category: 'Robotics',
    progressPercentage: 0,
    lastWatchedLesson: null,
    duration: '12 Hours',
    totalLessons: 24,
    completedLessons: 0,
    certificateStatus: 'Not Eligible Yet',
    status: 'Not Started',
    lastAccessedDate: null,
  },
  {
    courseId: 3,
    courseTitle: 'Advanced React Native',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    instructorName: 'Marcus Chen',
    category: 'Development',
    progressPercentage: 100,
    lastWatchedLesson: 'Final Project Submission',
    duration: '22 Hours',
    totalLessons: 55,
    completedLessons: 55,
    certificateStatus: 'Available',
    status: 'Completed',
    lastAccessedDate: '2026-06-15T14:30:00Z',
  },
  {
    courseId: 4,
    courseTitle: 'UI/UX Design Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400',
    instructorName: 'Emma Watson',
    category: 'Design',
    progressPercentage: 80,
    lastWatchedLesson: 'Wireframing Basics',
    duration: '15 Hours',
    totalLessons: 20,
    completedLessons: 16,
    certificateStatus: 'Not Eligible Yet',
    status: 'In Progress',
    lastAccessedDate: '2026-07-04T08:15:00Z',
  },
];

const StudentMyCourses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const tabs = ['All Courses', 'In Progress', 'Completed', 'Not Started', 'Certificate Available'];
  const categories = ['All Categories', ...Array.from(new Set(enrolledCourses.map(c => c.category)))];

  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter(course => {
      // Tab Filtering
      if (activeTab === 'In Progress' && course.status !== 'In Progress') return false;
      if (activeTab === 'Completed' && course.status !== 'Completed') return false;
      if (activeTab === 'Not Started' && course.status !== 'Not Started') return false;
      if (activeTab === 'Certificate Available' && course.certificateStatus !== 'Available') return false;
      
      // Category Filtering
      if (categoryFilter !== 'All Categories' && course.category !== categoryFilter) return false;
      
      // Search Filtering
      if (searchQuery && !course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });
  }, [activeTab, searchQuery, categoryFilter]);

  const handleCourseAction = (courseId: number, action: 'continue' | 'start' | 'view') => {
    if (action === 'view') {
      navigate(`/student/courses/${courseId}`);
    } else {
      navigate(`/student/course-player/${courseId}`);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-heading">My Courses</h1>
        <p className="text-body mt-2 mb-8">Continue learning from where you left off.</p>
        
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          
          <div className="flex w-full xl:w-auto overflow-x-auto custom-scrollbar gap-2 pb-2 xl:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-caption hover:bg-gray-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full xl:w-auto items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search enrolled courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="relative w-full sm:w-auto">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.courseId} className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img src={course.thumbnail} alt={course.courseTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-heading uppercase tracking-wider shadow-sm">
                  {course.category}
                </div>
                {course.status === 'Completed' && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                    Completed
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-heading font-bold text-heading line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {course.courseTitle}
                </h3>
                <p className="text-sm text-caption mb-4">Instructor: {course.instructorName}</p>

                {/* Progress Section */}
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-heading">Progress: {course.progressPercentage}%</span>
                    <span className="text-xs font-medium text-caption">{course.completedLessons} / {course.totalLessons} Lessons</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${course.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`} 
                      style={{ width: `${course.progressPercentage}%` }}
                    ></div>
                  </div>

                  {/* Course Details Grid */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 text-xs">
                    {course.lastWatchedLesson && (
                      <div className="col-span-2 flex items-start gap-2 text-body">
                        <PlayCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">Last Watched: {course.lastWatchedLesson}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-caption">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-caption">
                      <Award className="w-3.5 h-3.5" /> {course.certificateStatus}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border flex flex-col gap-3">
                    {course.status === 'Not Started' && (
                      <button 
                        onClick={() => handleCourseAction(course.courseId, 'start')}
                        className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        Start Learning <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    
                    {course.status === 'In Progress' && (
                      <button 
                        onClick={() => handleCourseAction(course.courseId, 'continue')}
                        className="w-full py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        Continue Learning <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {course.status === 'Completed' && (
                      <>
                        <button className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-emerald-200">
                          <Download className="w-4 h-4" /> Download Certificate
                        </button>
                        <button 
                          onClick={() => handleCourseAction(course.courseId, 'view')}
                          className="w-full py-2 bg-transparent hover:bg-gray-50 text-body rounded-xl font-bold text-sm transition-colors"
                        >
                          View Course Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-border p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-caption" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-heading mb-2">No courses found</h2>
          <p className="text-body max-w-md mx-auto mb-8">
            {searchQuery || categoryFilter !== 'All Categories' || activeTab !== 'All Courses'
              ? "We couldn't find any courses matching your filters. Try adjusting them to see more results."
              : "You haven't enrolled in any courses yet. Start your learning journey today!"}
          </p>
          <Link to="/courses" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20">
            Browse Courses
          </Link>
        </div>
      )}

    </div>
  );
};

export default StudentMyCourses;
