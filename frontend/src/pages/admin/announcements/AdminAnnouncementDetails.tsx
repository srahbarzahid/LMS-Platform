import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Megaphone, Calendar, Clock, Edit, CheckCircle, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const AdminAnnouncementDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/admin/announcements/${id}`, { withCredentials: true });
      if (res.data.success) {
        setAnnouncement(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcement', error);
      toast.error('Failed to load announcement details');
      navigate('/admin/announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Published</span>;
      case 'Draft':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold flex items-center gap-1"><Edit className="w-4 h-4" /> Draft</span>;
      case 'Scheduled':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-1"><Calendar className="w-4 h-4" /> Scheduled</span>;
      case 'Expired':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Expired</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-semibold border border-red-100 uppercase tracking-wider">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded text-xs font-semibold border border-yellow-100 uppercase tracking-wider">Medium Priority</span>;
      case 'Low':
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-semibold border border-gray-200 uppercase tracking-wider">Low Priority</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-body">Loading announcement...</div>;
  }

  if (!announcement) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/announcements')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-body"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-heading">Announcement Details</h1>
            <p className="text-body mt-1">View announcement configuration and content.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/admin/announcements/${id}/edit`)}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Banner Placeholder if it had one */}
        <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-border flex items-center justify-center">
          <Megaphone className="w-12 h-12 text-blue-200" />
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Title & Badges */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary uppercase tracking-wider">{announcement.type}</span>
                {getPriorityBadge(announcement.priority)}
              </div>
              <h2 className="text-3xl font-black text-heading">{announcement.title}</h2>
            </div>
            <div>
              {getStatusBadge(announcement.status)}
            </div>
          </div>

          {/* Config Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-border">
            <div>
              <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Target Audience</p>
              <p className="text-heading font-medium">{announcement.audience}</p>
              {announcement.targetId && (
                <p className="text-sm text-body mt-0.5">Target ID: {announcement.targetId}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Publish Option</p>
              <p className="text-heading font-medium">{announcement.publishOption}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Publish Date</p>
              <div className="flex items-center gap-2 text-heading font-medium">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {formatDate(announcement.publishDate)}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-caption uppercase tracking-wider mb-1">Expiry Date</p>
              <div className="flex items-center gap-2 text-heading font-medium">
                <Clock className="w-4 h-4 text-orange-500" />
                {formatDate(announcement.expiryDate)}
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <h3 className="text-lg font-bold text-heading border-b border-border pb-2 mb-4">Message</h3>
            <div className="prose prose-sm md:prose-base max-w-none text-body whitespace-pre-wrap p-6 bg-gray-50 rounded-xl border border-border">
              {announcement.message}
            </div>
          </div>

          {/* Notifications config */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-bold text-caption uppercase tracking-wider mb-3">Notification Settings</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${announcement.sendDashboardNotification ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  {announcement.sendDashboardNotification && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium text-heading">Dashboard Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${announcement.sendEmailNotification ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  {announcement.sendEmailNotification && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium text-heading">Email Notifications</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementDetails;
