import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, UserCog, GraduationCap, BookOpen, ListTree, CheckSquare,
  BookCheck, CreditCard, Tag, 
  Award, Stamp, Monitor, Star, Bell, BarChart2,
  Settings, User, LogOut, ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const sidebarGroups = [
    {
      title: 'OVERVIEW',
      links: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'USER MANAGEMENT',
      links: [
        { name: 'Students', path: '/admin/students', icon: <GraduationCap className="w-[18px] h-[18px]" /> },
        { name: 'Instructors', path: '/admin/instructors', icon: <UserCog className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'COURSE MANAGEMENT',
      links: [
        { name: 'Courses', path: '/admin/courses', icon: <BookOpen className="w-[18px] h-[18px]" /> },
        { name: 'Categories', path: '/admin/categories', icon: <ListTree className="w-[18px] h-[18px]" /> },
        { name: 'Course Approvals', path: '/admin/course-approvals', icon: <CheckSquare className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'LEARNING MANAGEMENT',
      links: [
        { name: 'Enrollments', path: '/admin/enrollments', icon: <BookCheck className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'BUSINESS',
      links: [
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-[18px] h-[18px]" /> },
        { name: 'Coupons & Offers', path: '/admin/offers', icon: <Tag className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'CERTIFICATES',
      links: [
        { name: 'Templates', path: '/admin/certificate-templates', icon: <Stamp className="w-[18px] h-[18px]" /> },
        { name: 'Issued Certificates', path: '/admin/certificates', icon: <Award className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'CONTENT',
      links: [
        { name: 'Website Content', path: '/admin/content', icon: <Monitor className="w-[18px] h-[18px]" /> },
        { name: 'Reviews', path: '/admin/reviews', icon: <Star className="w-[18px] h-[18px]" /> },
        { name: 'Announcements', path: '/admin/announcements', icon: <Bell className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'REPORTS',
      links: [
        { name: 'Analytics', path: '/admin/analytics', icon: <BarChart2 className="w-[18px] h-[18px]" /> }
      ]
    },
    {
      title: 'SETTINGS',
      links: [
        { name: 'Platform Settings', path: '/admin/settings', icon: <Settings className="w-[18px] h-[18px]" /> },
        { name: 'Profile', path: '/admin/profile', icon: <User className="w-[18px] h-[18px]" /> }
      ]
    }
  ];

  return (
    <div className="bg-[#f8f9fa] h-screen flex print:h-auto print:block">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-border hidden lg:flex flex-col transition-all duration-300 relative z-20 print:hidden ${isSidebarCollapsed ? 'w-[88px]' : 'w-[250px]'}`}>
        
        {/* Toggle Button floating on the right edge */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-8 -right-3.5 p-1 rounded-full text-caption hover:text-heading hover:bg-gray-50 transition-colors z-30 bg-white shadow-md border border-border flex items-center justify-center cursor-pointer"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* User Profile Block (Fixed Brand Area) */}
        <div className={`flex items-center mb-6 mt-6 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-5'}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-[16px] font-bold text-heading truncate leading-tight">Admin Portal</div>
              <div className="text-xs font-normal text-caption truncate mt-0.5">Control Center</div>
            </div>
          )}
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <nav className="pb-6">
            {sidebarGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {/* Section Heading */}
                {!isSidebarCollapsed ? (
                  <div className={`text-[11px] font-semibold tracking-[1px] uppercase text-caption mb-1 px-2 ${groupIdx === 0 ? 'mt-2' : 'mt-5'}`}>
                    {group.title}
                  </div>
                ) : (
                  groupIdx !== 0 && <div className="w-8 h-px bg-border my-4 mx-auto"></div>
                )}
                
                {/* Links */}
                <ul className="space-y-0.5">
                  {group.links.map((link) => {
                    const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                    return (
                      <li key={link.name}>
                        <Link
                          to={link.path}
                          title={isSidebarCollapsed ? link.name : undefined}
                          className={`flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer ${
                            isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                          } ${
                            isActive
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-body font-medium hover:bg-gray-50 hover:text-heading'
                          }`}
                        >
                          <div className={`shrink-0 ${isActive ? 'text-primary' : ''}`}>
                            {link.icon}
                          </div>
                          {!isSidebarCollapsed && (
                            <span className="text-[14px] leading-[20px] truncate">
                              {link.name}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Section Pinned to Bottom */}
        <div className="p-4 border-t border-border shrink-0 bg-white">
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-50 ${
              isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            }`}
          >
            <div className="shrink-0"><LogOut className="w-5 h-5" /></div>
            {!isSidebarCollapsed && <span className="text-[14px] leading-[20px] font-medium truncate">Logout</span>}
          </button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden print:overflow-visible print:min-h-0 print:block">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-border flex shrink-0 items-center justify-between px-8 z-10 print:hidden">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-caption absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm w-64 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 text-body hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-heading leading-none">Super Admin</div>
                <div className="text-xs text-caption mt-1">admin@pitech.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
