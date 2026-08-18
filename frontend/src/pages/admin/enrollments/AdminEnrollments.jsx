import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookCheck, Activity, CheckCircle, Award, TrendingUp, Search, ChevronLeft, ChevronRight, Eye, User, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
const CustomDropdown = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);
  return <div className="relative">
      <button
    onClick={() => setIsOpen(!isOpen)}
    className="px-4 py-2.5 bg-white border border-border rounded-xl text-heading font-medium text-sm outline-none hover:border-primary focus:border-primary flex items-center justify-between min-w-[160px] gap-2 transition-colors cursor-pointer"
  >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-caption transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-lg shadow-gray-200/50 z-20 py-2 min-w-[160px] overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
            <button
    onClick={() => {
      onChange("");
      setIsOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === "" ? "bg-primary/5 text-primary font-bold" : "text-heading font-medium"}`}
  >
              {placeholder}
            </button>
            {options.map((option) => <button
    key={option.value}
    onClick={() => {
      onChange(option.value);
      setIsOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === option.value ? "bg-primary/5 text-primary font-bold" : "text-heading font-medium"}`}
  >
                {option.label}
              </button>)}
          </div>
        </>}
    </div>;
};
const AdminEnrollments = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    certStatus: ""
  });
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/admin/enrollments?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.certStatus) url += `&certStatus=${filters.certStatus}`;
      const res = await axios.get(url);
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnrollments();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, searchTerm, filters]);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const statCards = stats ? [
    { label: "Total Enrollments", value: stats.total, icon: BookCheck, color: "bg-blue-50 text-blue-600" },
    { label: "Active Learning", value: stats.active, icon: Activity, color: "bg-indigo-50 text-indigo-600" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Cert Eligible", value: stats.eligible, icon: Award, color: "bg-yellow-50 text-yellow-600" },
    { label: "New This Month", value: stats.newThisMonth, icon: TrendingUp, color: "bg-purple-50 text-purple-600" }
  ] : [];
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-1">Enrollments</h1>
          <p className="text-body text-sm">Track student enrollments, course progress, completion status, and certificate eligibility.</p>
        </div>
      </div>

      {
    /* Stats Cards */
  }
      {statCards.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat, idx) => {
    const Icon = stat.icon;
    return <div key={idx} className="bg-white p-4 rounded-xl border border-border flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color} shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-heading font-black text-heading leading-tight">{stat.value}</div>
                  <div className="text-xs font-bold text-caption uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>;
  })}
        </div>}

      {
    /* Table Section */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        {
    /* Toolbar */
  }
        <div className="p-6 border-b border-border bg-gray-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-caption" />
            <input
    type="text"
    placeholder="Search by student, email, course..."
    value={searchTerm}
    onChange={handleSearch}
    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
  />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <CustomDropdown
    value={filters.status}
    onChange={(val) => {
      setFilters({ ...filters, status: val });
      setPage(1);
    }}
    placeholder="All Statuses"
    options={[
      { value: "Active", label: "Active" },
      { value: "Completed", label: "Completed" },
      { value: "Inactive", label: "Inactive" },
      { value: "Cancelled", label: "Cancelled" }
    ]}
  />

            <CustomDropdown
    value={filters.certStatus}
    onChange={(val) => {
      setFilters({ ...filters, certStatus: val });
      setPage(1);
    }}
    placeholder="All Certificates"
    options={[
      { value: "Not Eligible", label: "Not Eligible" },
      { value: "Eligible", label: "Eligible" },
      { value: "Issued", label: "Issued" }
    ]}
  />
          </div>
        </div>

        {
    /* Table Content */
  }
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-caption uppercase tracking-wider border-b border-border bg-white">
                <th className="p-4 font-semibold whitespace-nowrap">Student</th>
                <th className="p-4 font-semibold whitespace-nowrap">Course</th>
                <th className="p-4 font-semibold whitespace-nowrap">Enrolled On</th>
                <th className="p-4 font-semibold whitespace-nowrap">Progress</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Certificate</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? <tr>
                  <td colSpan={7} className="p-8 text-center text-caption font-medium">Loading enrollments...</td>
                </tr> : data.length === 0 ? <tr>
                  <td colSpan={7} className="p-8 text-center text-caption font-medium">No enrollments found.</td>
                </tr> : data.map((row) => <tr key={row.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {row.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-heading">{row.studentName}</div>
                          <div className="text-xs text-caption">{row.studentEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-heading max-w-[200px] truncate" title={row.courseName}>{row.courseName}</div>
                        <div className="text-xs text-caption flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" /> {row.instructorName}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-caption font-medium">{new Date(row.enrollmentDate).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                          <div
    className={`h-full rounded-full ${row.progressPercentage === 100 ? "bg-emerald-500" : "bg-primary"}`}
    style={{ width: `${row.progressPercentage}%` }}
  />
                        </div>
                        <span className="text-xs font-bold text-heading w-8">{row.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.status === "Active" ? "bg-indigo-50 text-indigo-700" : row.status === "Completed" ? "bg-emerald-50 text-emerald-700" : row.status === "Cancelled" ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.certificateStatus === "Issued" ? "bg-emerald-50 text-emerald-700" : row.certificateStatus === "Eligible" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                        {row.certificateStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
    onClick={() => navigate(`/admin/enrollments/${row.id}`)}
    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-2"
    title="View Details"
  >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs font-bold">View</span>
                      </button>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Pagination */
  }
        <div className="p-6 border-t border-border flex justify-between items-center bg-gray-50/50">
          <div className="text-sm text-caption font-medium">
            Showing <span className="text-heading font-bold">{data.length}</span> of <span className="text-heading font-bold">{total}</span> Enrollments
          </div>
          <div className="flex gap-2">
            <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
  >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
    disabled={page >= totalPages}
    onClick={() => setPage(page + 1)}
    className="p-2 border border-border rounded-lg text-heading hover:bg-white disabled:opacity-50 transition-colors"
  >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = AdminEnrollments;
export {
  stdin_default as default
};
