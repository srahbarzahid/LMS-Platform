import { CheckCircle, PlaySquare, Book, FileText, Award, LogIn } from 'lucide-react';

const InstructorStudentActivity = () => {
  const activities = [
    { id: 1, type: 'certificate', title: 'Certificate Generated', course: 'UI/UX Masterclass', time: '1 day ago', icon: <Award className="w-4 h-4 text-yellow-500" />, color: 'bg-yellow-100 border-yellow-200' },
    { id: 2, type: 'course', title: 'Course Completed', course: 'UI/UX Masterclass', time: '1 day ago', icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: 'bg-green-100 border-green-200' },
    { id: 3, type: 'assignment', title: 'Assignment Submitted', course: 'UI/UX Masterclass', details: 'User Persona Creation', time: '2 days ago', icon: <FileText className="w-4 h-4 text-purple-500" />, color: 'bg-purple-100 border-purple-200' },
    { id: 4, type: 'quiz', title: 'Quiz Attempted', course: 'UI/UX Masterclass', details: 'UX Fundamentals - Scored 90%', time: '3 days ago', icon: <CheckCircle className="w-4 h-4 text-orange-500" />, color: 'bg-orange-100 border-orange-200' },
    { id: 5, type: 'lesson', title: 'Lesson Completed', course: 'UI/UX Masterclass', details: 'Introduction to Wireframing', time: '4 days ago', icon: <PlaySquare className="w-4 h-4 text-blue-500" />, color: 'bg-blue-100 border-blue-200' },
    { id: 6, type: 'login', title: 'Last Login', course: 'Platform', time: '1 week ago', icon: <LogIn className="w-4 h-4 text-gray-500" />, color: 'bg-gray-100 border-gray-200' },
    { id: 7, type: 'enrollment', title: 'Course Enrolled', course: 'UI/UX Masterclass', time: 'March 15, 2026', icon: <Book className="w-4 h-4 text-primary" />, color: 'bg-primary/10 border-primary/20' },
  ];

  return (
    <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
      <h2 className="text-xl font-heading font-bold text-heading mb-8">Activity Timeline</h2>
      
      <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
        {activities.map((act) => (
          <div key={act.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-sm ${act.color}`}>
              {act.icon}
            </div>
            
            {/* Content */}
            <div className="bg-gray-50 border border-border rounded-xl p-4 hover:bg-white hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-heading">{act.title}</h3>
                  <div className="text-sm font-medium text-primary mt-1">{act.course}</div>
                  {act.details && (
                    <p className="text-sm text-body mt-2 bg-white p-2 rounded-lg border border-gray-100">
                      {act.details}
                    </p>
                  )}
                </div>
                <div className="text-xs font-bold text-caption shrink-0 bg-white px-2 py-1 rounded-md border border-gray-100">
                  {act.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorStudentActivity;
