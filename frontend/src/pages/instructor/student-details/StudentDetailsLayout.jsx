import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import { User, BarChart2, Folder, Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { instructorApi } from "../../../api/instructorApi";

const StudentDetailsLayout = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  useEffect(() => {
    let isMounted = true;

    const fetchStudent = async () => {
      try {
        const response = await instructorApi.getStudentDetails(studentId);
        if (isMounted) setStudent(response.data);
      } catch {
        if (isMounted) setStudent(null);
      }
    };

    fetchStudent();
    return () => {
      isMounted = false;
    };
  }, [studentId]);
  const tabs = [
    { name: "Details", path: `/instructor/students/${studentId}`, icon: <User className="w-4 h-4" />, exact: true },
    { name: "Progress", path: `/instructor/students/${studentId}/progress`, icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Submissions", path: `/instructor/students/${studentId}/submissions`, icon: <Folder className="w-4 h-4" /> },
    { name: "Activity", path: `/instructor/students/${studentId}/activity`, icon: <Clock className="w-4 h-4" /> }
  ];
  return <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {
    /* Back & Header */
  }
      <div className="flex items-center gap-4">
        <button
    onClick={() => navigate("/instructor/students")}
    className="p-2 bg-white border border-border rounded-xl text-caption hover:text-heading hover:bg-gray-50 transition-colors shadow-sm"
  >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {student ? <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {student.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-heading leading-tight">{student.name}</h1>
              <div className="text-sm text-caption">{student.email}</div>
            </div>
          </div> : <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg" />}
      </div>

      {
    /* Navigation Tabs */
  }
      <div className="bg-white border border-border rounded-xl shadow-sm p-1.5 flex flex-wrap gap-1">
        {tabs.map((tab, idx) => <NavLink
    key={idx}
    to={tab.path}
    end={tab.exact}
    className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? "bg-primary/10 text-primary" : "text-caption hover:bg-gray-50 hover:text-heading"}`}
  >
            {tab.icon} {tab.name}
          </NavLink>)}
      </div>

      {
    /* Content Area */
  }
      <div>
        <Outlet />
      </div>
    </div>;
};
var stdin_default = StudentDetailsLayout;
export {
  stdin_default as default
};
