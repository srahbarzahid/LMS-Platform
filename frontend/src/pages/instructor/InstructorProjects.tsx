import { useState, useRef } from 'react';
import { 
  PlaySquare, CheckSquare, Briefcase, 
  FileText,
  ChevronRight, ChevronDown, ListTree,
  ClipboardList, Save, 
  UploadCloud, Code, Image as ImageIcon,
  Eye, Trash2
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const mockCourseTree = [
  {
    id: 'm1',
    title: 'Introduction to the Course',
    lessons: [
      { id: 'i1', type: 'lesson', title: 'Welcome and Course Overview', status: 'Published' },
      { id: 'i3', type: 'quiz', title: 'Environment Check Quiz', status: 'Draft' },
    ]
  },
  {
    id: 'm2',
    title: 'Core Concepts & Fundamentals',
    lessons: [
      { id: 'i4', type: 'lesson', title: 'Understanding the Basics', status: 'Draft' },
      { id: 'i5', type: 'assignment', title: 'First Coding Exercise', status: 'Draft' },
      { id: 'i6', type: 'project', title: 'Mini Project: Todo App', status: 'Draft' },
    ]
  }
];

const InstructorProjects = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [selectedCourse] = useState('Select Course: UI/UX Masterclass');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ 'm1': true, 'm2': true });
  const [selectedItemId, setSelectedItemId] = useState<string>('i6');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [projectThumbnail, setProjectThumbnail] = useState<File | null>(null);
  const [briefContent, setBriefContent] = useState('In this project, you will build a full-stack Todo application using React and Node.js...');

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectThumbnail(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm sticky top-0 z-30 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Project Workspace</h1>
          <p className="text-sm text-caption mt-1">Select a project from the curriculum to edit its details.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
            <Save className="w-4 h-4" /> Save Project
          </button>
        </div>
      </div>

      <div className="flex items-start gap-8">
        {/* Left Sidebar - Sticky Module Tree */}
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
            {mockCourseTree.map((module, mIdx) => (
              <div key={module.id} className="space-y-1.5">
                <div 
                  className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg group transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  {expandedModules[module.id] ? 
                    <ChevronDown className="w-4 h-4 text-caption group-hover:text-heading transition-colors" /> : 
                    <ChevronRight className="w-4 h-4 text-caption group-hover:text-heading transition-colors" />
                  }
                  <h3 className="text-sm font-bold text-heading">Module {mIdx + 1}: {module.title}</h3>
                </div>
                
                {expandedModules[module.id] && (
                  <div className="pl-6 space-y-1 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-border">
                    {module.lessons.map(item => {
                      const isActive = selectedItemId === item.id;
                      const isProject = item.type === 'project';
                      
                      const getIcon = () => {
                        if (item.type === 'lesson') return <PlaySquare className="w-4 h-4 shrink-0 text-gray-400" />;
                        if (item.type === 'quiz') return <CheckSquare className="w-4 h-4 shrink-0 text-gray-400" />;
                        if (item.type === 'assignment') return <ClipboardList className="w-4 h-4 shrink-0 text-gray-400" />;
                        if (item.type === 'project') return <Briefcase className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-500' : 'text-caption'}`} />;
                        return <Briefcase className="w-4 h-4 shrink-0 text-gray-400" />;
                      };

                      return (
                        <div 
                          key={item.id}
                          onClick={() => { if(isProject) setSelectedItemId(item.id); }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative
                            ${isActive 
                              ? 'bg-purple-50 border border-purple-200 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-purple-500 before:rounded-full cursor-pointer' 
                              : isProject 
                                ? 'hover:bg-gray-50 border border-transparent cursor-pointer' 
                                : 'opacity-50 cursor-not-allowed border border-transparent'
                            }`}
                        >
                          {getIcon()}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm truncate ${isActive ? 'font-bold text-purple-600' : 'font-medium text-body'}`}>
                              {item.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor Area - Native Scrolling */}
        <div className="flex-1 max-w-4xl space-y-8 pb-10">
          
          {/* Context Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-caption bg-white border border-border px-4 py-3 rounded-xl shadow-sm">
            <ListTree className="w-4 h-4" />
            <span>UI/UX Masterclass</span>
            <ChevronRight className="w-3 h-3" />
            <span>Module 2</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-purple-600">Mini Project: Todo App</span>
          </div>

          {/* Project Info Section */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Project Details</h2>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-xs font-bold text-heading uppercase tracking-wider">Draft</span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-bold text-heading">Project Title</label>
                  <input 
                    type="text" 
                    defaultValue="Mini Project: Todo App"
                    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Maximum Points</label>
                  <input 
                    type="number" 
                    defaultValue="200"
                    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Estimated Duration</label>
                  <input 
                    type="text" 
                    defaultValue="1 Week"
                    placeholder="e.g. 2 Hours, 1 Week"
                    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-sm font-bold text-heading">Required Submission Format</label>
                <input 
                  type="text" 
                  defaultValue="GitHub Repo Link + Live URL"
                  placeholder="e.g. PDF, GitHub Repo, Zip File"
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-sm font-bold text-heading">Project Thumbnail</label>
                <div className="flex items-center gap-5">
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    className="w-40 h-24 bg-gray-50 border-2 border-border border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      ref={imageInputRef}
                      onChange={handleThumbnailSelect}
                    />
                    {projectThumbnail ? (
                      <span className="text-xs font-bold text-heading px-2 text-center truncate z-10 relative">{projectThumbnail.name}</span>
                    ) : (
                      <div className="flex flex-col items-center text-caption group-hover:text-primary transition-colors">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Upload Image</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-caption space-y-1">
                    <p className="font-medium text-heading">Enhance your project visually</p>
                    <p>Recommended size: 1280x720px</p>
                    <p>Formats: JPG, PNG, WebP (Max 2MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Brief */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="font-heading font-bold text-lg text-heading">Project Brief & Requirements</h2>
            </div>
            <div className="p-4 bg-white">
              <ReactQuill 
                theme="snow"
                value={briefContent} 
                onChange={setBriefContent} 
                className="h-80 mb-12"
              />
            </div>
          </div>

          {/* Starter Files Section */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center gap-3">
              <Code className="w-5 h-5 text-green-500" />
              <h2 className="font-heading font-bold text-lg text-heading">Starter Code & Assets</h2>
            </div>
            <div className="p-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-gray-50 hover:border-purple-500/50"
              >
                <input 
                  type="file" 
                  className="hidden" 
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-bold text-heading text-lg mb-1">Click to upload starter files</h3>
                <p className="text-caption">Provide initial templates, assets, or data for students to begin with.</p>
                <p className="text-caption text-sm mt-2 font-medium">ZIP, RAR, or individual files up to 100MB</p>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-heading">Attached Files ({attachedFiles.length})</h4>
                  <div className="space-y-2">
                    {attachedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-medium text-heading">{f.name}</span>
                        </div>
                        <span className="text-xs text-caption font-medium">{(f.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/30 rounded-2xl border border-red-200 shadow-sm overflow-hidden">
             <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-heading text-red-600 mb-1">Delete Project</h3>
                 <p className="text-sm text-red-800/70">Once you delete this project, there is no going back. All student submissions and associated data will be lost.</p>
               </div>
               <button className="flex shrink-0 items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:border-red-300 shadow-sm transition-colors cursor-pointer">
                 <Trash2 className="w-4 h-4" /> Delete Project
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InstructorProjects;
