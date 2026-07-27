import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  Compass
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPlayerRoute = location.pathname.includes('/course-player');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const sidebarGroups = [
    {
      title: 'LEARNING',
      links: [
        { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
        { name: 'Browse Courses', path: '/student/browse-courses', icon: <Compass className="w-[18px] h-[18px]" /> },
        { name: 'My Courses', path: '/student/my-courses', icon: <Book className="w-[18px] h-[18px]" /> },
        { name: 'Wishlist', path: '/student/wishlist', icon: <Heart className="w-[18px] h-[18px]" /> },
        { name: 'Cart', path: '/student/cart', icon: <ShoppingBag className="w-[18px] h-[18px]" /> },
      ]
    },
    {
      title: 'ASSESSMENTS',
      links: [
        { name: 'Assignments', path: '/student/assignments', icon: <ClipboardList className="w-[18px] h-[18px]" /> },
        { name: 'Quizzes', path: '/student/quizzes', icon: <CheckSquare className="w-[18px] h-[18px]" /> },
        { name: 'Projects', path: '/student/projects', icon: <Briefcase className="w-[18px] h-[18px]" /> },
        { name: 'Certificates', path: '/student/certificates', icon: <Award className="w-[18px] h-[18px]" /> },
      ]
    },
    {
      title: 'ACCOUNT',
      links: [
        { name: 'Notifications', path: '/student/notifications', icon: <Bell className="w-[18px] h-[18px]" /> },
        { name: 'Profile', path: '/student/profile', icon: <User className="w-[18px] h-[18px]" /> },
        { name: 'Settings', path: '/student/settings', icon: <Settings className="w-[18px] h-[18px]" /> },
      ]
    }
  ];

  return (
    <div className="bg-[#f8f9fa] h-screen flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-border hidden lg:flex flex-col transition-all duration-300 relative z-20 ${isSidebarCollapsed ? 'w-[88px]' : 'w-[250px]'}`}>
        
        {/* Toggle Button floating on the right edge */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-8 -right-3.5 p-1 rounded-full text-caption hover:text-heading hover:bg-gray-50 transition-colors z-30 bg-white shadow-md border border-border flex items-center justify-center cursor-pointer"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* User Profile Block (Fixed) */}
        <div className={`flex items-center mb-6 mt-6 shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-5'}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex items-center justify-center shrink-0 text-primary font-bold text-lg">
            JD
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-[15px] font-semibold text-heading truncate leading-tight">John Doe</div>
              <div className="text-xs font-normal text-caption truncate mt-0.5">Student</div>
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
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.name}>
                        <Link
                          to={link.path}
                          title={isSidebarCollapsed ? link.name : undefined}
                          className={`flex items-center h-9 rounded-lg transition-all duration-200 cursor-pointer ${
                            isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                          } ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-body hover:bg-gray-50 hover:text-heading'
                          }`}
                        >
                          <div className={`shrink-0 ${isActive ? 'text-primary' : ''}`}>
                            {link.icon}
                          </div>
                          {!isSidebarCollapsed && (
                            <span className={`text-[14px] leading-[20px] truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
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
          <div className={`flex items-center mb-4 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'}`}>
            {!isSidebarCollapsed && <span className="text-xs font-semibold text-caption uppercase tracking-wider">Theme</span>}
            <ThemeToggle />
          </div>
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

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto overflow-x-hidden ${!isPlayerRoute ? 'p-6 lg:p-8' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;
