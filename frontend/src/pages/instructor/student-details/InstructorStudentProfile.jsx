import { Phone, Mail, Calendar, Book, Activity, CheckCircle, BarChart, Award, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { instructorApi } from "../../../api/instructorApi";

const defaultSummary = {
  overall: 0,
  lessons: { completed: 0, total: 0 },
  quizzes: { completed: 0, total: 0 },
  assignments: { completed: 0, total: 0 },
  projects: { completed: 0, total: 0 }
};

const InstructorStudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getStudentDetails(studentId);
        if (isMounted) setStudent(response.data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudent();
    return () => {
      isMounted = false;
    };
  }, [studentId]);
  if (loading) {
    return <div className="flex py-16 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }

  if (!student) {
    return <div className="bg-white border border-border rounded-2xl p-8 text-center text-caption">Student not found.</div>;
  }

  const summary = student.summary || defaultSummary;
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
                {student.avatar}
              </div>
              <div>
                <div className="font-bold text-heading">{student.name}</div>
                <div className="text-sm text-caption flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {student.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-body">
              <Phone className="w-4 h-4 text-caption" /> {student.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-body">
              <Calendar className="w-4 h-4 text-caption" /> Joined on {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "Not available"}
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-heading font-bold text-heading mb-4">Current Enrollment</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-caption mb-1">Course Name</div>
              <div className="font-bold text-heading flex items-center gap-2">
                <Book className="w-4 h-4 text-primary" /> {student.courseName}
              </div>
            </div>
            <div>
              <div className="text-xs text-caption mb-1">Batch</div>
              <div className="text-sm font-medium text-body">{student.batch}</div>
            </div>
            <div>
              <div className="text-xs text-caption mb-1">Status</div>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                {student.status}
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
    { title: "Course Progress", value: `${summary.overall}%`, icon: <BarChart className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
    { title: "Lessons Done", value: `${summary.lessons.completed} / ${summary.lessons.total}`, icon: <CheckCircle className="w-5 h-5 text-blue-500" />, color: "bg-blue-50" },
    { title: "Quizzes Done", value: `${summary.quizzes.completed} / ${summary.quizzes.total}`, icon: <Activity className="w-5 h-5 text-green-500" />, color: "bg-green-50" },
    { title: "Assignments Done", value: `${summary.assignments.completed} / ${summary.assignments.total}`, icon: <FileText className="w-5 h-5 text-purple-500" />, color: "bg-purple-50" },
    { title: "Projects Done", value: `${summary.projects.completed} / ${summary.projects.total}`, icon: <Award className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-50" }
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
