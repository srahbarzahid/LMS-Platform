import { useState, useEffect } from "react";
import { Bell, Search, Filter, Trash2, Check, BookOpen, ClipboardList, CheckSquare, Briefcase, Award, CreditCard, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { getAuthToken } from "../utils/auth";
const mockFrontendNotifications = [
  { id: "n1", title: "Assignment Graded", message: 'Your assignment "Build a Weather Station" has been graded. You received 95/100.', category: "Assignments", isRead: false, createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 2), relatedUrl: "/student/assignments" },
  { id: "n2", title: "New Course Available", message: 'A new course "Advanced Robotics" has just been published. Enroll now!', category: "Course Updates", isRead: true, createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 48), relatedUrl: "/student/my-courses" },
  { id: "n3", title: "Certificate Earned", message: "Congratulations! You have earned a certificate for IoT Fundamentals.", category: "Certificates", isRead: false, createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 5), relatedUrl: "/student/certificates" }
];
const getCategoryIcon = (category) => {
  switch (category) {
    case "Course Updates":
      return <BookOpen className="w-5 h-5" />;
    case "Assignments":
      return <ClipboardList className="w-5 h-5" />;
    case "Quizzes":
      return <CheckSquare className="w-5 h-5" />;
    case "Projects":
      return <Briefcase className="w-5 h-5" />;
    case "Certificates":
      return <Award className="w-5 h-5" />;
    case "Payments":
      return <CreditCard className="w-5 h-5" />;
    case "Platform Announcements":
      return <Megaphone className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};
const getCategoryColor = (category) => {
  switch (category) {
    case "Assignments":
      return "bg-orange-100 text-orange-600";
    case "Course Updates":
      return "bg-blue-100 text-blue-600";
    case "Certificates":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-primary/10 text-primary";
  }
};
const StudentNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockFrontendNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [readFilter, setReadFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      if (!getAuthToken()) {
        return;
      }

      try {
        const res = await apiClient.get("/student/announcements");
        const data = Array.isArray(res.data?.data) ? res.data.data : [];

        if (res.data?.success && data.length > 0 && isMounted) {
          const announcementNotifications = data.map((ann) => ({
            id: ann.announcementId,
            title: ann.title,
            message: ann.message,
            category: "Platform Announcements",
            isRead: false,
            createdAt: new Date(ann.publishDate),
            relatedUrl: "/student/dashboard"
          }));
          setNotifications((prev) => {
            const filteredPrev = prev.filter((n) => n.category !== "Platform Announcements");
            return [...announcementNotifications, ...filteredPrev];
          });
        }
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error("Failed to fetch announcements for notifications:", error);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);
  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };
  const handleDelete = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRead = readFilter === "All" || (readFilter === "Unread" ? !n.isRead : n.isRead);
    const matchesCategory = categoryFilter === "All" || n.category === categoryFilter;
    return matchesSearch && matchesRead && matchesCategory;
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return <div className="space-y-8 pb-8 max-w-7xl">
      
      {
    /* Header */
  }
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {unreadCount} New
              </span>}
          </h1>
          <p className="text-caption">Stay updated on your learning progress and platform news.</p>
        </div>
        <button
    onClick={handleMarkAllAsRead}
    className="px-5 py-2.5 bg-gray-50 text-heading font-bold border border-border rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
  >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      {
    /* Filters & Search */
  }
      <div className="bg-white rounded-3xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
    type="text"
    placeholder="Search notifications..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
  />
        </div>
        <div className="flex gap-4 shrink-0 overflow-x-auto">
          <div className="relative shrink-0">
            <Filter className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
            <select
    value={readFilter}
    onChange={(e) => setReadFilter(e.target.value)}
    className="pl-10 pr-8 py-3 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
  >
              <option value="All">All Status</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>
          <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors appearance-none cursor-pointer shrink-0"
  >
            <option value="All">All Categories</option>
            <option value="Course Updates">Course Updates</option>
            <option value="Assignments">Assignments</option>
            <option value="Quizzes">Quizzes</option>
            <option value="Projects">Projects</option>
            <option value="Certificates">Certificates</option>
            <option value="Payments">Payments</option>
            <option value="Platform Announcements">Platform Announcements</option>
          </select>
        </div>
      </div>

      {
    /* Notification List */
  }
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? <div className="bg-white rounded-3xl p-12 border border-border border-dashed text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-caption opacity-50" />
            </div>
            <h3 className="font-heading font-bold text-lg text-heading mb-2">You have no notifications yet.</h3>
            <p className="text-caption">We'll let you know when something important happens.</p>
          </div> : filteredNotifications.map((notification) => <div
    key={notification.id}
    onClick={() => navigate(notification.relatedUrl)}
    className={`group bg-white rounded-2xl p-5 border shadow-sm transition-all cursor-pointer flex gap-5 items-start ${notification.isRead ? "border-border" : "border-primary shadow-primary/5 bg-primary/[0.02]"}`}
  >
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(notification.category)}`}>
                {getCategoryIcon(notification.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-bold text-base truncate ${notification.isRead ? "text-heading" : "text-primary"}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                  </div>
                  <span className="text-xs font-medium text-caption shrink-0">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-body text-sm mb-3 line-clamp-2">{notification.message}</p>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-caption uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                    {notification.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.isRead && <button
    onClick={(e) => handleMarkAsRead(notification.id, e)}
    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
    title="Mark as Read"
  >
                    <Check className="w-4 h-4" />
                  </button>}
                <button
    onClick={(e) => handleDelete(notification.id, e)}
    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    title="Delete"
  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>)}
      </div>

    </div>;
};
var stdin_default = StudentNotifications;
export {
  stdin_default as default
};
