import { CheckCircle, User, IndianRupee, UserCog, BookOpen, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityTimelineProps {
  activities: any[];
}

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  
  const getIcon = (iconString: string) => {
    switch (iconString) {
      case 'CheckCircle': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'User': return <User className="w-4 h-4 text-blue-500" />;
      case 'IndianRupee': return <IndianRupee className="w-4 h-4 text-green-500" />;
      case 'UserCog': return <UserCog className="w-4 h-4 text-purple-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-orange-500" />;
      case 'Tag': return <Tag className="w-4 h-4 text-rose-500" />;
      default: return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  const getIconBg = (iconString: string) => {
    switch (iconString) {
      case 'CheckCircle': return 'bg-emerald-100 border-emerald-200';
      case 'User': return 'bg-blue-100 border-blue-200';
      case 'IndianRupee': return 'bg-green-100 border-green-200';
      case 'UserCog': return 'bg-purple-100 border-purple-200';
      case 'BookOpen': return 'bg-orange-100 border-orange-200';
      case 'Tag': return 'bg-rose-100 border-rose-200';
      default: return 'bg-orange-100 border-orange-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-heading">Recent Activities</h2>
          <p className="text-sm text-caption">Platform event timeline</p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline">View All</button>
      </div>
      
      <div className="relative border-l-2 border-gray-100 ml-4 space-y-6 flex-grow">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-6 group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white ${getIconBg(activity.icon)} group-hover:scale-110 transition-transform`}>
              {getIcon(activity.icon)}
            </div>
            
            {/* Content */}
            <div className="bg-gray-50 p-4 rounded-xl border border-border group-hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-heading">{activity.title}</h4>
                <span className="text-xs font-medium text-caption">{activity.time}</span>
              </div>
              <p className="text-xs text-body mt-1">{activity.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
              
              <Link to="/admin/analytics" className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-primary hover:text-secondary transition-colors">
                Quick View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
