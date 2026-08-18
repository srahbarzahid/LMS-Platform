import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Download, UploadCloud, Link as LinkIcon, CheckCircle2, MessageSquare, Trash2, FileBadge, RefreshCcw } from "lucide-react";
const mockProjectData = {
  id: 1,
  title: "Build a Weather Station",
  course: "IoT Fundamentals",
  module: "Module 4",
  dueDate: "2026-07-20T23:59:59Z",
  maxMarks: 100,
  question: "In this project, you will build a complete IoT Weather Station using an ESP32 microcontroller, a DHT11 temperature/humidity sensor, and a BMP180 pressure sensor. You must log the data to a cloud MQTT broker (like HiveMQ or AWS IoT) and visualize it on a dashboard.",
  projectFile: { name: "Weather_Station_Requirements.pdf", size: "1.2 MB", type: "PDF", url: "#" },
  status: "Pending",
  allowResubmission: true,
  submission: {
    submittedOn: "2026-07-18T10:30:00Z",
    file: "weather_station_code.zip",
    link: "https://github.com/student/weather-station",
    note: "I used a DHT22 instead of DHT11 for better accuracy. Dashboard link is in the README.",
    marksObtained: null,
    feedback: null
  }
};
const StudentProjectDetails = () => {
  useParams();
  const [currentStatus, setCurrentStatus] = useState(mockProjectData.status);
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
    if (status === "Resubmission Required") return "bg-red-100 text-red-700 border-red-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };
  return <div className="space-y-8 pb-8 max-w-7xl mx-auto">
      
      {
    /* Header */
  }
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <Link to="/student/projects" className="inline-flex items-center gap-2 text-caption hover:text-primary transition-colors font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
              <span className="text-primary font-bold text-sm tracking-wider uppercase">
                {mockProjectData.course}
              </span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-heading mb-2">{mockProjectData.title}</h1>
            <p className="text-caption font-medium">{mockProjectData.module}</p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="bg-gray-50 rounded-2xl p-4 border border-border shrink-0 min-w-[140px]">
              <div className="text-caption mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Due Date</div>
              <div className="font-bold text-heading">{new Date(mockProjectData.dueDate).toLocaleDateString()}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-border shrink-0 min-w-[120px]">
              <div className="text-caption mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Max Marks</div>
              <div className="font-bold text-heading text-lg">{mockProjectData.maxMarks}</div>
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
            <h2 className="text-xl font-heading font-bold text-heading mb-4 flex items-center gap-2">
              <FileBadge className="w-5 h-5 text-primary" /> Project Instructions
            </h2>
            <p className="text-body text-[15px] leading-relaxed mb-8">{mockProjectData.question}</p>
            
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-orange-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900 mb-1">Project Requirements File</h3>
                  <p className="text-xs text-orange-700">{mockProjectData.projectFile.size} • {mockProjectData.projectFile.type}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 font-bold text-sm rounded-lg shadow-sm border border-orange-200 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>

        {
    /* Right Column: Submission Area */
  }
        <div className="lg:col-span-1 space-y-8">
          
          {
    /* Graded/Feedback Panel */
  }
          {(currentStatus === "Graded" || currentStatus === "Resubmission Required") && <div className={`rounded-3xl p-6 lg:p-8 text-white shadow-lg ${currentStatus === "Graded" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}>
              <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-2">
                {currentStatus === "Graded" ? <CheckCircle2 className="w-6 h-6" /> : <RefreshCcw className="w-6 h-6" />}
                {currentStatus === "Graded" ? "Grading Result" : "Resubmission Required"}
              </h2>
              
              <div className="bg-white/10 rounded-2xl p-6 text-center mb-6 backdrop-blur-sm border border-white/20">
                <div className="text-white/80 text-sm font-medium mb-1">Marks Obtained</div>
                <div className="text-5xl font-heading font-bold text-white">
                  {mockProjectData.submission.marksObtained || 0} <span className="text-2xl text-white/60">/ {mockProjectData.maxMarks}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Instructor Feedback</h3>
                <p className="text-white/90 text-sm leading-relaxed bg-black/10 p-4 rounded-xl">
                  {mockProjectData.submission.feedback || "Please fix the MQTT connection logic and submit again."}
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
                  Last updated: {new Date(mockProjectData.submission.submittedOn).toLocaleString()}
                </p>}
            </div>
            
            <div className="p-6 lg:p-8">
              
              {currentStatus === "Pending" || currentStatus === "Resubmission Required" ? <>
                  <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button onClick={() => setSubmissionMethod("FILE")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${submissionMethod === "FILE" ? "bg-white text-primary shadow-sm" : "text-caption hover:text-heading"}`}>
                      File
                    </button>
                    <button onClick={() => setSubmissionMethod("URL")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${submissionMethod === "URL" ? "bg-white text-primary shadow-sm" : "text-caption hover:text-heading"}`}>
                      Link
                    </button>
                    <button onClick={() => setSubmissionMethod("TEXT")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${submissionMethod === "TEXT" ? "bg-white text-primary shadow-sm" : "text-caption hover:text-heading"}`}>
                      Note
                    </button>
                  </div>

                  <div className="mb-6">
                    {submissionMethod === "FILE" && <div>
                        {uploadedFile ? <div className="border border-border rounded-xl p-4 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3 truncate">
                              <FileText className="w-5 h-5 text-primary shrink-0" />
                              <span className="text-sm font-medium text-heading truncate">{uploadedFile.name}</span>
                            </div>
                            <button onClick={() => setUploadedFile(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div> : <label className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm text-heading mb-1">Click to upload</span>
                            <span className="text-xs text-caption">ZIP, PDF, JPG, PNG (Max 50MB)</span>
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                          </label>}
                      </div>}
                    
                    {submissionMethod === "URL" && <div>
                        <div className="relative">
                          <LinkIcon className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
                          <input
    type="url"
    placeholder="GitHub, Drive, YouTube link"
    value={urlLink}
    onChange={(e) => setUrlLink(e.target.value)}
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
  />
                        </div>
                      </div>}

                    {submissionMethod === "TEXT" && <div>
                        <textarea
    rows={4}
    placeholder="Add a note to your instructor..."
    value={textSubmission}
    onChange={(e) => setTextSubmission(e.target.value)}
    className="w-full p-4 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors custom-scrollbar"
  />
                      </div>}
                  </div>

                  <button
    onClick={handleSubmit}
    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
  >
                    {currentStatus === "Resubmission Required" ? "Submit Again" : "Submit Project"}
                  </button>
                </> : (
    /* Already Submitted State */
    <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-heading mb-2">Project Submitted!</h3>
                  <p className="text-sm text-caption mb-6">Your work is successfully uploaded and awaiting review.</p>
                  
                  {mockProjectData.submission.file && <div className="inline-flex items-center gap-2 bg-gray-50 border border-border px-4 py-2 rounded-lg text-sm font-medium mb-2 w-full truncate">
                      <FileText className="w-4 h-4 text-caption shrink-0" />
                      <span className="truncate">{mockProjectData.submission.file}</span>
                    </div>}
                  {mockProjectData.submission.link && <div className="inline-flex items-center gap-2 bg-gray-50 border border-border px-4 py-2 rounded-lg text-sm font-medium w-full truncate">
                      <LinkIcon className="w-4 h-4 text-caption shrink-0" />
                      <a href={mockProjectData.submission.link} target="_blank" rel="noreferrer" className="truncate text-primary hover:underline">
                        {mockProjectData.submission.link}
                      </a>
                    </div>}
                </div>
  )}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = StudentProjectDetails;
export {
  stdin_default as default
};
