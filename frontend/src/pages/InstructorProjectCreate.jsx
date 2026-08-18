import { useState } from "react";
import { ArrowLeft, UploadCloud, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const InstructorProjectCreate = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Project published successfully!");
    navigate("/instructor/projects");
  };
  return <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <Link to="/instructor/projects" className="inline-flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <h1 className="text-3xl font-heading font-bold text-heading">Create New Project</h1>
        <p className="text-caption mt-2">Upload a project brief and assign it to a course module.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-heading">Project Title</label>
            <input required type="text" placeholder="e.g. Build a Weather Station" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-heading">Maximum Marks</label>
            <input required type="number" defaultValue={100} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-heading">Course Selection</label>
            <select required className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors appearance-none">
              <option value="">Select a Course</option>
              <option value="1">IoT Fundamentals</option>
              <option value="2">Advanced Robotics</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-heading">Module Selection</label>
            <select required className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors appearance-none">
              <option value="">Select a Module</option>
              <option value="1">Module 1: Introduction</option>
              <option value="4">Module 4: Practical Apps</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-heading">Project Instructions / Questions</label>
          <textarea required rows={4} placeholder="Describe the project requirements..." className="w-full p-4 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-heading">Upload Project File (PDF/Image)</label>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm mb-1">Drag and drop file here, or click to browse</p>
            <p className="text-xs text-caption mb-4">Supports PDF, JPG, PNG (Max 10MB)</p>
            <input type="file" className="hidden" id="project-file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <label htmlFor="project-file" className="px-6 py-2 bg-white border border-border text-sm font-bold rounded-lg cursor-pointer hover:border-primary transition-colors">
              {file ? file.name : "Browse Files"}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-heading">Due Date</label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input required type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-8">
            <input type="checkbox" id="resubmit" className="w-5 h-5 rounded border-border text-primary focus:ring-primary" defaultChecked />
            <label htmlFor="resubmit" className="text-sm font-bold text-heading cursor-pointer">Allow students to resubmit after feedback</label>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button type="button" onClick={() => navigate("/instructor/projects")} className="px-6 py-3 text-heading font-bold mr-4 hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-secondary transition-colors">
            Publish Project
          </button>
        </div>

      </form>
    </div>;
};
var stdin_default = InstructorProjectCreate;
export {
  stdin_default as default
};
