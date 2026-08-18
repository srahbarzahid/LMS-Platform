import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
const AnalyticsCharts = ({
  userAnalytics,
  revenueAnalytics,
  courseAnalytics,
  enrollmentAnalytics
}) => {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      
      {
    /* Revenue Analytics (Line Chart) */
  }
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-heading">Revenue Analytics</h2>
            <p className="text-sm text-caption">Monthly revenue growth over time</p>
          </div>
          <Link to="/admin/revenue" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueAnalytics.monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `\u20B9${value / 1e3}k`} />
              <Tooltip
    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
    formatter={(value) => [`\u20B9${value.toLocaleString()}`, "Revenue"]}
  />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {
    /* Enrollment Analytics (Bar Chart) */
  }
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-heading">Enrollment Analytics</h2>
            <p className="text-sm text-caption">Student enrollments per month</p>
          </div>
          <Link to="/admin/analytics" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View Reports <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentAnalytics.monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fdba74" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
    cursor={{ fill: "#f8fafc" }}
    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
  />
              <Bar dataKey="enrollments" fill="url(#orangeGradient)" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {
    /* Course Analytics (Horizontal Bar or Custom) */
  }
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-heading">Course Categories</h2>
            <p className="text-sm text-caption">Top performing categories</p>
          </div>
          <Link to="/admin/categories" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            Manage <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="h-72 w-full flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={courseAnalytics.categories} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#1e293b", fontWeight: 600 }} width={90} />
              <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24}>
                {courseAnalytics.categories.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>;
};
var stdin_default = AnalyticsCharts;
export {
  stdin_default as default
};
