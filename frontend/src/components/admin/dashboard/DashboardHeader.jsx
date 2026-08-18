import { UserPlus, BookOpen, ListTree, Tag, Megaphone, Plus } from "lucide-react";
import { Link } from "react-router-dom";
const DashboardHeader = () => {
  const quickActions = [
    { label: "Add Student", icon: UserPlus, path: "/admin/students/add", colorClass: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
    { label: "Add Instructor", icon: UserPlus, path: "/admin/instructors/add", colorClass: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100" },
    { label: "Manage Courses", icon: BookOpen, path: "/admin/courses", colorClass: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100" },
    { label: "Categories", icon: ListTree, path: "/admin/categories", colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
    { label: "Offers", icon: Tag, path: "/admin/offers", colorClass: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" },
    { label: "Announcement", icon: Megaphone, path: "/admin/announcements/create", colorClass: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100" }
  ];
  return <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
      {
    /* Welcome & Time Info */
  }
      <div>
        <h1 className="text-3xl font-heading font-bold text-heading">Welcome Back, Admin</h1>
      </div>

      {
    /* Quick Actions */
  }
      <div className="flex flex-wrap items-center gap-3">
        {quickActions.map((action, index) => {
    const Icon = action.icon;
    return <Link
      key={index}
      to={action.path}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md ${action.colorClass}`}
    >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Link>;
  })}
        {
    /* Floating Quick Action Dropdown for mobile */
  }
        <button className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gray-900 text-white shadow-sm shadow-black/10">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>;
};
var stdin_default = DashboardHeader;
export {
  stdin_default as default
};
