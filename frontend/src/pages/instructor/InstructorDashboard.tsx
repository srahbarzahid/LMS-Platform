import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Book, DollarSign, Star, 
  ClipboardList, Briefcase, GraduationCap, 
  PlusCircle, PlaySquare, CheckSquare
} from 'lucide-react';
import { CustomVerticalBarChart } from '../../components/analytics/ChartCards';
import DashboardAnnouncements from '../../components/DashboardAnnouncements';

const InstructorDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revenueTime, setRevenueTime] = useState('Last 7 Days');
  const [revenueDropdownOpen, setRevenueDropdownOpen] = useState(false);

  // Mock initial data fetch
  useEffect(() => {
    // We would normally call: instructorApi.getDashboardStats()
    // For now, setting mock data
    setTimeout(() => {
      setStats({
        totalCourses: 12,
        totalStudents: 4850,
        totalRevenue: 24500.50,
        averageRating: 4.8,
        pendingAssignments: 34,
        pendingProjects: 12,
        completionRate: 68,
        recentEnrollments: [
          { id: 1, name: 'Alice Smith', course: 'React Masterclass', date: '2 hours ago' },
          { id: 2, name: 'Bob Johnson', course: 'Advanced UI/UX', date: '5 hours ago' },
          { id: 3, name: 'Charlie Brown', course: 'Node.js Backend', date: '1 day ago' },
        ],
        recentReviews: [
          { id: 1, name: 'David Lee', course: 'React Masterclass', rating: 5, text: 'Amazing course, very detailed!', date: '1 day ago' },
          { id: 2, name: 'Emma Wilson', course: 'Node.js Backend', rating: 4, text: 'Great content, but pace is fast.', date: '2 days ago' },
        ]
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      <DashboardAnnouncements endpoint="/api/instructor/announcements" />
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Welcome back, Instructor!</h1>
          <p className="text-body mt-1">Here is what's happening with your courses today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/instructor/courses/create" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors">
            <PlusCircle className="w-5 h-5" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6 text-green-500" />} trend="+12.5%" />
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} icon={<Users className="w-6 h-6 text-blue-500" />} trend="+4.2%" />
        <StatCard title="Average Rating" value={stats.averageRating} icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />} trend="+0.1" />
        <StatCard title="Total Courses" value={stats.totalCourses} icon={<Book className="w-6 h-6 text-purple-500" />} />
      </div>

      {/* Quick Actions & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-heading font-bold text-heading mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickAction icon={<PlaySquare className="w-6 h-6 text-orange-500" />} title="Add Lesson" to="/instructor/lessons" />
            <QuickAction icon={<CheckSquare className="w-6 h-6 text-blue-500" />} title="Create Quiz" to="/instructor/quizzes" />
            <QuickAction icon={<ClipboardList className="w-6 h-6 text-green-500" />} title="Assignment" to="/instructor/assignments" />
            <QuickAction icon={<Briefcase className="w-6 h-6 text-purple-500" />} title="Project Task" to="/instructor/projects" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-center">
          <h2 className="text-xl font-heading font-bold text-heading mb-4">Pending Reviews</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-heading">Assignments</span>
              </div>
              <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-sm">{stats.pendingAssignments}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-heading">Projects</span>
              </div>
              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{stats.pendingProjects}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts / Visual Analytics (CSS Placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#ff6b00]/10 p-6 shadow-[0_4px_20px_-5px_rgba(255,107,0,0.15)] hover:shadow-[0_8px_30px_-5px_rgba(255,107,0,0.25)] transition-colors">
          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-xl font-heading font-bold text-heading">Revenue Overview</h2>
            <div className="relative">
              <button 
                onClick={() => setRevenueDropdownOpen(!revenueDropdownOpen)}
                className="bg-gray-50 border border-border rounded-lg px-4 py-2 text-sm font-medium outline-none flex items-center justify-between min-w-[130px] hover:bg-gray-100 transition-colors"
              >
                {revenueTime}
                <svg className="w-4 h-4 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {revenueDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRevenueDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    {['Last 7 Days', 'Last 30 Days', 'This Year'].map(opt => (
                      <div 
                        key={opt}
                        onClick={() => { setRevenueTime(opt); setRevenueDropdownOpen(false); }}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors ${revenueTime === opt ? 'bg-orange-50 text-orange-500 font-medium' : 'text-gray-600'}`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="h-[300px] mt-4 w-full">
            <CustomVerticalBarChart 
              data={[
                { name: 'Mon', Revenue: 2000 },
                { name: 'Tue', Revenue: 3000 },
                { name: 'Wed', Revenue: 2250 },
                { name: 'Thu', Revenue: 4000 },
                { name: 'Fri', Revenue: 3250 },
                { name: 'Sat', Revenue: 4500 },
                { name: 'Sun', Revenue: 3750 },
              ]} 
              xKey="name" 
              yKey="Revenue" 
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ff6b00]/10 p-6 shadow-[0_4px_20px_-5px_rgba(255,107,0,0.15)] hover:shadow-[0_8px_30px_-5px_rgba(255,107,0,0.25)] transition-colors">
          <h2 className="text-xl font-heading font-bold text-heading mb-6">Course Completion Rate</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center h-64">
            {/* Mock Donut Chart using Conic Gradient */}
            <div className="relative w-48 h-48 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#10B981 ${stats.completionRate}%, #f3f4f6 0)` }}>
               <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center">
                 <GraduationCap className="w-8 h-8 text-green-500 mb-1" />
                 <span className="text-3xl font-bold text-heading">{stats.completionRate}%</span>
               </div>
            </div>
            <div className="space-y-4 flex-1 w-full">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-body font-medium">Completed</span>
                   <span className="font-bold text-green-600">{stats.completionRate}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                   <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-body font-medium">In Progress</span>
                   <span className="font-bold text-orange-500">{100 - stats.completionRate}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                   <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${100 - stats.completionRate}%` }}></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Recent Enrollments</h2>
            <Link to="/instructor/students" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recentEnrollments.map((enrollment: any) => (
              <div key={enrollment.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                  {enrollment.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-heading text-sm truncate">{enrollment.name}</h4>
                  <p className="text-xs text-body truncate">Enrolled in: <span className="font-medium text-heading">{enrollment.course}</span></p>
                </div>
                <div className="text-xs text-caption shrink-0">{enrollment.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Recent Reviews</h2>
            <Link to="/instructor/reviews" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recentReviews.map((review: any) => (
              <div key={review.id} className="p-4 rounded-xl border border-border bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-caption">{review.date}</span>
                </div>
                <p className="text-sm text-heading italic mb-2">"{review.text}"</p>
                <div className="text-xs text-body flex items-center gap-2">
                  <span className="font-semibold text-heading">{review.name}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="truncate">{review.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default InstructorDashboard;

const StatCard = ({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm text-body font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-heading font-bold text-heading">{value}</h3>
      {trend && (
        <p className={`text-xs font-bold mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
          {trend} this month
        </p>
      )}
    </div>
  </div>
);

const QuickAction = ({ icon, title, to }: { icon: React.ReactNode, title: string, to: string }) => (
  <Link to={to} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-gray-50/50 hover:bg-orange-50 hover:border-orange-200 transition-colors text-center group">
    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-sm font-semibold text-heading">{title}</span>
  </Link>
);
