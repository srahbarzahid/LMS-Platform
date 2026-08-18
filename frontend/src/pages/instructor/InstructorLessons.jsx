import { useState, useRef } from "react";
import {
  PlaySquare,
  UploadCloud,
  CheckCircle,
  FileText,
  Settings2,
  ChevronRight,
  ChevronDown,
  ListTree,
  FileSignature,
  MonitorPlay,
  Save,
  Image as ImageIcon,
  Eye,
  Trash2
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const mockCourseTree = [
  {
    id: "m1",
    title: "Introduction to the Course",
    lessons: [
      { id: "l1", title: "Welcome and Course Overview", duration: "05:30", status: "Published" },
      { id: "l2", title: "Setting Up Your Environment", duration: "12:45", status: "Draft" }
    ]
  },
  {
    id: "m2",
    title: "Core Concepts & Fundamentals",
    lessons: [
      { id: "l3", title: "Understanding the Basics", duration: "18:20", status: "Draft" }
    ]
  }
];
const InstructorLessons = () => {
  const fileInputRef = useRef(null);
  const [selectedCourse] = useState("Select Course: UI/UX Masterclass");
  const [expandedModules, setExpandedModules] = useState({ "m1": true, "m2": true });
  const [selectedLessonId, setSelectedLessonId] = useState("l1");
  const [videoFile, setVideoFile] = useState(null);
  const [lessonContent, setLessonContent] = useState("In this lesson, we will cover the foundational concepts...");
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  const handleVideoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };
  return <div className="flex flex-col gap-6 pb-10">
      {
    /* Header */
  }
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm sticky top-0 z-30 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Lesson Workspace</h1>
          <p className="text-sm text-caption mt-1">Select a lesson from the curriculum to edit its content.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex items-start gap-8">
        {
    /* Left Sidebar - Sticky Module Tree */
  }
        <div className="w-80 bg-white border border-border rounded-2xl shadow-sm flex flex-col shrink-0 sticky top-0 max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="p-4 border-b border-border bg-gray-50">
            <div className="relative group/course">
              <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-heading shadow-sm cursor-pointer hover:bg-gray-50 transition-all w-full justify-between">
                <span className="truncate">{selectedCourse}</span>
                <ChevronDown className="w-4 h-4 text-caption shrink-0" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {mockCourseTree.map((module, mIdx) => <div key={module.id} className="space-y-1.5">
                <div
    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg group transition-colors"
    onClick={() => toggleModule(module.id)}
  >
                  {expandedModules[module.id] ? <ChevronDown className="w-4 h-4 text-caption group-hover:text-heading transition-colors" /> : <ChevronRight className="w-4 h-4 text-caption group-hover:text-heading transition-colors" />}
                  <h3 className="text-sm font-bold text-heading">Module {mIdx + 1}: {module.title}</h3>
                </div>
                
                {expandedModules[module.id] && <div className="pl-6 space-y-1 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-border">
                    {module.lessons.map((lesson) => {
    const isActive = selectedLessonId === lesson.id;
    return <div
      key={lesson.id}
      onClick={() => setSelectedLessonId(lesson.id)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative
                            ${isActive ? "bg-primary/10 border border-primary/20 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full" : "hover:bg-gray-50 border border-transparent"}`}
    >
                          <PlaySquare className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-caption"}`} />
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm truncate ${isActive ? "font-bold text-primary" : "font-medium text-body"}`}>
                              {lesson.title}
                            </div>
                          </div>
                        </div>;
  })}
                  </div>}
              </div>)}
          </div>
        </div>

        {
    /* Main Editor Area - Native Scrolling */
  }
        <div className="flex-1 max-w-4xl space-y-8">
          
          {
    /* Context Breadcrumb */
  }
          <div className="flex items-center gap-2 text-sm text-caption bg-white border border-border px-4 py-3 rounded-xl shadow-sm">
            <ListTree className="w-4 h-4" />
            <span>UI/UX Masterclass</span>
            <ChevronRight className="w-3 h-3" />
            <span>Module 1</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-primary">Welcome and Course Overview</span>
          </div>

          {
    /* Lesson Info Section */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSignature className="w-5 h-5 text-primary" />
                <h2 className="font-heading font-bold text-lg text-heading">Lesson Information</h2>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-heading uppercase tracking-wider">Published</span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-bold text-heading">Lesson Title</label>
                  <input
    type="text"
    defaultValue="Welcome and Course Overview"
    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Lesson Type</label>
                  <select className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                    <option value="video">Video Lesson</option>
                    <option value="text">Text / Article</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Estimated Duration</label>
                  <input
    type="text"
    defaultValue="05:30"
    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Short Description</label>
                <textarea
    rows={3}
    placeholder="Briefly describe what this lesson covers..."
    className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none custom-scrollbar"
  />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer flex-shrink-0 transition-colors has-[:checked]:bg-primary">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-sm font-medium text-heading">Free Preview (Allow non-enrolled students to watch)</span>
              </div>
            </div>
          </div>

          {
    /* Video Upload Section */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MonitorPlay className="w-5 h-5 text-blue-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Video Content</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-colors">
                  Upload
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-caption rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  URL Embed
                </button>
              </div>
            </div>
            <div className="p-6">
              <div
    onClick={() => fileInputRef.current?.click()}
    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                  ${videoFile ? "border-primary/50 bg-primary/5" : "border-border hover:bg-gray-50"}`}
  >
                <input
    type="file"
    className="hidden"
    accept="video/mp4,video/webm"
    ref={fileInputRef}
    onChange={handleVideoSelect}
  />
                {videoFile ? <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-heading text-lg mb-1">{videoFile.name}</h3>
                    <p className="text-caption text-sm mb-4">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB • MP4 Video</p>
                    <button className="px-4 py-2 bg-white border border-border shadow-sm text-sm font-bold text-heading rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      Change File
                    </button>
                  </> : <>
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-heading text-lg mb-1">Click to Upload Video</h3>
                    <p className="text-caption text-sm mb-4">Supported formats: MP4, WebM (Max 2GB)</p>
                    <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-secondary transition-colors cursor-pointer">
                      Browse Files
                    </button>
                  </>}
              </div>
              
              {
    /* Video Settings */
  }
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Video Thumbnail</label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-border">
                      <ImageIcon className="w-6 h-6 text-caption" />
                    </div>
                    <button className="px-3 py-1.5 text-xs font-bold text-primary border border-primary/30 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                      Upload Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
    /* Rich Text Lesson Content placeholder */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <h2 className="font-heading font-bold text-lg text-heading">Lesson Content</h2>
            </div>
            <div className="p-4 bg-white">
              <ReactQuill
    theme="snow"
    value={lessonContent}
    onChange={setLessonContent}
    className="h-64 mb-12"
  />
            </div>
          </div>

          {
    /* Additional Settings */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-green-500" />
              <h2 className="font-heading font-bold text-lg text-heading">Settings</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer flex-shrink-0 transition-colors has-[:checked]:bg-primary">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 peer-checked:translate-x-4 transition-transform" />
                </div>
                <div>
                  <span className="text-sm font-bold text-heading block">Require Sequential Progress</span>
                  <span className="text-xs text-caption">Student must complete previous lessons to unlock this.</span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Danger Zone */
  }
          <div className="bg-red-50/30 rounded-2xl border border-red-200 shadow-sm overflow-hidden mt-8">
             <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-heading text-red-600 mb-1">Delete Lesson</h3>
                 <p className="text-sm text-red-800/70">Once you delete this lesson, there is no going back.</p>
               </div>
               <button className="flex shrink-0 items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:border-red-300 shadow-sm transition-colors cursor-pointer">
                 <Trash2 className="w-4 h-4" /> Delete Lesson
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>;
};
var stdin_default = InstructorLessons;
export {
  stdin_default as default
};
