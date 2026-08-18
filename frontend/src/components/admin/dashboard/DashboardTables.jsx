import { Link } from "react-router-dom";
import { MoreVertical, Star, CheckCircle, XCircle, Clock } from "lucide-react";
const DashboardTables = ({ topCourses, topInstructors, recentPayments, latestStudents }) => {
  const StatusBadge = ({ status }) => {
    let bg = "bg-gray-100 text-gray-700";
    let icon = null;
    if (status === "Success" || status === "Active" || status === "Published") {
      bg = "bg-emerald-50 text-emerald-600 border border-emerald-100";
      icon = <CheckCircle className="w-3 h-3 mr-1 inline" />;
    } else if (status === "Pending") {
      bg = "bg-yellow-50 text-yellow-600 border border-yellow-100";
      icon = <Clock className="w-3 h-3 mr-1 inline" />;
    } else if (status === "Failed" || status === "Inactive" || status === "Rejected") {
      bg = "bg-red-50 text-red-600 border border-red-100";
      icon = <XCircle className="w-3 h-3 mr-1 inline" />;
    }
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-max ${bg}`}>
        {icon}{status}
      </span>;
  };
  return <div className="grid grid-cols-1 gap-8 mb-8">
      
      {
    /* Top Performing Courses */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-heading">Top Performing Courses</h2>
          <Link to="/admin/courses" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
                <th className="p-4 font-semibold whitespace-nowrap">Course & Instructor</th>
                <th className="p-4 font-semibold whitespace-nowrap">Students</th>
                <th className="p-4 font-semibold whitespace-nowrap">Revenue</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">Rating</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topCourses.map((course) => <tr key={course.id} className="border-b border-border/50 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1d] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-heading line-clamp-1">{course.name}</div>
                    <div className="text-xs text-body mt-0.5">{course.instructor}</div>
                  </td>
                  <td className="p-4 font-medium text-body">{course.students.toLocaleString()}</td>
                  <td className="p-4 font-bold text-heading">₹{course.revenue.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-heading">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {course.rating}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Top Instructors */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-heading">Top Instructors</h2>
          <Link to="/admin/instructors" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
                <th className="p-4 font-semibold whitespace-nowrap">Instructor</th>
                <th className="p-4 font-semibold whitespace-nowrap">Courses</th>
                <th className="p-4 font-semibold whitespace-nowrap">Revenue</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topInstructors.map((instructor) => <tr key={instructor.id} className="border-b border-border/50 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1d] transition-colors">
                  <td className="p-4 font-bold text-heading flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                      {instructor.name.charAt(0)}
                    </div>
                    {instructor.name}
                  </td>
                  <td className="p-4 font-medium text-body">{instructor.courses}</td>
                  <td className="p-4 font-bold text-heading">₹{instructor.revenue.toLocaleString()}</td>
                  <td className="p-4">
                    <StatusBadge status={instructor.status} />
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Recent Payments */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-heading">Recent Payments</h2>
          <Link to="/admin/payments" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
                <th className="p-4 font-semibold whitespace-nowrap">Transaction</th>
                <th className="p-4 font-semibold whitespace-nowrap">Student & Course</th>
                <th className="p-4 font-semibold whitespace-nowrap">Amount</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentPayments.map((payment) => <tr key={payment.id} className="border-b border-border/50 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1d] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-heading">{payment.id}</div>
                    <div className="text-xs text-caption mt-0.5">{payment.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-heading line-clamp-1">{payment.student}</div>
                    <div className="text-xs text-body mt-0.5 line-clamp-1">{payment.course}</div>
                  </td>
                  <td className="p-4 font-bold text-heading">₹{payment.amount}</td>
                  <td className="p-4">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Latest Students */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-heading">Latest Students</h2>
          <Link to="/admin/students" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
                <th className="p-4 font-semibold whitespace-nowrap">Student Details</th>
                <th className="p-4 font-semibold whitespace-nowrap">Enrolled Course</th>
                <th className="p-4 font-semibold whitespace-nowrap">Joined Date</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {latestStudents.map((student) => <tr key={student.id} className="border-b border-border/50 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1d] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-heading">{student.name}</div>
                    <div className="text-xs text-body mt-0.5">{student.email}</div>
                  </td>
                  <td className="p-4 text-body font-medium">{student.course}</td>
                  <td className="p-4 text-caption">{student.joined}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-caption hover:text-primary hover:bg-orange-50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

    </div>;
};
var stdin_default = DashboardTables;
export {
  stdin_default as default
};
