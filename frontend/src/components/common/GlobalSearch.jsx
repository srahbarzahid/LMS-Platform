import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  FileText,
  BookOpen,
  User,
  CheckSquare,
  ClipboardList,
  Briefcase,
  Award,
  Settings,
  LayoutDashboard,
  Bell,
  Compass,
  Heart,
  ShoppingBag,
  PlusCircle,
  ListTree,
  BarChart3,
  Megaphone,
  CreditCard,
  Tag,
  ArrowRight,
  Sparkles
} from "lucide-react";

const ADMIN_SEARCH_DATA = [
  // Pages
  { title: "Admin Dashboard", category: "Page", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "User Management", category: "Page", path: "/admin/users", icon: User },
  { title: "Course Management", category: "Page", path: "/admin/courses", icon: BookOpen },
  { title: "Course Approvals", category: "Page", path: "/admin/course-approvals", icon: CheckSquare },
  { title: "Categories Manager", category: "Page", path: "/admin/categories", icon: ListTree },
  { title: "Enrollments & Registrations", category: "Page", path: "/admin/enrollments", icon: FileText },
  { title: "Payments & Financials", category: "Page", path: "/admin/payments", icon: CreditCard },
  { title: "Coupons & Discounts", category: "Page", path: "/admin/coupons", icon: Tag },
  { title: "Offers & Promotions", category: "Page", path: "/admin/offers", icon: Tag },
  { title: "Platform Announcements", category: "Page", path: "/admin/announcements", icon: Megaphone },
  { title: "Analytics & Reports", category: "Page", path: "/admin/analytics", icon: BarChart3 },
  { title: "Platform Settings", category: "Page", path: "/admin/settings", icon: Settings },
  
  // Courses
  { title: "Complete Web Development Bootcamp 2026", category: "Course", path: "/admin/courses", icon: BookOpen, sub: "By Dr. Sarah Jenkins" },
  { title: "React 19 & Next.js 15 Full-Stack Masterclass", category: "Course", path: "/admin/courses", icon: BookOpen, sub: "By Alex Rivera" },
  { title: "Python for Data Science & Machine Learning", category: "Course", path: "/admin/courses", icon: BookOpen, sub: "By Dr. Sarah Jenkins" },
  { title: "UI/UX Design Fundamentals & Figma", category: "Course", path: "/admin/courses", icon: BookOpen, sub: "By Elena Rostova" },
  
  // Users
  { title: "John Doe", category: "Student User", path: "/admin/users", icon: User, sub: "john.doe@example.com" },
  { title: "Dr. Sarah Jenkins", category: "Instructor User", path: "/admin/users", icon: User, sub: "sarah.jenkins@example.com" },
  { title: "Alex Rivera", category: "Instructor User", path: "/admin/users", icon: User, sub: "alex.rivera@example.com" },
  { title: "Michael Chang", category: "Student User", path: "/admin/users", icon: User, sub: "michael.c@example.com" }
];

const STUDENT_SEARCH_DATA = [
  // Pages
  { title: "Student Dashboard", category: "Page", path: "/student/dashboard", icon: LayoutDashboard },
  { title: "Browse All Courses", category: "Page", path: "/student/browse-courses", icon: Compass },
  { title: "My Enrolled Courses", category: "Page", path: "/student/my-courses", icon: BookOpen },
  { title: "My Wishlist", category: "Page", path: "/student/wishlist", icon: Heart },
  { title: "Shopping Cart", category: "Page", path: "/student/cart", icon: ShoppingBag },
  { title: "My Assignments", category: "Page", path: "/student/assignments", icon: ClipboardList },
  { title: "Quizzes & Tests", category: "Page", path: "/student/quizzes", icon: CheckSquare },
  { title: "Hands-on Projects", category: "Page", path: "/student/projects", icon: Briefcase },
  { title: "My Certificates", category: "Page", path: "/student/certificates", icon: Award },
  { title: "Notifications", category: "Page", path: "/student/notifications", icon: Bell },
  { title: "Student Profile & Settings", category: "Page", path: "/student/settings", icon: Settings },

  // Courses
  { title: "Complete Web Development Bootcamp", category: "Course", path: "/student/browse-courses", icon: BookOpen, sub: "Development • 4.8 ★" },
  { title: "React 19 & Next.js 15 Masterclass", category: "Course", path: "/student/my-courses", icon: BookOpen, sub: "Enrolled • 65% Completed" },
  { title: "Python for Data Science & ML", category: "Course", path: "/student/browse-courses", icon: BookOpen, sub: "Data Science • 4.9 ★" },
  { title: "UI/UX Design Systems in Figma", category: "Course", path: "/student/browse-courses", icon: BookOpen, sub: "Design • 4.7 ★" },

  // Assessments & Items
  { title: "Build a Weather Station Project", category: "Project", path: "/student/projects", icon: Briefcase, sub: "Score: 95/100 • Graded" },
  { title: "React Hooks & State Quiz", category: "Quiz", path: "/student/quizzes", icon: CheckSquare, sub: "Passed • 90%" },
  { title: "Python Data Structures Assignment", category: "Assignment", path: "/student/assignments", icon: ClipboardList, sub: "Due Soon" },
  { title: "Full-Stack Web Dev Certificate", category: "Certificate", path: "/student/certificates", icon: Award, sub: "Issued Jan 2026" }
];

const INSTRUCTOR_SEARCH_DATA = [
  // Pages
  { title: "Instructor Dashboard", category: "Page", path: "/instructor/dashboard", icon: LayoutDashboard },
  { title: "My Courses List", category: "Page", path: "/instructor/courses", icon: BookOpen },
  { title: "Create New Course", category: "Page", path: "/instructor/courses/create", icon: PlusCircle },
  { title: "Curriculum Editor", category: "Page", path: "/instructor/curriculum", icon: ListTree },
  { title: "Assignments Manager", category: "Page", path: "/instructor/assignments", icon: ClipboardList },
  { title: "Quizzes Manager", category: "Page", path: "/instructor/quizzes", icon: CheckSquare },
  { title: "Projects Manager", category: "Page", path: "/instructor/projects", icon: Briefcase },
  { title: "Enrolled Students", category: "Page", path: "/instructor/students", icon: User },
  { title: "Analytics & Earnings", category: "Page", path: "/instructor/analytics", icon: BarChart3 },
  { title: "Announcements Manager", category: "Page", path: "/instructor/announcements", icon: Megaphone },
  { title: "Instructor Settings", category: "Page", path: "/instructor/settings", icon: Settings },

  // Courses
  { title: "Web Development Bootcamp 2026", category: "My Course", path: "/instructor/courses", icon: BookOpen, sub: "1,240 Students Enrolled" },
  { title: "Advanced React & Next.js Architecture", category: "My Course", path: "/instructor/courses", icon: BookOpen, sub: "850 Students Enrolled" },

  // Students & Submissions
  { title: "John Doe", category: "Enrolled Student", path: "/instructor/students", icon: User, sub: "Web Dev Bootcamp • 85% Progress" },
  { title: "Michael Chang", category: "Enrolled Student", path: "/instructor/students", icon: User, sub: "Pending Assignment Review" },
  { title: "Weather Station Submissions", category: "Project Submissions", path: "/instructor/projects", icon: Briefcase, sub: "12 Submissions to Grade" }
];

const GlobalSearch = ({ role = "student" }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Pick search dataset by role
  const dataset =
    role === "admin"
      ? ADMIN_SEARCH_DATA
      : role === "instructor"
      ? INSTRUCTOR_SEARCH_DATA
      : STUDENT_SEARCH_DATA;

  // Filter items matching query
  const results = query.trim()
    ? dataset.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.sub && item.sub.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Group results by category
  const groupedResults = results.reduce((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Listen for Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (path) => {
    setIsOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          name="lms_global_search_query"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          data-lpignore="true"
          data-form-type="other"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Search anything... (Ctrl+K)`}
          className="w-full pl-9 pr-16 py-2 bg-gray-100 dark:bg-neutral-800/80 border border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm transition-all outline-none text-heading placeholder:text-caption shadow-inner"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 text-caption hover:text-heading transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 px-1.5 py-0.5 text-[10px] font-semibold text-caption bg-white dark:bg-neutral-700 border border-border rounded shadow-xs pointer-events-none">
            Ctrl K
          </kbd>
        )}
      </div>

      {/* Global Search Results Dropdown Popover */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-border shadow-2xl rounded-2xl z-50 overflow-hidden max-h-[420px] overflow-y-auto animate-in fade-in-50 zoom-in-95">
          {results.length > 0 ? (
            <div className="p-2 space-y-3">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-caption flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-primary" /> {category}s
                  </div>
                  <div className="space-y-0.5">
                    {items.map((item, idx) => {
                      const IconComponent = item.icon || FileText;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectResult(item.path)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/10 dark:hover:bg-neutral-800 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="text-sm font-bold text-heading truncate group-hover:text-primary transition-colors">
                                {item.title}
                              </div>
                              {item.sub && (
                                <div className="text-xs text-caption truncate mt-0.5">
                                  {item.sub}
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-caption opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-caption mx-auto mb-3 opacity-40 animate-bounce" />
              <p className="text-sm font-bold text-heading">No results found for "{query}"</p>
              <p className="text-xs text-caption mt-1">Try searching for pages, courses, students, or assignments.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
