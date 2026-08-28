import { useState, useEffect } from "react";
import { Megaphone, AlertCircle, Info, ChevronDown, ChevronUp, ExternalLink, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient, { normalizeApiPath } from "../api/client";
import { getAuthToken } from "../utils/auth";

const DashboardAnnouncements = ({ endpoint }) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      if (!endpoint || !getAuthToken()) {
        setAnnouncements([]);
        return;
      }

      try {
        const res = await apiClient.get(normalizeApiPath(endpoint));
        const data = Array.isArray(res.data?.data) ? res.data.data : [];

        if (isMounted) {
          setAnnouncements(res.data?.success && data.length > 0 ? data : []);
        }
      } catch (error) {
        if (error?.response?.status !== 401 && isMounted) {
          console.error("Failed to fetch announcements:", error);
        }
        if (isMounted) {
          setAnnouncements([]);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  if (announcements.length === 0) return null;
  const topAnnouncement = announcements[0];
  const hasMore = announcements.length > 1;

  const getTargetUrl = (ann) => {
    const courseId = ann.courseId || ann.targetId;
    if (!courseId || courseId === "ALL" || courseId === "all") return null;
    if (endpoint?.includes("/instructor")) {
      return `/instructor/courses/${courseId}/edit`;
    }
    return `/student/courses/${courseId}`;
  };

  const handleNavigateToCourse = (e, ann) => {
    e.stopPropagation();
    const url = getTargetUrl(ann);
    if (url) {
      navigate(url);
    }
  };

  const getPriorityColors = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-800 border-red-200";
      case "Medium":
        return "bg-orange-50 text-orange-800 border-orange-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const getIcon = (priority) => {
    switch (priority) {
      case "High":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "Medium":
        return <Megaphone className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const topTargetUrl = getTargetUrl(topAnnouncement);

  return (
    <div className={`mb-8 border rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${getPriorityColors(topAnnouncement.priority)}`}>
      <div
        className="p-4 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
        onClick={() => hasMore && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 sm:mt-0 shrink-0">
            {getIcon(topAnnouncement.priority)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">{topAnnouncement.type}</span>
              <span className="text-xs opacity-60">• {new Date(topAnnouncement.publishDate).toLocaleDateString()}</span>
              {topAnnouncement.course && topAnnouncement.course !== "All Courses" && (
                <span
                  onClick={(e) => handleNavigateToCourse(e, topAnnouncement)}
                  className="text-xs font-semibold bg-white/80 hover:bg-white text-heading px-2 py-0.5 rounded-full border border-black/10 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="View Target Course"
                >
                  <BookOpen className="w-3 h-3 text-primary" /> {topAnnouncement.course} <ExternalLink className="w-3 h-3 opacity-60" />
                </span>
              )}
            </div>
            <h3 className="font-bold text-base leading-tight mb-1">{topAnnouncement.title}</h3>
            <p className="text-sm opacity-90 line-clamp-2 sm:line-clamp-none">{topAnnouncement.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {topTargetUrl && (
            <button
              onClick={(e) => handleNavigateToCourse(e, topAnnouncement)}
              className="px-3 py-1.5 bg-primary text-white hover:bg-primary-hover font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              View Course <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          {hasMore && (
            <div>
              {isExpanded ? <ChevronUp className="w-5 h-5 opacity-70" /> : <ChevronDown className="w-5 h-5 opacity-70" />}
            </div>
          )}
        </div>
      </div>

      {hasMore && isExpanded && (
        <div className="border-t border-black/5 bg-black/5 divide-y divide-black/5">
          {announcements.slice(1).map((ann) => {
            const targetUrl = getTargetUrl(ann);
            return (
              <div key={ann.announcementId || ann.title} className="p-4 flex items-start justify-between gap-4 pl-12">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{ann.type}</span>
                    <span className="text-xs opacity-60">• {new Date(ann.publishDate).toLocaleDateString()}</span>
                    {ann.priority === "High" && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">HIGH</span>}
                    {ann.course && ann.course !== "All Courses" && (
                      <span
                        onClick={(e) => handleNavigateToCourse(e, ann)}
                        className="text-xs font-semibold bg-white/80 hover:bg-white text-heading px-2 py-0.5 rounded-full border border-black/10 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <BookOpen className="w-3 h-3 text-primary" /> {ann.course}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{ann.title}</h4>
                  <p className="text-sm opacity-90">{ann.message}</p>
                </div>
                {targetUrl && (
                  <button
                    onClick={(e) => handleNavigateToCourse(e, ann)}
                    className="px-3 py-1.5 bg-white text-heading hover:bg-gray-100 border border-border font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    View Course <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
var stdin_default = DashboardAnnouncements;
export {
  stdin_default as default
};
