import { useState, useEffect, useRef } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Star,
  Download,
  RefreshCw,
  Filter,
  FileText,
  Activity,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import {
  ChartCard,
  CustomLineChart,
  CustomVerticalBarChart,
  CustomDonutChart,
  CustomHorizontalBarChart
} from "../../../components/analytics/ChartCards";
const CustomDropdown = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {label && <span className="text-xs font-bold text-caption uppercase tracking-wider">{label}:</span>}
        <button
    onClick={() => setIsOpen(!isOpen)}
    className="flex items-center justify-between min-w-[140px] bg-white border border-gray-200 hover:border-primary/50 text-sm font-medium text-gray-700 rounded-lg px-4 py-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
  >
          {value}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && <div className="absolute z-50 top-full right-0 mt-2 w-full min-w-[150px] bg-white border border-gray-100 rounded-xl shadow-xl py-1 overflow-hidden origin-top animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => <button
    key={option}
    onClick={() => {
      onChange(option);
      setIsOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === option ? "bg-primary/5 text-primary font-bold" : "text-gray-700 hover:bg-gray-50 font-medium"}`}
  >
              {option}
            </button>)}
        </div>}
    </div>;
};
const KPICard = ({ title, value, growth, description, icon: Icon, colorClass, onClick }) => {
  const bgBase = colorClass.split(" ")[0] || "bg-blue-500";
  return <div
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col relative overflow-hidden"
  >
      {
    /* Decorative blurred blob */
  }
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 ${bgBase} blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all bg-white">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-auto pt-2 relative z-10">
        {growth !== void 0 && <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${growth > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
            {growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(growth)}%
          </span>}
        {description && <span className="text-xs text-gray-400 font-medium">{description}</span>}
      </div>
    </div>;
};
const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [courses, setCourses] = useState(null);
  const [, setEnrollments] = useState(null);
  const [categories, setCategories] = useState(null);
  const [instructors, setInstructors] = useState(null);
  const [payments, setPayments] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [, setOffers] = useState(null);
  const [activity, setActivity] = useState(null);
  const [insights, setInsights] = useState(null);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [courseFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [instructorFilter] = useState("All");
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const baseUrl = "http://localhost:5000/api/admin/analytics";
      const [
        sumRes,
        userRes,
        revRes,
        courseRes,
        enrollRes,
        catRes,
        instRes,
        payRes,
        certRes,
        reviewRes,
        offerRes,
        actRes,
        insightRes
      ] = await Promise.all([
        axios.get(`${baseUrl}/summary`),
        axios.get(`${baseUrl}/users`),
        axios.get(`${baseUrl}/revenue`),
        axios.get(`${baseUrl}/courses`),
        axios.get(`${baseUrl}/enrollments`),
        axios.get(`${baseUrl}/categories`),
        axios.get(`${baseUrl}/instructors`),
        axios.get(`${baseUrl}/payments`),
        axios.get(`${baseUrl}/certificates`),
        axios.get(`${baseUrl}/reviews`),
        axios.get(`${baseUrl}/offers`),
        axios.get(`${baseUrl}/activity`),
        axios.get(`${baseUrl}/insights`)
      ]);
      setSummary(sumRes.data.data);
      setUsers(userRes.data.data);
      setRevenue(revRes.data.data);
      setCourses(courseRes.data.data);
      setEnrollments(enrollRes.data.data);
      setCategories(catRes.data.data);
      setInstructors(instRes.data.data);
      setPayments(payRes.data.data);
      setCertificates(certRes.data.data);
      setReviews(reviewRes.data.data);
      setOffers(offerRes.data.data);
      setActivity(actRes.data.data);
      setInsights(insightRes.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, [dateRange, courseFilter, categoryFilter, instructorFilter]);
  const handleExport = async (type) => {
    if (type === "pdf") {
      const element = document.getElementById("pdf-report-container");
      if (element) {
        element.style.display = "block";
        const opt = {
          margin: 15,
          filename: "pitech-analytics-report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        toast.promise(
          html2pdf().from(element).set(opt).save().then(() => {
            element.style.display = "none";
          }),
          {
            loading: "Generating PDF...",
            success: "PDF downloaded successfully!",
            error: "Failed to generate PDF"
          }
        );
      }
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/admin/analytics/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
    }
  };
  if (loading || !summary) {
    return <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-caption font-medium">Crunching the numbers...</p>
        </div>
      </div>;
  }
  return <div className="max-w-7xl mx-auto space-y-8 pb-12 print:max-w-none print:m-0 print:p-0">
      
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Analytics</h1>
          <p className="text-body mt-1">Track platform growth, revenue, learning performance, and business insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleExport("csv")} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-heading hover:bg-gray-50 transition-colors bg-white">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => handleExport("pdf")} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-heading hover:bg-gray-50 transition-colors bg-white">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={fetchAllData} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-secondary transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {
    /* Global Filters */
  }
      <div className="bg-white p-4 rounded-xl border border-border flex flex-wrap items-center gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-2 text-sm font-bold text-heading pr-4 border-r border-border">
          <Filter className="w-4 h-4" /> Filters
        </div>
        
        <CustomDropdown
    label="Date"
    value={dateRange}
    onChange={setDateRange}
    options={["Today", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "This Year"]}
  />
        
        <CustomDropdown
    label="Category"
    value={categoryFilter}
    onChange={setCategoryFilter}
    options={["All", "Web Development", "Data Science", "Design"]}
  />
      </div>

      {
    /* Section 1: KPI Summary */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        <KPICard title="Total Revenue" value={`$${(summary.totalRevenue.value / 1e3).toFixed(1)}k`} growth={summary.totalRevenue.growth} description="Gross revenue generated" icon={DollarSign} colorClass="bg-green-500 text-green-500" />
        <KPICard title="Total Students" value={summary.totalStudents.value.toLocaleString()} growth={summary.totalStudents.growth} description="Registered learners" icon={Users} colorClass="bg-blue-500 text-blue-500" />
        <KPICard title="Total Courses" value={summary.totalCourses.value.toLocaleString()} growth={summary.totalCourses.growth} description="Published courses" icon={BookOpen} colorClass="bg-purple-500 text-purple-500" />
        <KPICard title="Total Enrollments" value={summary.totalEnrollments.value.toLocaleString()} growth={summary.totalEnrollments.growth} description="Active enrollments" icon={CheckCircle} colorClass="bg-orange-500 text-orange-500" />
      </div>

      {
    /* Section 14: Insights */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        {insights.slice(0, 3).map((insight) => <div key={insight.id} className={`p-5 rounded-2xl border ${insight.type === "success" ? "bg-green-50 border-green-200" : insight.type === "warning" ? "bg-orange-50 border-orange-200" : insight.type === "danger" ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
            <div className="flex items-start gap-3">
              {insight.type === "success" ? <TrendingUp className="w-5 h-5 text-green-600 shrink-0" /> : insight.type === "danger" ? <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" /> : <Activity className="w-5 h-5 text-orange-600 shrink-0" />}
              <p className={`text-sm font-medium ${insight.type === "success" ? "text-green-800" : insight.type === "danger" ? "text-red-800" : "text-orange-800"}`}>{insight.message}</p>
            </div>
          </div>)}
      </div>

      {
    /* Sections 3 & 4: User Growth & Revenue */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
        <ChartCard title="Revenue Growth">
          <CustomVerticalBarChart data={revenue.revenueChart} xKey="name" yKey="revenue" />
        </ChartCard>
        
        <ChartCard title="User Growth">
          <CustomLineChart data={users.growthChart} xKey="name" yKey="students" color="#0ea5e9" />
        </ChartCard>
      </div>

      {
    /* Sections 5 & 7: Categories & Course Stats */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="lg:col-span-2">
          <ChartCard title="Top Categories by Revenue">
            <CustomHorizontalBarChart data={categories.performanceChart} xKey="name" yKey="value" color="#8b5cf6" />
          </ChartCard>
        </div>
        <div className="lg:col-span-1">
          <ChartCard title="Course Status Distribution">
            <CustomDonutChart data={courses.statusDistribution} nameKey="name" dataKey="value" />
          </ChartCard>
        </div>
      </div>

      {
    /* Section 8: Instructor Performance Table */
  }
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-heading">Top Instructor Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="p-4 text-xs font-bold text-caption uppercase tracking-wider">Instructor</th>
                <th className="p-4 text-xs font-bold text-caption uppercase tracking-wider">Courses</th>
                <th className="p-4 text-xs font-bold text-caption uppercase tracking-wider">Students</th>
                <th className="p-4 text-xs font-bold text-caption uppercase tracking-wider">Revenue</th>
                <th className="p-4 text-xs font-bold text-caption uppercase tracking-wider">Rating</th>
                <th className="p-4 text-xs font-bold text-caption uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {instructors.map((inst) => <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-heading">{inst.name}</td>
                  <td className="p-4 text-body">{inst.courses}</td>
                  <td className="p-4 text-body">{inst.students.toLocaleString()}</td>
                  <td className="p-4 text-green-600 font-bold">${inst.revenue.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">{inst.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inst.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {inst.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Sections 9, 10, 11: Payments, Certificates, Reviews */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:hidden">
        <ChartCard title="Payments Breakdown">
          <CustomDonutChart data={payments.statusDistribution} nameKey="name" dataKey="value" />
        </ChartCard>
        <ChartCard title="Certificate Issuance">
          <CustomDonutChart data={certificates.statusDistribution} nameKey="name" dataKey="value" />
        </ChartCard>
        <ChartCard title="Rating Distribution">
          <CustomHorizontalBarChart data={reviews.distribution} xKey="name" yKey="value" color="#f59e0b" />
        </ChartCard>
      </div>

      {
    /* Section 13: Recent Activity Timeline */
  }
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-heading">Recent Platform Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {activity.map((act) => <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-heading">{act.title}</h4>
                    <span className="text-xs text-caption font-medium">{act.time}</span>
                  </div>
                  <p className="text-sm text-body">{act.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* --- EXPORT ONLY PDF TABLES --- */
  }
      <div id="pdf-report-container" style={{ display: "none" }} className="font-sans bg-white p-8 w-[900px]">
        
        {
    /* Header / Company Details */
  }
        <div className="flex justify-between items-end border-b-4 border-primary pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white print:bg-primary print:text-white" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">PiTech LMS</h1>
            </div>
            <p className="text-gray-500 font-medium">123 Tech Avenue, Innovation District</p>
            <p className="text-gray-500 font-medium">admin@pitech.com | +1 (555) 123-4567</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-primary mb-1">ANALYTICS REPORT</h2>
            <p className="text-gray-600 font-semibold">
              Date: <span className="font-normal">{(/* @__PURE__ */ new Date()).toLocaleDateString()}</span>
            </p>
            <p className="text-gray-600 font-semibold">
              Time: <span className="font-normal">{(/* @__PURE__ */ new Date()).toLocaleTimeString()}</span>
            </p>
          </div>
        </div>

        {
    /* Introduction */
  }
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          This document contains the official performance analytics and summary statistics for the LMS platform. Data encompasses platform growth, revenue metrics, user engagement, and top-performing instructional content.
        </p>

        {
    /* Summary Table */
  }
        <div className="mb-12" style={{ pageBreakInside: "avoid" }}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-3">Executive Summary</h3>
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <th className="p-4 font-semibold w-1/3 border-b border-gray-800">Metric Focus</th>
                <th className="p-4 font-semibold text-right w-1/3 border-b border-gray-800">Current Value</th>
                <th className="p-4 font-semibold text-right w-1/3 border-b border-gray-800">Growth (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50">
              <tr>
                <td className="p-4 font-medium text-gray-800 border-r border-gray-200">Total Students</td>
                <td className="p-4 text-right text-gray-700 border-r border-gray-200">{summary.totalStudents.value.toLocaleString()}</td>
                <td className="p-4 text-right text-emerald-600 font-semibold">+{summary.totalStudents.growth}%</td>
              </tr>
              <tr className="bg-white">
                <td className="p-4 font-medium text-gray-800 border-r border-gray-200">Total Instructors</td>
                <td className="p-4 text-right text-gray-700 border-r border-gray-200">{summary.totalInstructors.value.toLocaleString()}</td>
                <td className="p-4 text-right text-emerald-600 font-semibold">+{summary.totalInstructors.growth}%</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-800 border-r border-gray-200">Total Courses</td>
                <td className="p-4 text-right text-gray-700 border-r border-gray-200">{summary.totalCourses.value.toLocaleString()}</td>
                <td className="p-4 text-right text-emerald-600 font-semibold">+{summary.totalCourses.growth}%</td>
              </tr>
              <tr className="bg-orange-50" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <td className="p-4 font-bold text-primary border-r border-gray-200">Gross Revenue</td>
                <td className="p-4 text-right text-gray-900 font-bold border-r border-gray-200">${summary.totalRevenue.value.toLocaleString()}</td>
                <td className="p-4 text-right text-emerald-600 font-bold">+{summary.totalRevenue.growth}%</td>
              </tr>
              <tr className="bg-white">
                <td className="p-4 font-medium text-gray-800 border-r border-gray-200">Total Enrollments</td>
                <td className="p-4 text-right text-gray-700 border-r border-gray-200">{summary.totalEnrollments.value.toLocaleString()}</td>
                <td className="p-4 text-right text-emerald-600 font-semibold">+{summary.totalEnrollments.growth}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {
    /* Instructors Table */
  }
        <div className="mb-12" style={{ pageBreakInside: "avoid" }}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-3">Top Performing Instructors</h3>
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <th className="p-4 font-semibold border-b border-gray-800">Instructor Name</th>
                <th className="p-4 font-semibold text-center border-b border-gray-800">Active Courses</th>
                <th className="p-4 font-semibold text-right border-b border-gray-800">Students</th>
                <th className="p-4 font-semibold text-right border-b border-gray-800">Revenue Generated</th>
                <th className="p-4 font-semibold text-center border-b border-gray-800">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50">
              {instructors.map((inst, i) => <tr key={inst.id} className={i % 2 === 0 ? "bg-white" : ""}>
                  <td className="p-4 font-medium text-gray-800 border-r border-gray-200">{inst.name}</td>
                  <td className="p-4 text-center text-gray-700 border-r border-gray-200">{inst.courses}</td>
                  <td className="p-4 text-right text-gray-700 border-r border-gray-200">{inst.students.toLocaleString()}</td>
                  <td className="p-4 text-right text-gray-900 font-semibold border-r border-gray-200">${inst.revenue.toLocaleString()}</td>
                  <td className="p-4 text-center text-orange-500 font-bold">{inst.rating} ★</td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Courses Table */
  }
        <div className="mb-12" style={{ pageBreakInside: "avoid" }}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-3">Top Selling Courses</h3>
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <th className="p-4 font-semibold border-b border-gray-800">Course Title</th>
                <th className="p-4 font-semibold text-right border-b border-gray-800">Total Enrollments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50">
              {courses.topCourses.map((course, idx) => <tr key={idx} className={idx % 2 === 0 ? "bg-white" : ""}>
                  <td className="p-4 font-medium text-gray-800 border-r border-gray-200">{course.name}</td>
                  <td className="p-4 text-right text-gray-700 font-semibold">{course.enrollments.toLocaleString()}</td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Footer */
  }
        <div className="mt-16 pt-6 border-t border-gray-300 text-center text-gray-500 text-sm" style={{ pageBreakInside: "avoid" }}>
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} PiTech LMS Platform. All rights reserved.</p>
          <p>Confidential and Proprietary. Do not distribute without authorization.</p>
        </div>
      </div>

    </div>;
};
var stdin_default = AdminAnalytics;
export {
  stdin_default as default
};
