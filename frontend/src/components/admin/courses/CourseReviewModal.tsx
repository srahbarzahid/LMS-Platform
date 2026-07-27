import { useState } from 'react';
import { X, CheckCircle, XCircle, PlayCircle, Clock, Users, BookOpen, User, Tag, Calendar, ChevronDown, ChevronUp, FileText, FileQuestion } from 'lucide-react';

interface CourseReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const CourseReviewModal = ({ isOpen, onClose, course, onApprove, onReject }: CourseReviewModalProps) => {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  if (!isOpen || !course) return null;

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(course.id, rejectReason);
    setRejectReason('');
    setIsRejecting(false);
  };

  const handleClose = () => {
    setIsRejecting(false);
    setRejectReason('');
    setExpandedModule(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-heading font-black text-heading">{course.title}</h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending Review
              </span>
            </div>
            <p className="text-body text-sm max-w-3xl">{course.subtitle}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-caption">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Course Details */}
            <div className="lg:col-span-2 space-y-8">
              
              <section>
                <h3 className="text-lg font-bold text-heading mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> About This Course
                </h3>
                <p className="text-body text-sm leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-heading mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Instructor Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-border flex gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-heading text-lg">{course.instructor.name}</h4>
                    <p className="text-sm text-caption mb-2">{course.instructor.qualification} • {course.instructor.experience} Experience</p>
                    <div className="flex gap-4 text-xs font-medium">
                      <span className="bg-white px-2 py-1 border border-border rounded-md text-body">
                        {course.instructor.email}
                      </span>
                      <span className="bg-white px-2 py-1 border border-border rounded-md text-body">
                        {course.instructor.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-heading mb-3 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-primary" /> Curriculum Preview
                </h3>
                <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {course.curriculum?.map((module: any, idx: number) => (
                    <div key={idx} className="bg-white">
                      <div 
                        className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${expandedModule === idx ? 'bg-primary text-white' : 'bg-gray-100 text-caption'}`}>
                            {idx + 1}
                          </div>
                          <span className={`font-bold text-sm transition-colors ${expandedModule === idx ? 'text-primary' : 'text-heading'}`}>
                            {module.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-caption px-2 py-1 bg-gray-100 rounded-md">
                            {module.items} {module.items === 1 ? 'Item' : 'Items'}
                          </span>
                          <div className="text-caption">
                            {expandedModule === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                      
                      {expandedModule === idx && module.lessons && (
                        <div className="bg-gray-50/50 p-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
                          <div className="space-y-2 pl-11">
                            {module.lessons.map((lesson: any, lessonIdx: number) => (
                              <div key={lessonIdx} className="flex justify-between items-center p-3 bg-white border border-border rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? (
                                    <PlayCircle className="w-4 h-4 text-primary" />
                                  ) : lesson.type === 'quiz' ? (
                                    <FileQuestion className="w-4 h-4 text-amber-500" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                  )}
                                  <span className="text-sm font-medium text-heading">{lesson.title}</span>
                                </div>
                                <span className="text-xs font-semibold text-caption bg-gray-100 px-2 py-1 rounded">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column: Metadata & Actions */}
            <div className="space-y-6">
              
              <div className="bg-gray-50 rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-heading mb-4 border-b border-border pb-3">Course Information</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-caption flex items-center gap-2"><Tag className="w-4 h-4" /> Category</span>
                    <span className="font-bold text-sm text-heading">{course.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-caption flex items-center gap-2"><BookOpen className="w-4 h-4" /> Level</span>
                    <span className="font-bold text-sm text-heading">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-caption flex items-center gap-2"><Users className="w-4 h-4" /> Language</span>
                    <span className="font-bold text-sm text-heading">{course.language}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-caption flex items-center gap-2"><Calendar className="w-4 h-4" /> Submitted On</span>
                    <span className="font-bold text-sm text-heading">{new Date(course.updatedDate || course.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-caption uppercase">Proposed Price</span>
                    <div className="text-2xl font-black text-primary">₹{course.price}</div>
                  </div>
                </div>
              </div>

              {isRejecting ? (
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Reject Course
                  </h4>
                  <p className="text-xs text-red-600 mb-3">Please provide a reason for rejection. This will be sent to the instructor.</p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="E.g., Incomplete syllabus, audio quality issues..."
                    className="w-full p-3 rounded-xl border border-red-200 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-white mb-3"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                      Confirm Rejection
                    </button>
                    <button onClick={() => setIsRejecting(false)} className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onApprove(course.id)} className="col-span-2 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                    <CheckCircle className="w-5 h-5" /> Approve Course
                  </button>
                  <button onClick={() => setIsRejecting(true)} className="col-span-2 flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-600 py-3.5 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm">
                    <XCircle className="w-5 h-5" /> Reject Course
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
