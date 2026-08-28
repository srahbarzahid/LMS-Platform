import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Search,
  Filter,
  PlusCircle,
  Edit2,
  Trash2,
  Send,
  X,
  Users,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";

const InstructorAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("All Courses");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState("Select a course...");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getAnnouncements();
        if (isMounted) {
          setAnnouncements(Array.isArray(response.data) ? response.data : []);
          setCourses(Array.isArray(response.courses) ? response.courses : []);
          setError("");
        }
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err, "Failed to load announcements"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);
  const courseFilterOptions = ["All Courses", ...courses.map((course) => course.title)];
  const filteredAnnouncements = announcements.filter(
    (a) => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.course.toLowerCase().includes(searchTerm.toLowerCase()) || a.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = selectedCourseFilter === "All Courses" || a.course === selectedCourseFilter;
      return matchesSearch && matchesCourse;
    }
  );
  const resetModal = () => {
    setEditingAnnouncement(null);
    setModalCourse("Select a course...");
    setModalTitle("");
    setModalMessage("");
  };
  const openCreateModal = () => {
    resetModal();
    setShowAddModal(true);
  };
  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setModalTitle(announcement.title || "");
    setModalMessage(announcement.text || announcement.message || "");
    setModalCourse(announcement.course || "All Courses");
    setShowAddModal(true);
  };
  const selectedCourse = courses.find((course) => course.title === modalCourse);
  const handlePostAnnouncement = async () => {
    if (!modalTitle.trim() || !modalMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: modalTitle,
        message: modalMessage,
        courseId: !modalCourse || modalCourse === "Select a course..." || modalCourse === "All Courses" ? "all" : (selectedCourse?.id || "all")
      };
      const response = editingAnnouncement
        ? await instructorApi.updateAnnouncement(editingAnnouncement.announcementId || editingAnnouncement.id, payload)
        : await instructorApi.createAnnouncement(payload);

      setAnnouncements((prev) => editingAnnouncement
        ? prev.map((item) => ((item.announcementId || item.id) === (editingAnnouncement.announcementId || editingAnnouncement.id) ? response.data : item))
        : [response.data, ...prev]);
      toast.success(editingAnnouncement ? "Announcement updated" : "Announcement posted");
      setShowAddModal(false);
      resetModal();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save announcement"));
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteAnnouncement = async (announcement) => {
    const targetId = announcement.announcementId || announcement.id;
    try {
      await instructorApi.deleteAnnouncement(targetId);
      setAnnouncements((prev) => prev.filter((item) => (item.announcementId || item.id) !== targetId));
      toast.success("Announcement deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete announcement"));
    }
  };
  return <div className="max-w-6xl mx-auto space-y-6 pb-8">
      
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Announcements</h1>
          <p className="text-body mt-1">Communicate with your students across all courses.</p>
        </div>
        <button
    onClick={openCreateModal}
    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors shrink-0"
  >
          <PlusCircle className="w-5 h-5" />
          Create Announcement
        </button>
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
    type="text"
    placeholder="Search announcements..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
  />
          <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto relative">
          <div className="relative w-full md:w-auto">
            <button
    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
    className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-4 py-2.5 hover:bg-gray-100 transition-colors w-full md:w-48 justify-between"
  >
              <div className="flex items-center gap-2 text-sm font-medium text-heading">
                <Filter className="w-4 h-4 text-caption" />
                {selectedCourseFilter}
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {filterDropdownOpen && <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-full md:w-48 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {courseFilterOptions.map((opt) => <div
    key={opt}
    onClick={() => {
      setSelectedCourseFilter(opt);
      setFilterDropdownOpen(false);
    }}
    className={`px-4 py-3 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors ${selectedCourseFilter === opt ? "bg-orange-50 text-orange-500 font-bold" : "text-gray-600 font-medium"}`}
  >
                      {opt}
                    </div>)}
                </div>
              </>}
          </div>
        </div>
      </div>

      {
    /* Announcements List */
  }
      {error ? <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center text-red-600 font-bold">{error}</div> : loading ? <div className="flex py-20 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div> : <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? filteredAnnouncements.map((announcement) => <div key={announcement.id} className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-heading">{announcement.title}</h3>
                    <div className="text-xs text-caption flex items-center gap-2 mt-1">
                      {announcement.courseId && announcement.courseId !== "ALL" ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/instructor/courses/${announcement.courseId}/edit`)}
                          className="font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {announcement.course} <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="font-semibold text-primary">{announcement.course}</span>
                      )}
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(announcement)} title="Edit" className="p-2 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteAnnouncement(announcement)} title="Delete" className="p-2 text-caption hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button title="Resend Notification" className="p-2 text-caption hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-body leading-relaxed mt-3">{announcement.text}</p>
                
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs font-bold text-caption">
                  <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {announcement.audience}</div>
                  <div className="flex items-center gap-1">👁 {announcement.views} Views</div>
                </div>
              </div>
            </div>) : <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center text-caption">
              No announcements found.
            </div>}
        </div>}

      {
    /* Add Announcement Modal */
  }
      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-heading font-bold text-heading">{editingAnnouncement ? "Edit Announcement" : "Create Announcement"}</h2>
              <button onClick={() => {
    setShowAddModal(false);
    resetModal();
  }} className="p-2 text-caption hover:text-heading hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Announcement Title <span className="text-red-500">*</span></label>
                <input value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} type="text" placeholder="e.g. New module uploaded!" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-heading mb-2">Target Course <span className="text-red-500">*</span></label>
                <div className="relative">
                  <button
    onClick={() => setModalDropdownOpen(!modalDropdownOpen)}
    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-left flex justify-between items-center"
  >
                    <span className={modalCourse === "Select a course..." ? "text-gray-400" : "text-heading font-medium"}>{modalCourse}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {modalDropdownOpen && <>
                      <div className="fixed inset-0 z-40" onClick={() => setModalDropdownOpen(false)} />
                      <div className="absolute left-0 top-full mt-2 w-full bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                        {courseFilterOptions.map((opt) => <div
    key={opt}
    onClick={() => {
      setModalCourse(opt);
      setModalDropdownOpen(false);
    }}
    className={`px-4 py-3 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors ${modalCourse === opt ? "bg-orange-50 text-orange-500 font-bold" : "text-gray-600 font-medium"}`}
  >
                            {opt}
                          </div>)}
                      </div>
                    </>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-heading mb-2">Message <span className="text-red-500">*</span></label>
                {
    /* Mock Rich Text Editor */
  }
                <div className="border border-border rounded-xl overflow-hidden bg-white">
                  <div className="bg-gray-50 border-b border-border p-2 flex gap-2">
                    <button className="px-3 py-1 text-sm font-bold hover:bg-gray-200 rounded">B</button>
                    <button className="px-3 py-1 text-sm italic hover:bg-gray-200 rounded">I</button>
                    <button className="px-3 py-1 text-sm underline hover:bg-gray-200 rounded">U</button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">🔗</button>
                  </div>
                  <textarea
    rows={6}
    placeholder="Write your announcement here..."
    value={modalMessage}
    onChange={(e) => setModalMessage(e.target.value)}
    className="w-full px-4 py-3 outline-none resize-none text-sm"
  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20" defaultChecked />
                  <span className="text-sm font-bold text-heading">Send Email Notification</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-border p-6 flex justify-end gap-3 z-10">
              <button onClick={() => {
    setShowAddModal(false);
    resetModal();
  }} className="px-6 py-2.5 border border-border rounded-xl font-bold text-heading hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button disabled={saving} onClick={handlePostAnnouncement} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md disabled:opacity-60">
                <Send className="w-4 h-4" /> {saving ? "Saving..." : editingAnnouncement ? "Save Announcement" : "Post Announcement"}
              </button>
            </div>
          </div>
        </div>}

    </div>;
};
var stdin_default = InstructorAnnouncements;
export {
  stdin_default as default
};
