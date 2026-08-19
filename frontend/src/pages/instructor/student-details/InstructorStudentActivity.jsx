import { CheckCircle, PlaySquare, Book, FileText, Award, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { instructorApi } from "../../../api/instructorApi";

const activityIconMap = {
  certificate: <Award className="w-4 h-4 text-yellow-500" />,
  course: <CheckCircle className="w-4 h-4 text-green-500" />,
  assignment: <FileText className="w-4 h-4 text-purple-500" />,
  project: <FileText className="w-4 h-4 text-purple-500" />,
  quiz: <CheckCircle className="w-4 h-4 text-orange-500" />,
  lesson: <PlaySquare className="w-4 h-4 text-blue-500" />,
  login: <LogIn className="w-4 h-4 text-gray-500" />,
  enrollment: <Book className="w-4 h-4 text-primary" />,
  review: <CheckCircle className="w-4 h-4 text-orange-500" />
};

const activityColorMap = {
  certificate: "bg-yellow-100 border-yellow-200",
  course: "bg-green-100 border-green-200",
  assignment: "bg-purple-100 border-purple-200",
  project: "bg-purple-100 border-purple-200",
  quiz: "bg-orange-100 border-orange-200",
  lesson: "bg-blue-100 border-blue-200",
  login: "bg-gray-100 border-gray-200",
  enrollment: "bg-primary/10 border-primary/20",
  review: "bg-orange-100 border-orange-200"
};

const InstructorStudentActivity = () => {
  const { studentId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    const fetchActivity = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getStudentActivity(studentId);
        if (isMounted) setActivities(Array.isArray(response.data) ? response.data : []);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActivity();
    return () => {
      isMounted = false;
    };
  }, [studentId]);
  if (loading) {
    return <div className="flex py-16 items-center justify-center bg-white border border-border rounded-2xl">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
      <h2 className="text-xl font-heading font-bold text-heading mb-8">Activity Timeline</h2>
      
      <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
        {activities.length > 0 ? activities.map((act) => <div key={act.id} className="relative pl-8">
            {
    /* Timeline Dot */
  }
            <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-sm ${activityColorMap[act.type] || activityColorMap.enrollment}`}>
              {activityIconMap[act.type] || activityIconMap.enrollment}
            </div>
            
            {
    /* Content */
  }
            <div className="bg-gray-50 border border-border rounded-xl p-4 hover:bg-white hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-heading">{act.title}</h3>
                  <div className="text-sm font-medium text-primary mt-1">{act.course}</div>
                  {act.details && <p className="text-sm text-body mt-2 bg-white p-2 rounded-lg border border-gray-100">
                      {act.details}
                    </p>}
                </div>
                <div className="text-xs font-bold text-caption shrink-0 bg-white px-2 py-1 rounded-md border border-gray-100">
                  {act.time}
                </div>
              </div>
            </div>
          </div>) : <div className="pl-8 text-sm text-caption">No activity yet.</div>}
      </div>
    </div>;
};
var stdin_default = InstructorStudentActivity;
export {
  stdin_default as default
};
