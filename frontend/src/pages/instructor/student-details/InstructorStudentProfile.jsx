import { Phone, Mail, Calendar, Book, Activity, CheckCircle, BarChart, Award, FileText } from "lucide-react";
const InstructorStudentProfile = () => {
  return <div className="space-y-6">
      
      {
    /* Profile & Enrollment Details */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-heading font-bold text-heading mb-4">Student Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                A
              </div>
              <div>
                <div className="font-bold text-heading">Alice Smith</div>
                <div className="text-sm text-caption flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> alice.smith@example.com
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-body">
              <Phone className="w-4 h-4 text-caption" /> +1 (555) 123-4567
            </div>
            <div className="flex items-center gap-2 text-sm text-body">
              <Calendar className="w-4 h-4 text-caption" /> Joined on March 15, 2026
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-heading font-bold text-heading mb-4">Current Enrollment</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-caption mb-1">Course Name</div>
              <div className="font-bold text-heading flex items-center gap-2">
                <Book className="w-4 h-4 text-primary" /> UI/UX Masterclass
              </div>
            </div>
            <div>
              <div className="text-xs text-caption mb-1">Batch</div>
              <div className="text-sm font-medium text-body">Spring 2026 Cohort</div>
            </div>
            <div>
              <div className="text-xs text-caption mb-1">Status</div>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Learning Summary Statistics */
  }
      <h2 className="text-lg font-heading font-bold text-heading">Learning Summary</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
    { title: "Course Progress", value: "85%", icon: <BarChart className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
    { title: "Lessons Done", value: "24 / 30", icon: <CheckCircle className="w-5 h-5 text-blue-500" />, color: "bg-blue-50" },
    { title: "Quizzes Done", value: "4 / 5", icon: <Activity className="w-5 h-5 text-green-500" />, color: "bg-green-50" },
    { title: "Assignments Done", value: "3 / 4", icon: <FileText className="w-5 h-5 text-purple-500" />, color: "bg-purple-50" },
    { title: "Projects Done", value: "1 / 2", icon: <Award className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-50" }
  ].map((stat, idx) => <div key={idx} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-xl font-heading font-bold text-heading">{stat.value}</div>
            <div className="text-xs text-caption mt-1">{stat.title}</div>
          </div>)}
      </div>

    </div>;
};
var stdin_default = InstructorStudentProfile;
export {
  stdin_default as default
};
