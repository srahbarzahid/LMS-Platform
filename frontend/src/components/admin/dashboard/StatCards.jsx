import {
  Users,
  UserCog,
  BookOpen,
  CheckCircle,
  Award,
  IndianRupee,
  CreditCard,
  TrendingUp,
  AlertCircle
} from "lucide-react";
const StatCards = ({ overview }) => {
  const cards = [
    { title: "Total Students", value: overview.totalStudents, growth: overview.studentGrowth, icon: Users, colorClass: "bg-blue-50 text-blue-600", link: "/admin/students" },
    { title: "Total Instructors", value: overview.totalInstructors, growth: overview.instructorGrowth, icon: UserCog, colorClass: "bg-purple-50 text-purple-600", link: "/admin/instructors" },
    { title: "Total Courses", value: overview.totalCourses, growth: overview.courseGrowth, icon: BookOpen, colorClass: "bg-orange-50 text-orange-600", link: "/admin/courses" },
    { title: "Published Courses", value: overview.publishedCourses, growth: 0, icon: CheckCircle, colorClass: "bg-teal-50 text-teal-600", link: "/admin/courses" },
    { title: "Pending Approvals", value: overview.pendingApprovals, growth: 0, icon: AlertCircle, colorClass: "bg-yellow-50 text-yellow-600", link: "/admin/course-approvals" },
    { title: "Total Revenue", value: `\u20B9${overview.totalRevenue.toLocaleString()}`, growth: overview.revenueGrowth, icon: IndianRupee, colorClass: "bg-emerald-50 text-emerald-600", link: "/admin/revenue" },
    { title: "Total Orders", value: overview.totalOrders.toLocaleString(), growth: overview.orderGrowth, icon: CreditCard, colorClass: "bg-indigo-50 text-indigo-600", link: "/admin/payments" },
    { title: "Certificates Issued", value: overview.certificatesIssued.toLocaleString(), growth: overview.certificateGrowth, icon: Award, colorClass: "bg-rose-50 text-rose-600", link: "/admin/certificates" },
    { title: "Avg Course Rating", value: overview.averageCourseRating, growth: 0, icon: TrendingUp, colorClass: "bg-amber-50 text-amber-600", link: "/admin/courses" },
    { title: "Completion Rate", value: `${overview.courseCompletionRate}%`, growth: 0, icon: CheckCircle, colorClass: "bg-sky-50 text-sky-600", link: "/admin/analytics" }
  ];
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => {
    const Icon = card.icon;
    return <div
      key={idx}
      className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:border-orange-400 hover:shadow-md transition-all duration-300"
    >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              {card.growth > 0 && <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  +{card.growth}%
                </div>}
            </div>
            
            <div>
              <div className="text-2xl font-bold text-heading">
                {card.value}
              </div>
              <div className="text-sm font-medium text-caption mt-1">
                {card.title}
              </div>
            </div>
          </div>;
  })}
    </div>;
};
var stdin_default = StatCards;
export {
  stdin_default as default
};
