import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronLeft, Award, Save, AlertCircle } from 'lucide-react';
import CustomDropdown from '../../../components/common/CustomDropdown';

const AdminCourseCertificates = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, templatesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/courses?limit=100'),
        axios.get('http://localhost:5000/api/admin/certificate/templates')
      ]);
      setCourses(coursesRes.data.data);
      
      const templatesData = templatesRes.data.data.map((t: any) => ({
        value: t.id || t._id,
        label: t.name
      }));
      setTemplates([{ value: 'none', label: 'No Certificate' }, ...templatesData]);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load data', {
        style: { background: '#ef4444', color: '#fff' },
        iconTheme: { primary: '#fff', secondary: '#ef4444' }
      });
      setLoading(false);
    }
  };

  const handleAssign = (courseId: string, templateId: string) => {
    setAssignments(prev => ({ ...prev, [courseId]: templateId }));
  };

  const handleSave = async (courseId: string) => {
    const templateId = assignments[courseId];
    
    if (!templateId) {
      toast('Please select a template first', {
        icon: <AlertCircle className="w-5 h-5 text-white" />,
        style: { background: '#f97316', color: '#fff', fontWeight: 'bold' }, // Orange
      });
      return;
    }

    setIsSaving(prev => ({ ...prev, [courseId]: true }));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      toast.success('Assigned the certificate successfully', {
        style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }, // Green
        iconTheme: { primary: '#fff', secondary: '#10B981' }
      });
    } catch (err) {
      toast.error('Issue assigning certificate', {
        style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' }, // Red
        iconTheme: { primary: '#fff', secondary: '#ef4444' }
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [courseId]: false }));
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading courses...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/courses')}
            className="p-2 bg-white border border-border rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-heading" />
          </button>
          <div className="flex items-center gap-3 bg-white p-3 pr-6 rounded-2xl border border-border shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-heading">Assign Certificates</h1>
              <p className="text-sm text-body">Map certificate templates to specific courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-caption uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-caption uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-caption uppercase tracking-wider">Assign Template</th>
                <th className="px-6 py-4 text-xs font-bold text-caption uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((course) => (
                <tr key={course.id || course._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                         <img src={`https://picsum.photos/seed/${course.id || course._id}/100/80`} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-heading line-clamp-1">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-body">
                    {course.category?.name || 'General'}
                  </td>
                  <td className="px-6 py-4 w-[300px]">
                    <CustomDropdown
                      options={templates}
                      value={assignments[course.id || course._id] || ''}
                      onChange={(val) => handleAssign(course.id || course._id, val)}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSave(course.id || course._id)}
                      disabled={isSaving[course.id || course._id]}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                        isSaving[course.id || course._id] 
                          ? 'bg-primary/50 text-white cursor-not-allowed' 
                          : 'bg-primary hover:bg-primary/90 text-white'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving[course.id || course._id] ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-caption">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCertificates;
