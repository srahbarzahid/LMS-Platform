import { useState } from "react";
import { Search, Plus, Folder, Eye, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const mockInstructorProjects = [
  { id: 1, title: "Build a Weather Station", course: "IoT Fundamentals", module: "Module 4", dueDate: "2026-07-20T23:59:59Z", maxMarks: 100, submissions: 45, pendingReview: 12 },
  { id: 2, title: "Smart Home Automation", course: "Advanced IoT", module: "Module 2", dueDate: "2026-07-15T23:59:59Z", maxMarks: 100, submissions: 30, pendingReview: 0 }
];
const InstructorProjectsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  return <div className="space-y-8 pb-8">
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading mb-2">Manage Projects</h1>
          <p className="text-caption">Create course projects, manage tasks, and review student submissions.</p>
        </div>
        <button
    onClick={() => navigate("/instructor/projects/create")}
    className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-secondary transition-colors flex items-center gap-2 shrink-0"
  >
          <Plus className="w-5 h-5" /> Create Project
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
    type="text"
    placeholder="Search projects..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
  />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-caption text-sm border-b border-border">
                <th className="p-4 font-bold">Project Details</th>
                <th className="p-4 font-bold">Course & Module</th>
                <th className="p-4 font-bold">Due Date</th>
                <th className="p-4 font-bold">Submissions</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockInstructorProjects.map((project) => <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-bold text-heading text-sm">{project.title}</div>
                        <div className="text-xs text-caption">Max Marks: {project.maxMarks}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-heading text-sm">{project.course}</div>
                    <div className="text-xs text-caption">{project.module}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-heading">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold">{project.submissions} Total</span>
                      {project.pendingReview > 0 && <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full w-max">
                          {project.pendingReview} to review
                        </span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
    onClick={() => navigate(`/instructor/projects/${project.id}/submissions`)}
    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
    title="Review Submissions"
  >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-caption hover:text-heading hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
var stdin_default = InstructorProjectsManagement;
export {
  stdin_default as default
};
