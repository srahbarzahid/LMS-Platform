import { useState, useEffect } from "react";
import {
  Megaphone,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  CheckCircle,
  Edit,
  Plus,
  AlertCircle,
  Clock
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../../components/common/CustomDropdown";
const AdminAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [summary, setSummary] = useState({
    totalAnnouncements: 0,
    publishedAnnouncements: 0,
    draftAnnouncements: 0,
    scheduledAnnouncements: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, audienceFilter, typeFilter]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [announcementsRes, summaryRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/announcements", { withCredentials: true }),
        axios.get("http://localhost:5000/api/admin/announcements/summary", { withCredentials: true })
      ]);
      if (announcementsRes.data.success) {
        setAnnouncements(announcementsRes.data.data);
      }
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements data", error);
      toast.error("Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  };
  const handleConfirmTogglePublish = async () => {
    if (!selectedAnnouncement) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/announcements/${selectedAnnouncement.announcementId}/publish`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAnnouncements(announcements.map(
          (a) => a.announcementId === selectedAnnouncement.announcementId ? { ...a, status: res.data.data.status } : a
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update announcement status");
    } finally {
      setShowPublishModal(false);
      setSelectedAnnouncement(null);
    }
  };
  const handleTogglePublish = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowPublishModal(true);
  };
  const handleDelete = async () => {
    if (!selectedAnnouncement) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/announcements/${selectedAnnouncement.announcementId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Announcement deleted permanently");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete announcement", error);
      toast.error("Failed to delete announcement");
    } finally {
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
    }
  };
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesAudience = audienceFilter === "All" || a.audience === audienceFilter;
    const matchesType = typeFilter === "All" || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesAudience && matchesType;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Published</span>;
      case "Draft":
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1"><Edit className="w-3 h-3" /> Draft</span>;
      case "Scheduled":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> Scheduled</span>;
      case "Expired":
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Expired</span>;
      default:
        return null;
    }
  };
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-semibold border border-red-100">High</span>;
      case "Medium":
        return <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded text-xs font-semibold border border-yellow-100">Medium</span>;
      case "Low":
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-semibold border border-gray-200">Low</span>;
      default:
        return null;
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Announcements</h1>
          <p className="text-body mt-1">Create and manage official platform announcements for students and instructors.</p>
        </div>
        <button
    onClick={() => navigate("/admin/announcements/create")}
    className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2"
  >
          <Plus className="w-5 h-5" />
          Create Announcement
        </button>
      </div>

      {
    /* Summary Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Total</p>
            <h3 className="text-2xl font-black text-heading">{summary.totalAnnouncements}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Published</p>
            <h3 className="text-2xl font-black text-heading">{summary.publishedAnnouncements}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center shrink-0">
            <Edit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Drafts</p>
            <h3 className="text-2xl font-black text-heading">{summary.draftAnnouncements}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Scheduled</p>
            <h3 className="text-2xl font-black text-heading">{summary.scheduledAnnouncements}</h3>
          </div>
        </div>
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-caption" />
          <input
    type="text"
    placeholder="Search title or message..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
  />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {
    /* Type Filter */
  }
          <CustomDropdown
    value={typeFilter}
    onChange={setTypeFilter}
    options={[
      { label: "All Types", value: "All" },
      { label: "General Announcement", value: "General Announcement" },
      { label: "Maintenance Notice", value: "Maintenance Notice" },
      { label: "New Course Launch", value: "New Course Launch" },
      { label: "Important Notice", value: "Important Notice" },
      { label: "Event Announcement", value: "Event Announcement" }
    ]}
    className="w-full sm:w-auto z-30"
  />

          {
    /* Audience Filter */
  }
          <CustomDropdown
    value={audienceFilter}
    onChange={setAudienceFilter}
    options={[
      { label: "All Audiences", value: "All" },
      { label: "All Users", value: "All Users" },
      { label: "All Students", value: "All Students" },
      { label: "All Instructors", value: "All Instructors" },
      { label: "Specific Course", value: "Specific Course Students" }
    ]}
    className="w-full sm:w-auto z-20"
  />

          {
    /* Status Filter */
  }
          <CustomDropdown
    value={statusFilter}
    onChange={setStatusFilter}
    options={[
      { label: "All Statuses", value: "All" },
      { label: "Published", value: "Published" },
      { label: "Draft", value: "Draft" },
      { label: "Scheduled", value: "Scheduled" },
      { label: "Expired", value: "Expired" }
    ]}
    className="w-full sm:w-auto z-10"
  />

        </div>
      </div>

      {
    /* Table */
  }
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Announcement</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Audience</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Timing</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-caption uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? <tr>
                  <td colSpan={5} className="py-8 text-center text-body">Loading announcements...</td>
                </tr> : currentItems.length === 0 ? <tr>
                  <td colSpan={5} className="py-8 text-center text-body">
                    No announcements found matching your criteria.
                  </td>
                </tr> : currentItems.map((announcement) => <tr key={announcement.announcementId} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-heading line-clamp-1">{announcement.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-body">{announcement.type}</span>
                          {getPriorityBadge(announcement.priority)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <span className="text-sm font-medium text-heading">{announcement.audience}</span>
                      {announcement.targetId && <span className="block text-xs text-body mt-1">ID: {announcement.targetId}</span>}
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-heading flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          {formatDate(announcement.publishDate)}
                        </span>
                        {announcement.expiryDate && <span className="text-body flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            {formatDate(announcement.expiryDate)}
                          </span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      {getStatusBadge(announcement.status)}
                    </td>
                    <td className="py-4 px-6 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
    onClick={() => navigate(`/admin/announcements/${announcement.announcementId}`)}
    className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
    title="View Details"
  >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
    onClick={() => handleTogglePublish(announcement)}
    className={`p-1.5 rounded-lg transition-colors ${announcement.status === "Published" ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"}`}
    title={announcement.status === "Published" ? "Unpublish (Draft)" : "Publish Now"}
  >
                          {announcement.status === "Published" ? <EyeOff className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
                        </button>
                        <button
    onClick={() => {
      setSelectedAnnouncement(announcement);
      setShowDeleteModal(true);
    }}
    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    title="Delete Permanently"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Pagination Controls */
  }
        {totalPages > 1 && <div className="p-4 border-t border-border flex items-center justify-center gap-2 bg-white rounded-b-xl">
            <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-border text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
              {"<"}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => <button
    key={page}
    onClick={() => setCurrentPage(page)}
    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${currentPage === page ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white border border-border text-heading hover:bg-gray-50"}`}
  >
                {page}
              </button>)}
            
            <button
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-border text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
              {">"}
            </button>
          </div>}
      </div>

      {
    /* Delete Modal */
  }
      {showDeleteModal && selectedAnnouncement && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-heading">Delete Announcement?</h3>
              <p className="text-body text-sm">
                Are you sure you want to permanently delete "{selectedAnnouncement.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 pt-0 flex items-center justify-end gap-3">
              <button
    onClick={() => setShowDeleteModal(false)}
    className="px-5 py-2.5 font-bold text-body border border-border rounded-xl hover:bg-gray-50 transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleDelete}
    className="px-5 py-2.5 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
  >
                Delete Announcement
              </button>
            </div>
          </div>
        </div>}

      {
    /* Publish/Unpublish Modal */
  }
      {showPublishModal && selectedAnnouncement && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${selectedAnnouncement.status === "Published" ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"}`}>
                {selectedAnnouncement.status === "Published" ? <EyeOff className="w-8 h-8" /> : <Megaphone className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-black text-heading">
                {selectedAnnouncement.status === "Published" ? "Unpublish Announcement?" : "Publish Announcement?"}
              </h3>
              <p className="text-body text-sm">
                {selectedAnnouncement.status === "Published" ? `Are you sure you want to unpublish "${selectedAnnouncement.title}"? It will be removed from users' dashboards and sent back to Draft status.` : `Are you sure you want to publish "${selectedAnnouncement.title}"? It will immediately appear on dashboards for ${selectedAnnouncement.audience}.`}
              </p>
            </div>
            <div className="p-6 pt-0 flex items-center justify-end gap-3">
              <button
    onClick={() => setShowPublishModal(false)}
    className="px-5 py-2.5 font-bold text-body border border-border rounded-xl hover:bg-gray-50 transition-colors"
  >
                Cancel
              </button>
              <button
    onClick={handleConfirmTogglePublish}
    className={`px-5 py-2.5 font-bold text-white rounded-xl shadow-sm transition-colors ${selectedAnnouncement.status === "Published" ? "bg-orange-500 hover:bg-orange-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
  >
                {selectedAnnouncement.status === "Published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
var stdin_default = AdminAnnouncements;
export {
  stdin_default as default
};
