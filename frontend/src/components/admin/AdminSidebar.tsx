import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, UserCog, GraduationCap, BookOpen, ListTree, CheckSquare,
  BookCheck, CreditCard, Tag, 
  TrendingUp, Award, Stamp, Monitor, Star, Bell, BarChart2,
  Settings, User, LogOut
} from 'lucide-react';

const SIDEBAR_SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { name: 'Students', path: '/admin/students', icon: GraduationCap },
      { name: 'Instructors', path: '/admin/instructors', icon: UserCog }
    ]
  },
  {
    title: 'COURSE MANAGEMENT',
    items: [
      { name: 'Courses', path: '/admin/courses', icon: BookOpen },
      { name: 'Categories', path: '/admin/categories', icon: ListTree },
      { name: 'Course Approvals', path: '/admin/course-approvals', icon: CheckSquare }
    ]
  },
  {
    title: 'LEARNING MANAGEMENT',
    items: [
      { name: 'Enrollments', path: '/admin/enrollments', icon: BookCheck }
    ]
  },
  {
    title: 'FINANCIAL MANAGEMENT',
    items: [
      { name: 'Payments', path: '/admin/payments', icon: CreditCard }
    ]
  },
  {
    title: 'BUSINESS',
    items: [
      { name: 'Coupons & Offers', path: '/admin/offers', icon: Tag },
      { name: 'Revenue Reports', path: '/admin/revenue', icon: TrendingUp }
    ]
  },
  {
    title: 'CERTIFICATES',
    items: [
      { name: 'Templates', path: '/admin/certificate-templates', icon: Stamp },
      { name: 'Issued Certificates', path: '/admin/certificates', icon: Award }
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { name: 'Website Content', path: '/admin/content', icon: Monitor },
      { name: 'Reviews', path: '/admin/reviews', icon: Star },
      { name: 'Announcements', path: '/admin/announcements', icon: Bell }
    ]
  },
  {
    title: 'REPORTS',
    items: [
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 }
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
      { name: 'Profile', path: '/admin/profile', icon: User }
    ]
  }
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Brand */}
      <div className="p-6 border-b border-border sticky top-0 bg-white z-10">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl text-heading">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1">
        {SIDEBAR_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-bold text-caption uppercase tracking-wider mb-3 px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-body hover:bg-gray-100 hover:text-heading'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-caption'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-border sticky bottom-0 bg-white">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
