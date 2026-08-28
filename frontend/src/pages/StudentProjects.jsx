import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Folder, CheckCircle2, Clock, Calendar, UploadCloud, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../api/studentApi";
import CustomSelect from "../components/common/CustomSelect";

const StudentProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await studentApi.getProjects();
        if (response.success && Array.isArray(response.data)) {
          setProjects(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch student projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      pending: projects.filter((p) => p.status === "Pending" || p.status === "Resubmission Required").length,
      submitted: projects.filter((p) => p.status === "Submitted" || p.status === "Under Review").length,
      graded: projects.filter((p) => p.status === "Graded").length
    };
  }, [projects]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Graded":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Submitted":
      case "Under Review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Resubmission Required":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">My Projects</h1>
          <p className="text-caption">View capstone project requirements, submit your work, and view feedback.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto min-w-[200px]">
          <CustomSelect
            options={[
              { value: "All", label: "All Statuses" },
              { value: "Pending", label: "Pending" },
              { value: "Submitted", label: "Submitted" },
              { value: "Graded", label: "Graded" },
              { value: "Resubmission Required", label: "Resubmission Required" }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-caption font-bold uppercase tracking-wider block mb-1">Total Projects</span>
          <span className="text-2xl font-bold text-heading">{stats.total}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-orange-600 font-bold uppercase tracking-wider block mb-1">Pending</span>
          <span className="text-2xl font-bold text-orange-600">{stats.pending}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-1">Submitted</span>
          <span className="text-2xl font-bold text-blue-600">{stats.submitted}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block mb-1">Graded</span>
          <span className="text-2xl font-bold text-emerald-600">{stats.graded}</span>
        </div>
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs font-semibold text-caption bg-gray-100 px-2.5 py-0.5 rounded-md">
                    {project.course}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-heading mb-1">{project.title}</h3>
                <p className="text-xs text-caption font-medium">Module: {project.module}</p>
              </div>

              {project.submission?.feedback && (
                <div className="bg-blue-50/70 border border-blue-200 text-blue-900 text-xs p-3 rounded-xl">
                  <strong>Feedback:</strong> {project.submission.feedback}
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-caption">
                <span>Max Marks: <strong>{project.maxMarks}</strong></span>
                {project.dueDate && <span>Due: <strong>{new Date(project.dueDate).toLocaleDateString()}</strong></span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-border text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-heading text-lg">No Projects Found</h3>
            <p className="text-caption text-sm max-w-sm mx-auto mt-1">
              You currently have no capstone projects assigned or matching your search.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProjects;
