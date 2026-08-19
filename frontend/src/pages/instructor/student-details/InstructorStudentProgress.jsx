import { PlaySquare, CheckSquare, ClipboardList, Briefcase, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { instructorApi } from "../../../api/instructorApi";

const emptyProgress = {
  overall: 0,
  lessons: { completed: 0, total: 0, percentage: 0 },
  quizzes: { completed: 0, total: 0, percentage: 0 },
  assignments: { completed: 0, total: 0, percentage: 0 },
  projects: { completed: 0, total: 0, percentage: 0 }
};

const InstructorStudentProgress = () => {
  const { studentId } = useParams();
  const [progress, setProgress] = useState(emptyProgress);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getStudentProgress(studentId);
        if (isMounted) setProgress({ ...emptyProgress, ...(response.data || {}) });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgress();
    return () => {
      isMounted = false;
    };
  }, [studentId]);
  if (loading) {
    return <div className="flex py-16 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <div className="space-y-6">
      
      {
    /* Overall Progress Circular Card */
  }
      <div className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          {
    /* Circular Progress Mock */
  }
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
            <circle
    cx="96"
    cy="96"
    r="80"
    stroke="currentColor"
    strokeWidth="16"
    fill="transparent"
    strokeDasharray={502}
    strokeDashoffset={502 - 502 * progress.overall / 100}
    className="text-primary transition-all duration-1000"
    strokeLinecap="round"
  />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-heading font-bold text-heading">{progress.overall}%</span>
            <span className="text-xs text-caption mt-1">Overall Progress</span>
          </div>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-heading font-bold text-heading">{progress.overall >= 100 ? "Completed" : "In progress"}</h2>
          <p className="text-body text-sm">This progress is calculated from this student's enrollments in your courses.</p>
          <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <Award className="w-5 h-5" /> Eligible for Certificate upon completion
          </div>
        </div>
      </div>

      {
    /* Breakdowns */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <ProgressCard
    title="Lessons Progress"
    icon={<PlaySquare className="w-5 h-5 text-blue-500" />}
    color="bg-blue-50"
    percentage={progress.lessons.percentage}
    completed={progress.lessons.completed}
    total={progress.lessons.total}
    barColor="bg-blue-500"
  />

        <ProgressCard
    title="Quizzes Progress"
    icon={<CheckSquare className="w-5 h-5 text-green-500" />}
    color="bg-green-50"
    percentage={progress.quizzes.percentage}
    completed={progress.quizzes.completed}
    total={progress.quizzes.total}
    barColor="bg-green-500"
  />

        <ProgressCard
    title="Assignments Progress"
    icon={<ClipboardList className="w-5 h-5 text-purple-500" />}
    color="bg-purple-50"
    percentage={progress.assignments.percentage}
    completed={progress.assignments.completed}
    total={progress.assignments.total}
    barColor="bg-purple-500"
  />

        <ProgressCard
    title="Projects Progress"
    icon={<Briefcase className="w-5 h-5 text-yellow-500" />}
    color="bg-yellow-50"
    percentage={progress.projects.percentage}
    completed={progress.projects.completed}
    total={progress.projects.total}
    barColor="bg-yellow-500"
  />

      </div>
    </div>;
};
const ProgressCard = ({ title, icon, color, percentage, completed, total, barColor }) => <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <h3 className="font-bold text-heading">{title}</h3>
      </div>
      <div className="text-xl font-heading font-bold text-heading">{percentage}%</div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-caption font-bold">
        <span>Completed: {completed}</span>
        <span>Total: {total}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  </div>;
var stdin_default = InstructorStudentProgress;
export {
  stdin_default as default
};
