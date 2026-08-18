import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  PlusCircle,
  MoreVertical,
  Edit,
  Eye,
  BarChart2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Users,
  Star,
  Award,
  Send,
  ChevronDown
} from "lucide-react";
const InstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  useEffect(() => {
    setTimeout(() => {
      setCourses([
        {
          id: "1",
          title: "Complete UI/UX Design Masterclass",
          category: "Design",
          thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=60",
          students: 1240,
          rating: 4.8,
          price: 89.99,
          revenue: 111587.6,
          status: "Published",
          lastUpdated: "Oct 24, 2023"
        },
        {
          id: "2",
          title: "Advanced React & Next.js Architecture",
          category: "Development",
          thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=60",
          students: 850,
          rating: 4.9,
          price: 129.99,
          revenue: 110491.5,
          status: "Published",
          lastUpdated: "Nov 12, 2023"
        },
        {
          id: "3",
          title: "Business Strategy & Leadership 101",
          category: "Business",
          thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=60",
          students: 0,
          rating: 0,
          price: 49.99,
          revenue: 0,
          status: "Draft",
          lastUpdated: "Jan 15, 2024"
        },
        {
          id: "4",
          title: "Digital Marketing Crash Course Pro",
          category: "Marketing",
          thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=60",
          students: 0,
          rating: 0,
          price: 74.99,
          revenue: 0,
          status: "Pending Review",
          lastUpdated: "Jan 20, 2024"
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Published</span>;
      case "Draft":
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Edit className="w-3 h-3" /> Draft</span>;
      case "Pending Review":
        return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };
  return <div className="max-w-7xl mx-auto space-y-6 pb-8">
      
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">My Courses</h1>
          <p className="text-body mt-1">Manage and track the performance of your courses.</p>
        </div>
        <Link to="/instructor/courses/create" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors shrink-0">
          <PlusCircle className="w-5 h-5" />
          Create New Course
        </Link>
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
    type="text"
    placeholder="Search courses..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {
    /* Status Filter */
  }
          <div className="relative group/status z-30">
            <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-4 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4 text-caption" />
              <span className="text-sm font-medium text-heading">
                {statusFilter === "All" ? "All Statuses" : statusFilter}
              </span>
              <ChevronDown className="w-4 h-4 text-caption ml-1 group-hover/status:rotate-180 transition-transform" />
            </div>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all py-2 origin-top-right">
              {["All", "Published", "Draft", "Pending Review"].map((status) => <button
    key={status}
    onClick={() => setStatusFilter(status)}
    className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status ? "bg-primary/5 text-primary font-bold" : "text-body hover:bg-gray-50 hover:text-heading"}`}
  >
                  {status === "All" ? "All Statuses" : status}
                </button>)}
            </div>
          </div>
          
          {
    /* Sort Filter */
  }
          <div className="relative group/sort z-20">
            <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-4 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-heading">
                Sort by: {sortBy}
              </span>
              <ChevronDown className="w-4 h-4 text-caption ml-1 group-hover/sort:rotate-180 transition-transform" />
            </div>
            
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all py-2 origin-top-right">
              {["Newest", "Most Students", "Highest Rating", "Highest Revenue"].map((option) => <button
    key={option}
    onClick={() => setSortBy(option)}
    className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortBy === option ? "bg-primary/5 text-primary font-bold" : "text-body hover:bg-gray-50 hover:text-heading"}`}
  >
                  Sort by: {option}
                </button>)}
            </div>
          </div>
        </div>
      </div>

      {
    /* Course List */
  }
      {loading ? <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div> : <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden lg:overflow-visible">
          <div className="overflow-x-auto lg:overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider lg:rounded-tl-2xl">Course</th>
                  <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Students</th>
                  <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Revenue</th>
                  <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider text-right lg:rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.length > 0 ? filteredCourses.map((course) => <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img src={course.thumbnail} alt={course.title} className="w-20 h-14 rounded-lg object-cover border border-border" />
                        <div>
                          <h3 className="font-bold text-heading text-sm mb-1">{course.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-caption">
                            <span>{course.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>Updated {course.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-heading">{course.students.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-heading">${course.revenue.toLocaleString()}</div>
                      <div className="text-xs text-caption">${course.price}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button
    title="Edit Course"
    onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
    className="p-2 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
  >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
    title="Curriculum"
    onClick={() => navigate(`/instructor/curriculum?courseId=${course.id}`)}
    className="p-2 text-caption hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
  >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
    title="Analytics"
    onClick={() => navigate("/instructor/analytics")}
    className="p-2 text-caption hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        <div className="relative group/menu">
                          <button title="More" className="p-2 text-caption hover:text-heading hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {
    /* Dropdown Menu */
  }
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 py-2">
                            
                            {
    /* Course */
  }
                            <div className="px-4 py-1.5 text-[10px] font-bold text-caption uppercase tracking-wider">Course</div>
                            <button className="w-full text-left px-4 py-2 text-sm text-body hover:text-heading hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" /> Preview as Student
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-body hover:text-heading hover:bg-gray-50 flex items-center gap-2">
                              <Users className="w-4 h-4" /> View Enrolled Students
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-body hover:text-heading hover:bg-gray-50 flex items-center gap-2">
                              <Star className="w-4 h-4" /> Reviews & Ratings
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-body hover:text-heading hover:bg-gray-50 flex items-center gap-2">
                              <Award className="w-4 h-4" /> Certificates
                            </button>

                            <div className="my-1 border-t border-border" />

                            {
    /* Publishing */
  }
                            <div className="px-4 py-1.5 text-[10px] font-bold text-caption uppercase tracking-wider">Publishing</div>
                            {course.status === "Draft" && <button className="w-full text-left px-4 py-2 text-sm text-body hover:text-primary hover:bg-primary/5 flex items-center gap-2">
                                <Send className="w-4 h-4" /> Submit for Review
                              </button>}
                            {course.status === "Approved" && <button className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Publish Course
                              </button>}
                            {course.status === "Published" && <button className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Unpublish Course
                              </button>}
                            {course.status === "Pending" && <div className="px-4 py-2 text-sm text-caption italic">Awaiting review...</div>}

                            <div className="my-1 border-t border-border" />



                            {
    /* Danger Zone */
  }
                            <div className="px-4 py-1.5 text-[10px] font-bold text-red-500/70 uppercase tracking-wider">Danger Zone</div>
                            <button
    onClick={() => {
      if (window.confirm(`Are you sure you want to delete "${course.title}"?

This action cannot be undone.`)) {
        console.log("Deleted", course.id);
      }
    }}
    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
  >
                              <Trash2 className="w-4 h-4" /> Delete Course
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>) : <tr>
                    <td colSpan={5} className="py-12 text-center text-caption">
                      No courses found matching your criteria.
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};
var stdin_default = InstructorCourses;
export {
  stdin_default as default
};
