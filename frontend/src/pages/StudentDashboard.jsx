import { useState } from "react";
import { clearAuthSession } from "../utils/auth";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  Heart,
  ShoppingBag,
  ClipboardList,
  CheckSquare,
  Briefcase,
  Award,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Compass,
  Search,
  Menu,
  X
} from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle";
import GlobalSearch from "../components/common/GlobalSearch";
const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPlayerRoute = location.pathname.includes("/course-player");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "John Doe";
  const userEmail = user.email || "john.doe@example.com";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };
  const sidebarGroups = [
    {
      title: "LEARNING",
      links: [
        { name: "Dashboard", path: "/student/dashboard", icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
        { name: "Browse Courses", path: "/student/browse-courses", icon: <Compass className="w-[18px] h-[18px]" /> },
        { name: "My Courses", path: "/student/my-courses", icon: <Book className="w-[18px] h-[18px]" /> },
        { name: "Wishlist", path: "/student/wishlist", icon: <Heart className="w-[18px] h-[18px]" /> },
        { name: "Cart", path: "/student/cart", icon: <ShoppingBag className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "ASSESSMENTS",
      links: [
        { name: "Assignments", path: "/student/assignments", icon: <ClipboardList className="w-[18px] h-[18px]" /> },
        { name: "Quizzes", path: "/student/quizzes", icon: <CheckSquare className="w-[18px] h-[18px]" /> },
        { name: "Projects", path: "/student/projects", icon: <Briefcase className="w-[18px] h-[18px]" /> },
        { name: "Certificates", path: "/student/certificates", icon: <Award className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: "ACCOUNT",
      links: [
        { name: "Notifications", path: "/student/notifications", icon: <Bell className="w-[18px] h-[18px]" /> },
        { name: "Settings", path: "/student/settings", icon: <Settings className="w-[18px] h-[18px]" /> }
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
    /* User Profile Block (Fixed) */
  }
        <div className={`flex items-center mb-6 mt-6 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? "justify-center" : "gap-3 px-5"}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex items-center justify-center shrink-0 text-primary font-bold text-lg">
            JD
          </div>
          {!isSidebarCollapsed && <div className="overflow-hidden">
              <div className="text-[15px] font-semibold text-heading truncate leading-tight">John Doe</div>
              <div className="text-xs font-normal text-caption truncate mt-0.5">Student</div>
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
    const isActive = location.pathname === link.path;
    return <li key={link.name}>
                        <Link
      to={link.path}
      title={isSidebarCollapsed ? link.name : void 0}
      className={`flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} ${isActive ? "bg-primary/10 text-primary" : "text-body hover:bg-gray-50 hover:text-heading"}`}
    >
                          <div className={`shrink-0 ${isActive ? "text-primary" : ""}`}>
                            {link.icon}
                          </div>
                          {!isSidebarCollapsed && <span className={`text-[14px] leading-[20px] truncate ${isActive ? "font-bold" : "font-medium"}`}>
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
            title={isSidebarCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-50 ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"}`}
          >
            <div className="shrink-0"><LogOut className="w-5 h-5" /></div>
            {!isSidebarCollapsed && <span className="text-[14px] leading-[20px] font-medium truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar Header */}
        {!isPlayerRoute && (
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
              <GlobalSearch role="student" />
            </div>

            {/* Right Side Tools & User Profile */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <ThemeToggle />
              <Link
                to="/student/notifications"
                title="Notifications"
                className="relative p-2 text-body hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <Link to="/student/settings" className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-bold text-heading leading-tight truncate max-w-[120px] md:max-w-none">{userName}</div>
                  <div className="text-xs text-caption mt-0.5 truncate max-w-[140px] md:max-w-none">{userEmail}</div>
                </div>
              </Link>
            </div>
          </header>
        )}

        {/* Page Body */}
        <main className={`flex-1 overflow-y-auto overflow-x-hidden ${!isPlayerRoute ? "p-4 sm:p-6 lg:p-8" : ""}`}>
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
                  <div className="text-xs text-caption">Student</div>
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
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>;
};
var stdin_default = StudentDashboard;
export {
  stdin_default as default
};
