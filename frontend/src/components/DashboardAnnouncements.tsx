import { useState, useEffect } from 'react';
import { Megaphone, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

interface DashboardAnnouncementsProps {
  endpoint: string;
}

const DashboardAnnouncements = ({ endpoint }: DashboardAnnouncementsProps) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`http://localhost:5000${endpoint}`, { withCredentials: true });
        if (res.data.success && res.data.data.length > 0) {
          setAnnouncements(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [endpoint]);

  if (announcements.length === 0) return null;

  const topAnnouncement = announcements[0];
  const hasMore = announcements.length > 1;

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-50 text-orange-800 border-orange-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Medium': return <Megaphone className="w-5 h-5 text-orange-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">{topAnnouncement.type}</span>
              <span className="text-xs opacity-60">• {new Date(topAnnouncement.publishDate).toLocaleDateString()}</span>
            </div>
            <h3 className="font-bold text-base leading-tight mb-1">{topAnnouncement.title}</h3>
            <p className="text-sm opacity-90 line-clamp-2 sm:line-clamp-none">{topAnnouncement.message}</p>
          </div>
        </div>
        {hasMore && (
          <div className="shrink-0">
            {isExpanded ? <ChevronUp className="w-5 h-5 opacity-70" /> : <ChevronDown className="w-5 h-5 opacity-70" />}
          </div>
        )}
      </div>

      {hasMore && isExpanded && (
        <div className="border-t border-black/5 bg-black/5 divide-y divide-black/5">
          {announcements.slice(1).map((ann: any) => (
            <div key={ann.announcementId} className="p-4 flex items-start gap-4 pl-12">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">{ann.type}</span>
                  <span className="text-xs opacity-60">• {new Date(ann.publishDate).toLocaleDateString()}</span>
                  {ann.priority === 'High' && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">HIGH</span>}
                </div>
                <h4 className="font-bold text-sm mb-1">{ann.title}</h4>
                <p className="text-sm opacity-90">{ann.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAnnouncements;
