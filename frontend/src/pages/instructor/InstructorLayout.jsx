import { useState, useEffect } from "react";
import { clearAuthSession } from "../../utils/auth";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import {
  LayoutDashboard,
  Book,
  PlusCircle,
  ListTree,
  PlaySquare,
  CheckSquare,
  ClipboardList,
  Briefcase,
  Users,
  Star,
  Award,
  BarChart3,
  Megaphone,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Bell,
  Menu,
  X
} from "lucide-react";
import ThemeToggle from "../../components/common/ThemeToggle";
import GlobalSearch from "../../components/common/GlobalSearch";

const InstructorLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userName = userData.name || "Dr. Sarah Jenkins";
  const userEmail = userData.email || "sarah.jenkins@example.com";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  useEffect(() => {
    const syncUser = () => {
      setUserData(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    fetchProfileData();
    fetchAnnouncements();

    window.addEventListener("profileUpdate", syncUser);
    return () => window.removeEventListener("profileUpdate", syncUser);
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await fetch("/api/instructor/settings/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (data.status === "success" && data.data) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updated = {
          ...currentUser,
          name: data.data.name || currentUser.name,
          email: data.data.email || currentUser.email,
          profileImage: data.data.profileImage
        };
        localStorage.setItem("user", JSON.stringify(updated));
        setUserData(updated);
      }
    } catch (e) {}
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/instructor/announcements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setAnnouncements(list.slice(0, 5));
      setUnreadCount(list.length);
    } catch (e) {}
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const sidebarGroups = [
    {
      title: "DASHBOARD",
      links: [
        { name: t("nav.dashboard", "Dashboard"), path: "/instructor/dashboard", icon: <LayoutDashboard className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "COURSE MANAGEMENT",
      links: [
        { name: t("nav.courses", "My Courses"), path: "/instructor/courses", icon: <Book className="w-[18px] h-[18px]" /> },
        { name: t("nav.createCourse", "Create Course"), path: "/instructor/courses/create", icon: <PlusCircle className="w-[18px] h-[18px]" /> },
        { name: t("nav.curriculum", "Curriculum"), path: "/instructor/curriculum", icon: <ListTree className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "ASSESSMENTS",
      links: [
        { name: t("nav.lessons", "Lessons Workspace"), path: "/instructor/lessons", icon: <PlaySquare className="w-[18px] h-[18px]" /> },
        { name: t("nav.quizzes", "Quizzes"), path: "/instructor/quizzes", icon: <CheckSquare className="w-[18px] h-[18px]" /> },
        { name: t("nav.assignments", "Assignments"), path: "/instructor/assignments", icon: <ClipboardList className="w-[18px] h-[18px]" /> },
        { name: t("nav.projects", "Projects"), path: "/instructor/projects", icon: <Briefcase className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "STUDENTS",
      links: [
        { name: t("nav.students", "Students"), path: "/instructor/students", icon: <Users className="w-[18px] h-[18px]" /> },
        { name: t("nav.reviews", "Reviews"), path: "/instructor/reviews", icon: <Star className="w-[18px] h-[18px]" /> },
        { name: t("nav.certificates", "Certificates"), path: "/instructor/certificates", icon: <Award className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "ANALYTICS",
      links: [
        { name: t("nav.analytics", "Analytics"), path: "/instructor/analytics", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
        { name: t("nav.announcements", "Announcements"), path: "/instructor/announcements", icon: <Megaphone className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "ACCOUNT",
      links: [
        { name: t("nav.settings", "Settings"), path: "/instructor/settings", icon: <Settings className="w-[18px] h-[18px]" /> }
      ]
    }
  ];
  return <div className="bg-[#f8f9fa] h-screen flex">
      {
    /* Sidebar */
  }
      <aside className={`bg-white border-r border-border hidden lg:flex flex-col transition-all duration-300 relative z-20 ${isSidebarCollapsed ? "w-[88px]" : "w-[250px]"}`}>
        
        {
    /* Toggle Button floating on the right edge */
  }
        <button
    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
    className="absolute top-8 -right-3.5 p-1 rounded-full text-caption hover:text-heading hover:bg-gray-50 transition-colors z-30 bg-white shadow-md border border-border flex items-center justify-center cursor-pointer"
  >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {
    /* User Profile Block */
  }
        <div className={`flex items-center mb-6 mt-6 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? "justify-center" : "gap-3 px-5"}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
            IN
          </div>
          {!isSidebarCollapsed && <div className="overflow-hidden">
              <div className="text-[15px] font-semibold text-heading truncate leading-tight">Instructor Name</div>
              <div className="text-xs font-normal text-caption truncate mt-0.5">Expert Teacher</div>
            </div>}
        </div>

        {
    /* Scrollable Nav Area */
  }
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <nav className="pb-6">
            {sidebarGroups.map((group, groupIdx) => <div key={groupIdx}>
                {
    /* Section Heading */
  }
                {!isSidebarCollapsed ? <div className={`text-[11px] font-semibold tracking-[1px] uppercase text-caption mb-1 px-2 ${groupIdx === 0 ? "mt-2" : "mt-5"}`}>
                    {group.title}
                  </div> : groupIdx !== 0 && <div className="w-8 h-px bg-border my-4 mx-auto" />}
                
                {
    /* Links */
  }
                <ul className="space-y-0.5">
                  {group.links.map((link) => {
    const actuallyActive = location.pathname === link.path || link.path !== "/instructor/courses" && location.pathname.startsWith(link.path);
    return <li key={link.name}>
                        <Link
      to={link.path}
      title={isSidebarCollapsed ? link.name : void 0}
      className={`flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} ${actuallyActive ? "bg-primary/10 text-primary font-bold" : "text-body font-medium hover:bg-gray-50 hover:text-heading"}`}
    >
                          <div className={`shrink-0 ${actuallyActive ? "text-primary" : ""}`}>
                            {link.icon}
                          </div>
                          {!isSidebarCollapsed && <span className="text-[14px] leading-[20px] truncate">
                              {link.name}
                            </span>}
                        </Link>
                      </li>;
  })}
                </ul>
              </div>)}
          </nav>
        </div>

        {
    /* Logout Section Pinned to Bottom */
  }
        <div className="p-4 border-t border-border shrink-0 bg-white">
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? t("nav.logout", "Log Out") : undefined}
            className={`w-full flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-50 ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"}`}
          >
            <div className="shrink-0"><LogOut className="w-5 h-5" /></div>
            {!isSidebarCollapsed && <span className="text-[14px] leading-[20px] font-medium truncate">{t("nav.logout", "Log Out")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-border flex shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          {/* Left Section: Mobile Menu Toggle + Search */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-heading hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl lg:hidden transition-colors cursor-pointer shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <GlobalSearch role="instructor" />
          </div>

          {/* Right Side Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />

            {/* Notification Bell & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="Announcements & Alerts"
                className="relative p-2 text-body hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/50">
                      <div className="font-bold text-heading text-sm">Notifications & Announcements</div>
                      <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-border custom-scrollbar">
                      {announcements.length > 0 ? (
                        announcements.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setNotificationsOpen(false);
                              if (item.courseId && item.courseId !== "ALL") {
                                navigate(`/instructor/courses/${item.courseId}/edit`);
                              } else {
                                navigate("/instructor/announcements");
                              }
                            }}
                            className="p-3.5 hover:bg-gray-50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                          >
                            <div className="text-xs font-bold text-heading">{item.title}</div>
                            <div className="text-xs text-caption mt-1 line-clamp-2">{item.message || item.text}</div>
                            <div className="text-[10px] text-caption mt-1.5 font-semibold text-primary">{item.course || "All Courses"} • {item.date || "Just now"}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-caption">No recent notifications.</div>
                      )}
                    </div>

                    <div className="p-3 border-t border-border bg-gray-50/50 dark:bg-neutral-800/50 text-center">
                      <Link
                        to="/instructor/announcements"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View All Announcements →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-border hidden sm:block" />

            {/* Profile Avatar */}
            <Link to="/instructor/settings" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 text-primary font-bold text-sm overflow-hidden group-hover:border-primary transition-colors">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-bold text-heading leading-tight truncate max-w-[120px] md:max-w-none">{userName}</div>
                <div className="text-xs text-caption mt-0.5 truncate max-w-[140px] md:max-w-none">{userEmail}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-neutral-900 h-full flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Header with Close button */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                  {userInitials}
                </div>
                <div>
                  <div className="text-sm font-bold text-heading truncate leading-tight">{userName}</div>
                  <div className="text-xs text-caption">Instructor</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-caption hover:text-heading hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <nav className="space-y-4">
                {sidebarGroups.map((group, groupIdx) => (
                  <div key={groupIdx}>
                    <div className="text-[11px] font-semibold tracking-[1px] uppercase text-caption mb-1.5 px-2">
                      {group.title}
                    </div>
                    <ul className="space-y-1">
                      {group.links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                          <li key={link.name}>
                            <Link
                              to={link.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-body hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-heading"
                              }`}
                            >
                              <div className={isActive ? "text-primary" : ""}>{link.icon}</div>
                              <span>{link.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>

            {/* Footer Logout */}
            <div className="p-4 border-t border-border shrink-0 bg-gray-50/50 dark:bg-neutral-900/50">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("nav.logout", "Log Out")}</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>;
};
var stdin_default = InstructorLayout;
export {
  stdin_default as default
};
