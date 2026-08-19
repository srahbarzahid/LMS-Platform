import { useEffect, useState } from "react";
import { Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { instructorApi } from "../../../api/instructorApi";

const InstructorStudentSubmissions = () => {
  const { studentId } = useParams();
  const [activeTab, setActiveTab] = useState("assignments");
  const [submissions, setSubmissions] = useState({ assignments: [], projects: [], quizzes: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getStudentSubmissions(studentId);
        if (isMounted) setSubmissions({ assignments: [], projects: [], quizzes: [], ...(response.data || {}) });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubmissions();
    return () => {
      isMounted = false;
    };
  }, [studentId]);
  if (loading) {
    return <div className="flex py-16 items-center justify-center bg-white border border-border rounded-2xl">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden pb-6">
      
      {
    /* Tabs */
  }
      <div className="flex items-center gap-6 px-6 border-b border-border bg-gray-50/50">
        <button
    onClick={() => setActiveTab("assignments")}
    className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "assignments" ? "border-primary text-primary" : "border-transparent text-caption hover:text-heading"}`}
  >
          Assignments
        </button>
        <button
    onClick={() => setActiveTab("projects")}
    className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "projects" ? "border-primary text-primary" : "border-transparent text-caption hover:text-heading"}`}
  >
          Projects
        </button>
        <button
    onClick={() => setActiveTab("quizzes")}
    className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "quizzes" ? "border-primary text-primary" : "border-transparent text-caption hover:text-heading"}`}
  >
          Quiz Results
        </button>
      </div>

      {
    /* Content */
  }
      <div className="p-6">
        
        {activeTab === "assignments" && <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Assignment Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Submitted Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Marks</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.assignments.length > 0 ? submissions.assignments.map((a) => <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-heading text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> {a.title}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-body">{a.submittedDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${a.status === "Graded" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-heading">{a.marks}</td>
                    <td className="py-4 px-4 text-right">
                      <button
    onClick={() => navigate(`/instructor/submissions/assignments/${a.id}`)}
    className="text-xs font-bold text-primary hover:text-secondary px-3 py-1.5 bg-primary/10 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
  >
                        <Eye className="w-3.5 h-3.5" /> View Submission
                      </button>
                    </td>
                  </tr>) : <tr><td colSpan={5} className="py-8 text-center text-caption">No assignment submissions yet.</td></tr>}
              </tbody>
            </table>
          </div>}

        {activeTab === "projects" && <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Project Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Submitted Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Marks</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.projects.length > 0 ? submissions.projects.map((p) => <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-heading text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> {p.title}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-body">{p.submittedDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${p.status === "Graded" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-heading">{p.marks}</td>
                    <td className="py-4 px-4 text-right">
                      <button
    onClick={() => navigate(`/instructor/submissions/projects/${p.id}`)}
    className="text-xs font-bold text-primary hover:text-secondary px-3 py-1.5 bg-primary/10 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
  >
                        <Eye className="w-3.5 h-3.5" /> View Submission
                      </button>
                    </td>
                  </tr>) : <tr><td colSpan={5} className="py-8 text-center text-caption">No project submissions yet.</td></tr>}
              </tbody>
            </table>
          </div>}

        {activeTab === "quizzes" && <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Quiz Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Score</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Attempts</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Result</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase">Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-caption uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.quizzes.length > 0 ? submissions.quizzes.map((q) => <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-heading text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" /> {q.title}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-heading">{q.score}</td>
                    <td className="py-4 px-4 text-sm text-body">{q.attempts}</td>
                    <td className="py-4 px-4">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${q.result === "Pass" ? "text-green-600" : "text-red-600"}`}>
                        {q.result === "Pass" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} {q.result}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-body">{q.date}</td>
                    <td className="py-4 px-4 text-right">
                      <button
    onClick={() => navigate(`/instructor/quiz-results/${q.id}`)}
    className="text-xs font-bold text-primary hover:text-secondary px-3 py-1.5 bg-primary/10 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
  >
                        <Eye className="w-3.5 h-3.5" /> View Result
                      </button>
                    </td>
                  </tr>) : <tr><td colSpan={6} className="py-8 text-center text-caption">No quiz results yet.</td></tr>}
              </tbody>
            </table>
          </div>}

      </div>
    </div>;
};
var stdin_default = InstructorStudentSubmissions;
export {
  stdin_default as default
};
