import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Download, UploadCloud, Link as LinkIcon, CheckCircle2, MessageSquare, AlertCircle, Trash2 } from "lucide-react";
const mockAssignmentData = {
  id: 1,
  title: "Design a Robot Arm (CAD)",
  course: "Introduction to Robotics",
  module: "Module 4: Mechanical Design",
  dueDate: "2026-07-10T23:59:59Z",
  maxMarks: 100,
  description: "In this assignment, you will apply the kinematics principles learned in Module 3 to design a 3-DOF (Degree of Freedom) robotic arm using any CAD software of your choice (Fusion 360, SolidWorks, or FreeCAD).",
  objectives: [
    "Understand mechanical linkages and joints.",
    "Apply inverse kinematics to determine reachability.",
    "Create a 3D printable model of the base and links."
  ],
  instructions: "Please submit a single ZIP file containing the STEP files for all parts, as well as a short PDF report detailing your design choices and workspace calculations.",
  resources: [
    { id: 1, name: "Assignment_Guidelines.pdf", size: "2.4 MB", type: "PDF" },
    { id: 2, name: "Base_Mount_Template.step", size: "850 KB", type: "CAD" }
  ],
  // Change status to test different views: 'Pending', 'Submitted', 'Graded'
  status: "Pending",
  // Submission details (if status is not Pending)
  submission: {
    submittedOn: "2026-07-08T14:30:00Z",
    file: "robot_arm_final_v2.zip",
    marksObtained: 92,
    feedback: "Excellent work on the base structure! The joints look solid. However, the end-effector might struggle with heavy payloads due to the leverage. Great documentation."
  }
};
const AssignmentDetails = () => {
  useParams();
  const [currentStatus, setCurrentStatus] = useState(mockAssignmentData.status);
  const [submissionMethod, setSubmissionMethod] = useState("FILE");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [urlLink, setUrlLink] = useState("");
  const [textSubmission, setTextSubmission] = useState("");
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  const handleSubmit = () => {
    if (submissionMethod === "FILE" && !uploadedFile || submissionMethod === "URL" && !urlLink || submissionMethod === "TEXT" && !textSubmission) {
      alert("Please provide your submission before clicking submit.");
      return;
    }
    setCurrentStatus("Submitted");
  };
  const getStatusColor = (status) => {
    if (status === "Graded") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Submitted" || status === "Under Review") return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Overdue") return "bg-red-100 text-red-700 border-red-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };
  return <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      
      {
    /* Header */
  }
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <Link to="/student/assignments" className="inline-flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Link>
        
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
              <span className="text-primary font-bold text-sm tracking-wider uppercase">
                {mockAssignmentData.course}
              </span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-heading mb-2">{mockAssignmentData.title}</h1>
            <p className="text-caption font-medium">{mockAssignmentData.module}</p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="bg-gray-50 rounded-2xl p-4 border border-border shrink-0 min-w-[140px]">
              <div className="text-caption mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Due Date</div>
              <div className="font-bold text-heading">{new Date(mockAssignmentData.dueDate).toLocaleDateString()}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-border shrink-0 min-w-[120px]">
              <div className="text-caption mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Max Marks</div>
              <div className="font-bold text-heading text-lg">{mockAssignmentData.maxMarks}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {
    /* Left Column: Details & Resources */
  }
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 lg:p-10 border border-border shadow-sm">
            <div className="mb-10">
              <h2 className="text-xl font-heading font-bold text-heading mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Assignment Description
              </h2>
              <p className="text-body text-[15px] leading-relaxed">{mockAssignmentData.description}</p>
            </div>
            
            <div className="mb-10">
              <h3 className="font-bold text-heading text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Learning Objectives
              </h3>
              <div className="bg-gray-50 rounded-2xl p-6 border border-border">
                <ul className="space-y-3">
                  {mockAssignmentData.objectives.map((obj, i) => <li key={i} className="flex items-start gap-3 text-[15px] text-body">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{obj}</span>
                    </li>)}
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 lg:p-8 text-orange-800 flex gap-4 items-start">
              <div className="bg-orange-100 p-2 rounded-xl shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 mb-1 text-lg">Important Instructions</h3>
                <p className="text-sm leading-relaxed">{mockAssignmentData.instructions}</p>
              </div>
            </div>
          </div>

          {mockAssignmentData.resources.length > 0 && <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
              <h2 className="text-xl font-heading font-bold text-heading mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Reference Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockAssignmentData.resources.map((res) => <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-caption" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-sm text-heading truncate">{res.name}</div>
                        <div className="text-xs text-caption">{res.size} • {res.type}</div>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-caption hover:bg-primary hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>)}
              </div>
            </div>}
        </div>

        {
    /* Right Column: Submission Area */
  }
        <div className="lg:col-span-1 space-y-8">
          
          {
    /* Graded Feedback (If Graded) */
  }
          {currentStatus === "Graded" && <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 lg:p-8 text-white shadow-lg">
              <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Grading Result
              </h2>
              
              <div className="bg-white/10 rounded-2xl p-6 text-center mb-6 backdrop-blur-sm border border-white/20">
                <div className="text-emerald-100 text-sm font-medium mb-1">Marks Obtained</div>
                <div className="text-5xl font-heading font-bold text-white">
                  {mockAssignmentData.submission.marksObtained} <span className="text-2xl text-emerald-200">/ {mockAssignmentData.maxMarks}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Instructor Feedback</h3>
                <p className="text-emerald-50 text-sm leading-relaxed bg-black/10 p-4 rounded-xl">
                  {mockAssignmentData.submission.feedback}
                </p>
              </div>
            </div>}

          {
    /* Submission Box */
  }
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-border bg-gray-50">
              <h2 className="text-xl font-heading font-bold text-heading">Your Submission</h2>
              {currentStatus !== "Pending" && <p className="text-xs text-caption mt-2">
                  Submitted on {new Date(mockAssignmentData.submission.submittedOn).toLocaleString()}
                </p>}
            </div>
            
            <div className="p-6 lg:p-8">
              
              {currentStatus === "Pending" ? <>
                  {
    /* Submission Method Toggle */
  }
                  <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
    onClick={() => setSubmissionMethod("FILE")}
    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${submissionMethod === "FILE" ? "bg-white text-primary shadow-sm" : "text-caption hover:text-heading"}`}
  >
                      File Upload
                    </button>
                    <button
    onClick={() => setSubmissionMethod("URL")}
    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${submissionMethod === "URL" ? "bg-white text-primary shadow-sm" : "text-caption hover:text-heading"}`}
  >
                      Web Link
                    </button>
                    <button
    onClick={() => setSubmissionMethod("TEXT")}
    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${submissionMethod === "TEXT" ? "bg-white text-primary shadow-sm" : "text-caption hover:text-heading"}`}
  >
                      Text
                    </button>
                  </div>

                  {
    /* Input Areas */
  }
                  <div className="mb-8">
                    {submissionMethod === "FILE" && <div>
                        {uploadedFile ? <div className="border border-border rounded-xl p-4 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3 truncate">
                              <FileText className="w-5 h-5 text-primary shrink-0" />
                              <span className="text-sm font-medium text-heading truncate">{uploadedFile.name}</span>
                            </div>
                            <button onClick={() => setUploadedFile(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div> : <label className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-heading mb-1">Click to upload or drag & drop</span>
                            <span className="text-xs text-caption">ZIP, PDF, DOCX, PPT, JPG (Max 50MB)</span>
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                          </label>}
                      </div>}
                    
                    {submissionMethod === "URL" && <div>
                        <label className="block text-sm font-bold text-heading mb-2">Project URL (GitHub, Drive, etc.)</label>
                        <div className="relative">
                          <LinkIcon className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
                          <input
    type="url"
    placeholder="https://"
    value={urlLink}
    onChange={(e) => setUrlLink(e.target.value)}
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
  />
                        </div>
                      </div>}

                    {submissionMethod === "TEXT" && <div>
                        <label className="block text-sm font-bold text-heading mb-2">Text Submission</label>
                        <textarea
    rows={6}
    placeholder="Type your answer or provide details here..."
    value={textSubmission}
    onChange={(e) => setTextSubmission(e.target.value)}
    className="w-full p-4 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors custom-scrollbar"
  />
                      </div>}
                  </div>

                  <button
    onClick={handleSubmit}
    className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
  >
                    Submit Assignment
                  </button>
                </> : (
    /* Already Submitted State */
    <div className="text-center py-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-heading mb-2">Submission Received</h3>
                  <div className="inline-flex items-center gap-2 bg-gray-50 border border-border px-4 py-2 rounded-lg text-sm font-medium mb-8">
                    {mockAssignmentData.submission.file}
                  </div>
                </div>
  )}
              
            </div>
          </div>

        </div>

      </div>
    </div>;
};
var stdin_default = AssignmentDetails;
export {
  stdin_default as default
};
