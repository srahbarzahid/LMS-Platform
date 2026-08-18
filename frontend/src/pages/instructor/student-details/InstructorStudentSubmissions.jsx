import { useState } from "react";
import { Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
const InstructorStudentSubmissions = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const navigate = useNavigate();
  const mockAssignments = [
    { id: "1", title: "User Persona Creation", submittedDate: "2 days ago", status: "Graded", marks: "90/100", feedback: "Great detail on user pain points." },
    { id: "2", title: "Wireframing Basics", submittedDate: "1 day ago", status: "Pending Review", marks: "-", feedback: "-" }
  ];
  const mockProjects = [
    { id: "1", title: "Mobile App Redesign", submittedDate: "3 days ago", status: "Graded", marks: "85/100", feedback: "Good use of whitespace." }
  ];
  const mockQuizzes = [
    { id: "1", title: "UX Fundamentals", score: "18/20", attempts: 1, result: "Pass", date: "1 week ago" },
    { id: "2", title: "Color Theory", score: "12/20", attempts: 2, result: "Fail", date: "5 days ago" }
  ];
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
                {mockAssignments.map((a) => <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
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
                  </tr>)}
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
                {mockProjects.map((p) => <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
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
                  </tr>)}
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
                {mockQuizzes.map((q) => <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
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
                  </tr>)}
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
