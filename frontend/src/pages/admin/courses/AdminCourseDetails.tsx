import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, User, List, BarChart2, Star, CreditCard, Clock, 
  CheckCircle, XCircle, Globe, EyeOff, Trash2, ArrowLeft,
  Mail, Phone, Award, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';



const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: string; title: string; description: string; confirmText: string; confirmColor: string } | null>(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const courseRes = await axios.get(`http://localhost:5000/api/admin/courses/${id}`);
      setCourse(courseRes.data.data);
    } catch (err) {
      toast.error('Failed to load course details');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'delete') {
      setConfirmAction({
        type: 'delete',
        title: 'Delete Course',
        description: 'Are you sure you want to permanently delete this course? This action cannot be undone and all associated data will be lost.',
        confirmText: 'Yes, Delete Course',
        confirmColor: 'bg-red-600 hover:bg-red-700 text-white'
      });
    } else if (action === 'approve') {
      setConfirmAction({
        type: 'approve',
        title: 'Approve Course',
        description: 'Are you sure you want to approve this course? It will become active and available for students to enroll.',
        confirmText: 'Yes, Approve Course',
        confirmColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      });
    } else if (action === 'publish') {
      setConfirmAction({
        type: 'publish',
        title: 'Publish Course',
        description: 'Are you sure you want to publish this course? It will be visible to all users.',
        confirmText: 'Yes, Publish',
        confirmColor: 'bg-blue-600 hover:bg-blue-700 text-white'
      });
    } else if (action === 'unpublish') {
      setConfirmAction({
        type: 'unpublish',
        title: 'Unpublish Course',
        description: 'Are you sure you want to unpublish this course? It will no longer be visible to students but will remain in the system.',
        confirmText: 'Yes, Unpublish',
        confirmColor: 'bg-orange-500 hover:bg-orange-600 text-white'
      });
    } else if (action === 'reject') {
      setIsRejectModalOpen(true);
    } else if (action === 'feature') {
      executeAction('feature');
    }
  };

  const executeAction = async (action: string) => {
    try {
      if (action === 'delete') {
        await axios.delete(`http://localhost:5000/api/admin/courses/${id}`);
        toast.success('Course deleted');
        navigate('/admin/courses');
      } else if (action === 'feature') {
        await axios.patch(`http://localhost:5000/api/admin/courses/${id}/featured`, { featured: !course.featured });
        toast.success(`Course ${course.featured ? 'removed from featured' : 'featured'} successfully`);
        fetchCourseDetails();
      } else if (['approve', 'publish', 'unpublish'].includes(action)) {
        const newStatus = action === 'approve' ? 'Approved' : 
                          action === 'publish' ? 'Published' : 'Unpublished';
        await axios.patch(`http://localhost:5000/api/admin/courses/${id}/status`, { status: newStatus });
        toast.success(`Course ${newStatus.toLowerCase()} successfully`);
        fetchCourseDetails();
      }
      setConfirmAction(null);
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/api/admin/courses/${id}/status`, { 
        status: 'Rejected',
        reason: rejectReason 
      });
      toast.success('Course rejected');
      setIsRejectModalOpen(false);
      fetchCourseDetails();
    } catch (err) {
      toast.error('Failed to reject course');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Published': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Pending Approval': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Approved': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-200';
      case 'Unpublished': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'instructor', label: 'Instructor', icon: User },
    { id: 'curriculum', label: 'Curriculum', icon: List },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'activity', label: 'Activity Log', icon: Clock }
  ];

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!course) return null;

  return (
    <div className="p-8 pb-24">
      <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-2 text-caption hover:text-heading font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      {/* Header Profile */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8 bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm items-start xl:items-center">
        <div className="w-full xl:w-48 h-48 xl:h-32 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0 relative">
          <img src={`https://picsum.photos/seed/${course.id}/400/300`} alt="Thumbnail" className="w-full h-full object-cover" />
          {course.featured && (
            <div className="absolute top-0 right-0 bg-yellow-400 px-3 py-1 rounded-bl-xl font-bold text-xs text-white flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(course.status)}`}>{course.status}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">{course.category}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-heading mb-2">{course.title}</h1>
          <p className="text-body mb-4">{course.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full xl:w-auto xl:ml-auto">
          {course.status === 'Pending Approval' && (
            <>
              <button onClick={() => handleActionClick('approve')} title="Approve Course" className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition-colors">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => handleActionClick('reject')} title="Reject Course" className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition-colors">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          )}

          {(course.status === 'Approved' || course.status === 'Unpublished') && (
            <button onClick={() => handleActionClick('publish')} title="Publish Course" className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-bold hover:bg-blue-100 transition-colors">
              <Globe className="w-4 h-4" /> Publish
            </button>
          )}

          {course.status === 'Published' && (
            <>
              <button onClick={() => handleActionClick('unpublish')} title="Unpublish Course" className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl font-bold hover:bg-orange-100 transition-colors">
                <EyeOff className="w-4 h-4" /> Unpublish
              </button>
              <button onClick={() => handleActionClick('feature')} title={course.featured ? 'Remove Feature' : 'Feature Course'} className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-xl font-bold hover:bg-yellow-100 transition-colors">
                <Star className={`w-4 h-4 ${course.featured ? 'fill-current' : ''}`} /> {course.featured ? 'Unfeature' : 'Feature'}
              </button>
            </>
          )}

          <button onClick={() => handleActionClick('delete')} title="Delete Course" className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-caption hover:text-heading hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-8 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h3 className="text-lg font-bold text-heading mb-4 border-b border-border pb-2">Description</h3>
              <p className="text-body leading-relaxed">{course.description}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Category</div>
                <div className="text-heading font-bold">{course.category}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Level</div>
                <div className="text-heading font-bold">{course.level}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Language</div>
                <div className="text-heading font-bold">{course.language}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Students</div>
                <div className="text-heading font-bold">{course.students.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Course Price</div>
                <div className="text-heading font-bold">₹{course.price}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Discount Price</div>
                <div className="text-emerald-600 font-bold">₹{course.discountPrice}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Created</div>
                <div className="text-heading font-bold">{new Date(course.createdDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-caption uppercase mb-1">Updated</div>
                <div className="text-heading font-bold">{new Date(course.updatedDate).toLocaleDateString()}</div>
              </div>
            </div>


          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="max-w-2xl flex flex-col md:flex-row gap-8">
             <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold flex-shrink-0">
               {course.instructor.name.charAt(0)}
             </div>
             <div className="space-y-4 flex-1">
               <div>
                 <h2 className="text-2xl font-bold text-heading">{course.instructor.name}</h2>
                 <p className="text-caption">Course Author</p>
               </div>
               
               <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-body font-medium">
                    <Mail className="w-5 h-5 text-caption" /> {course.instructor.email}
                  </div>
                  <div className="flex items-center gap-3 text-body font-medium">
                    <Phone className="w-5 h-5 text-caption" /> {course.instructor.phone}
                  </div>
                  <div className="flex items-center gap-3 text-body font-medium">
                    <Award className="w-5 h-5 text-caption" /> {course.instructor.qualification}
                  </div>
                  <div className="flex items-center gap-3 text-body font-medium">
                    <Briefcase className="w-5 h-5 text-caption" /> {course.instructor.experience} Experience
                  </div>
                  <div className="flex items-center gap-3 text-body font-medium">
                    <BookOpen className="w-5 h-5 text-caption" /> {course.instructor.coursesPublished} Courses Published
                  </div>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="max-w-4xl space-y-4">
             {course.curriculum.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-caption">
                       {idx + 1}
                     </div>
                     <div>
                       <div className="font-bold text-heading">{item.title}</div>
                       <div className="text-xs text-caption uppercase tracking-wider mt-1">{item.type}</div>
                     </div>
                   </div>
                   <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                     {item.items} Items
                   </div>
                </div>
             ))}
             <p className="text-caption text-sm mt-4 italic">* Admins have read-only access to curriculum structure.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                 <div className="text-3xl font-heading font-bold text-blue-600 mb-1">{course.students.toLocaleString()}</div>
                 <div className="text-sm font-bold text-blue-800/60 uppercase tracking-wider">Total Enrolled</div>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                 <div className="text-3xl font-heading font-bold text-emerald-600 mb-1">₹{course.analytics.revenue.toLocaleString()}</div>
                 <div className="text-sm font-bold text-emerald-800/60 uppercase tracking-wider">Total Revenue</div>
              </div>
              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                 <div className="text-3xl font-heading font-bold text-purple-600 mb-1">{course.rating}</div>
                 <div className="text-sm font-bold text-purple-800/60 uppercase tracking-wider">Average Rating</div>
              </div>
              <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100">
                 <div className="text-3xl font-heading font-bold text-orange-600 mb-1">{course.analytics.certificatesIssued.toLocaleString()}</div>
                 <div className="text-sm font-bold text-orange-800/60 uppercase tracking-wider">Certificates Issued</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border">
              <h4 className="font-bold text-heading mb-4">Course Completion Rate</h4>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${course.analytics.completionRate}%` }}></div>
                </div>
                <div className="font-bold text-primary">{course.analytics.completionRate}%</div>
              </div>
              <p className="text-sm text-caption">Percentage of students who have completed 100% of the course curriculum.</p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-4xl space-y-4">
             {course.reviews.length === 0 ? (
               <p className="text-caption">No reviews yet.</p>
             ) : (
               course.reviews.map((review: any) => (
                 <div key={review.id} className="p-6 rounded-2xl border border-border">
                    <div className="flex justify-between items-start mb-3">
                       <div className="font-bold text-heading">{review.studentName}</div>
                       <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                         <Star className="w-4 h-4 text-yellow-500 fill-current" />
                         <span className="font-bold text-yellow-700 text-sm">{review.rating}.0</span>
                       </div>
                    </div>
                    <p className="text-body mb-3">{review.review}</p>
                    <div className="text-xs text-caption">{new Date(review.date).toLocaleDateString()}</div>
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold text-heading mb-6 border-b border-border pb-2">Recent Transactions</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-caption uppercase tracking-wider text-xs">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 font-medium text-heading">TXN-{Math.floor(Math.random() * 1000000)}</td>
                    <td className="py-4 text-caption">{new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-heading">₹{course.price}</td>
                    <td className="py-4 text-right">
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">Success</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-2xl relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100"></div>
            <div className="space-y-8">
              {course.activityLog.map((log: any) => (
                 <div key={log.id} className="relative flex gap-6 pl-12">
                   <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                   </div>
                   <div>
                     <div className="font-bold text-heading text-lg mb-1">{log.action}</div>
                     <div className="text-sm text-caption font-medium">{new Date(log.date).toLocaleString()}</div>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-xl">
            <h2 className="text-2xl font-heading font-bold text-heading mb-2">Reject Course</h2>
            <p className="text-caption mb-6">Provide a reason for rejecting this course. This feedback will be sent to the instructor.</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-heading mb-2">Rejection Reason *</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-32"
                  placeholder="Explain what needs to be fixed..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-heading font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner 
              ${confirmAction.type === 'delete' ? 'bg-red-100 text-red-600' : 
                confirmAction.type === 'unpublish' ? 'bg-orange-100 text-orange-500' :
                'bg-emerald-100 text-emerald-600'}`}>
              {confirmAction.type === 'delete' && <Trash2 className="w-8 h-8" />}
              {confirmAction.type === 'unpublish' && <EyeOff className="w-8 h-8" />}
              {confirmAction.type === 'approve' && <CheckCircle className="w-8 h-8" />}
              {confirmAction.type === 'publish' && <Globe className="w-8 h-8" />}
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-heading mb-3">{confirmAction.title}</h2>
            <p className="text-body mb-8 leading-relaxed">{confirmAction.description}</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeAction(confirmAction.type)}
                className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all shadow-sm ${confirmAction.confirmColor}`}
              >
                {confirmAction.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDetails;
