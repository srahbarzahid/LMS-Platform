import { useState, useMemo } from 'react';
import { Search, Filter, Folder, CheckCircle2, Clock, Calendar, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const mockProjects = [
  { id: 1, title: 'Build a Weather Station', course: 'IoT Fundamentals', module: 'Module 4', status: 'Pending', dueDate: '2026-07-20T23:59:59Z', maxMarks: 100 },
  { id: 2, title: 'Smart Home Automation', course: 'Advanced IoT', module: 'Module 2', status: 'Submitted', dueDate: '2026-07-15T23:59:59Z', maxMarks: 100 },
  { id: 3, title: 'Sensor Integration', course: 'IoT Fundamentals', module: 'Module 1', status: 'Graded', dueDate: '2026-06-30T23:59:59Z', maxMarks: 50 },
  { id: 4, title: 'MQTT Broker Setup', course: 'IoT Protocols', module: 'Module 3', status: 'Resubmission Required', dueDate: '2026-07-05T23:59:59Z', maxMarks: 50 },
];

const StudentProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: mockProjects.length,
      pending: mockProjects.filter(p => p.status === 'Pending' || p.status === 'Resubmission Required').length,
      submitted: mockProjects.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length,
      graded: mockProjects.filter(p => p.status === 'Graded').length,
    };
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Graded': return 'bg-emerald-100 text-emerald-700';
      case 'Submitted': 
      case 'Under Review': return 'bg-blue-100 text-blue-700';
      case 'Resubmission Required': return 'bg-red-100 text-red-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">My Projects</h1>
          <p className="text-caption">Download project tasks, submit your work, and view feedback.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: stats.total, icon: Folder, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Submitted', value: stats.submitted, icon: UploadCloud, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Graded', value: stats.graded, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-heading">{stat.value}</div>
              <div className="text-sm font-medium text-caption">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search projects by title or course..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0">
          <div className="relative shrink-0">
            <Filter className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border border-border rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Graded">Graded</option>
              <option value="Resubmission Required">Resubmission Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col group hover:shadow-md transition-all hover:border-primary/30">
            
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${getStatusStyle(project.status)}`}>
                {project.status}
              </span>
            </div>

            <h3 className="font-heading font-bold text-lg text-heading mb-1 line-clamp-2">{project.title}</h3>
            <p className="text-sm font-bold text-primary mb-1 truncate">{project.course}</p>
            <p className="text-xs text-caption font-medium mb-6 truncate">{project.module}</p>

            <div className="mt-auto space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-caption flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Due Date</span>
                <span className="font-bold text-heading">{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-caption flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Max Marks</span>
                <span className="font-bold text-heading">{project.maxMarks}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/student/project/${project.id}`)}
              className="w-full py-2.5 bg-gray-50 group-hover:bg-primary group-hover:text-white text-heading border border-border group-hover:border-primary rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {project.status === 'Pending' ? 'Open Project' : 'View Details'}
            </button>
          </div>
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-border border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-caption" />
            </div>
            <h3 className="font-heading font-bold text-lg text-heading mb-2">No projects found</h3>
            <p className="text-caption">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentProjects;
