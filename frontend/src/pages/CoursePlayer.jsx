import { useState, useRef } from "react";
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  Menu,
  User,
  FileText,
  Download,
  Star,
  StarHalf,
  MonitorPlay,
  ArrowLeft,
  ArrowRight,
  Award,
  FileCode,
  UploadCloud,
  Clock
} from "lucide-react";
const courseData = {
  title: "Mastering Embedded Systems & IoT",
  instructor: "Dr. Sarah Jenkins",
  lastUpdated: "August 2026",
  language: "English",
  difficulty: "Intermediate",
  certificate: true,
  totalLessons: 42,
  totalDuration: "18h 45m"
};
const initialCurriculum = [
  {
    id: 1,
    title: "Module 1: Getting Started",
    duration: "45m",
    lessons: [
      { id: 101, title: "Introduction to Embedded Systems", duration: "12:30", completed: true, locked: false, videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4" },
      { id: 102, title: "Setting up the IDE & Toolchain", duration: "18:45", completed: false, locked: false, videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4" },
      { id: 103, title: "Understanding Microcontrollers", duration: "14:15", completed: false, locked: true, videoUrl: "" }
    ]
  },
  {
    id: 2,
    title: "Module 2: GPIO and Interfacing",
    duration: "2h 15m",
    lessons: [
      { id: 201, title: "Digital Inputs & Outputs", duration: "22:00", completed: false, locked: true, videoUrl: "" },
      { id: 202, title: "Analog to Digital Conversion (ADC)", duration: "28:10", completed: false, locked: true, videoUrl: "" },
      { id: 203, title: "Pulse Width Modulation (PWM)", duration: "25:30", completed: false, locked: true, videoUrl: "" }
    ]
  },
  {
    id: 3,
    title: "Module 3: IoT Connectivity",
    duration: "3h 30m",
    lessons: [
      { id: 301, title: "Wi-Fi & Bluetooth Basics", duration: "35:00", completed: false, locked: true, videoUrl: "" },
      { id: 302, title: "Connecting to Cloud Platforms", duration: "42:15", completed: false, locked: true, videoUrl: "" }
    ]
  }
];
const CoursePlayer = () => {
  const videoRef = useRef(null);
  const [curriculum, setCurriculum] = useState(initialCurriculum);
  const [activeLessonId, setActiveLessonId] = useState(102);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModules, setExpandedModules] = useState([1]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const flatLessons = curriculum.flatMap((m) => m.lessons);
  const currentLessonIndex = flatLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = flatLessons[currentLessonIndex] || flatLessons[0];
  const completedCount = flatLessons.filter((l) => l.completed).length;
  const progressPercentage = Math.round(completedCount / courseData.totalLessons * 100);
  const toggleModule = (moduleId) => {
    setExpandedModules(
      (prev) => prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3e3);
  };
  const markAsComplete = () => {
    setCurriculum((prev) => {
      const newCurriculum = [...prev];
      for (const mod of newCurriculum) {
        const lesson = mod.lessons.find((l) => l.id === activeLessonId);
        if (lesson) {
          lesson.completed = true;
          break;
        }
      }
      if (currentLessonIndex < flatLessons.length - 1) {
        const nextLessonId = flatLessons[currentLessonIndex + 1].id;
        for (const mod of newCurriculum) {
          const nextLesson = mod.lessons.find((l) => l.id === nextLessonId);
          if (nextLesson) {
            nextLesson.locked = false;
            break;
          }
        }
      }
      return newCurriculum;
    });
    showToast("Lesson completed! \u{1F389}");
  };
  const playNext = () => {
    if (currentLessonIndex < flatLessons.length - 1) {
      const nextLesson = flatLessons[currentLessonIndex + 1];
      if (!nextLesson.locked) {
        setActiveLessonId(nextLesson.id);
      } else {
        showToast("Complete the current lesson to unlock the next one.");
      }
    }
  };
  const playPrev = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(flatLessons[currentLessonIndex - 1].id);
    }
  };
  const selectLesson = (lesson, moduleId) => {
    if (lesson.locked) {
      showToast("This lesson is locked.");
      return;
    }
    setActiveLessonId(lesson.id);
    if (!expandedModules.includes(moduleId)) {
      setExpandedModules([...expandedModules, moduleId]);
    }
    if (window.innerWidth < 1024) {
      setShowMobileSidebar(false);
    }
  };
  return <div className="h-full bg-[#f8f9fa] flex flex-col">
      {
    /* --- CUSTOM HEADER --- */
  }
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="font-heading font-bold text-heading truncate max-w-lg text-lg">
            {courseData.title}
          </h1>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-primary transition-colors">
            <Search className="w-4 h-4 text-caption mr-2" />
            <input type="text" placeholder="Search course..." className="bg-transparent text-sm outline-none w-48 text-body" />
          </div>
          <button className="text-body hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
            JD
          </div>
          <button
    className="lg:hidden text-body hover:text-primary"
    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
  >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {
    /* --- MAIN CONTENT GRID --- */
  }
      <div className="flex-1 overflow-hidden relative flex flex-col lg:flex-row">
        
        {
    /* LEFT COLUMN: Video & Tabs */
  }
        <div className="flex-1 overflow-y-auto w-full lg:w-[70%] custom-scrollbar pb-24 lg:pb-8">
          
          {
    /* Video Player Section */
  }
          <div className="bg-black w-full aspect-video relative group">
            {activeLesson.videoUrl ? <video
    ref={videoRef}
    src={activeLesson.videoUrl}
    className="w-full h-full object-contain outline-none"
    controls
    autoPlay
    controlsList="nodownload"
    poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200"
  /> : <div className="w-full h-full flex items-center justify-center text-white flex-col">
                <Lock className="w-12 h-12 mb-4 text-gray-500" />
                <p>Video Locked or Unavailable</p>
              </div>}
          </div>

          {
    /* Lesson Info Header & Controls */
  }
          <div className="bg-white border-b border-border p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-heading font-bold text-heading">{activeLesson.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-caption">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeLesson.duration}</span>
                  <span>Lesson {currentLessonIndex + 1} of {flatLessons.length}</span>
                </div>
              </div>

              {
    /* Navigation Controls */
  }
              <div className="flex items-center gap-3 self-start lg:self-center">
                <button
    onClick={playPrev}
    disabled={currentLessonIndex === 0}
    className="p-2 border border-border rounded-full text-heading hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                {!activeLesson.completed ? <button
    onClick={markAsComplete}
    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Complete
                  </button> : <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </div>}

                <button
    onClick={playNext}
    disabled={currentLessonIndex === flatLessons.length - 1}
    className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {
    /* Tabs Section */
  }
          <div className="p-4 lg:p-8">
            <div className="flex overflow-x-auto custom-scrollbar border-b border-border gap-8 mb-8 pb-2">
              {["overview", "resources", "assignments", "quiz", "reviews"].map((tab) => <button
    key={tab}
    onClick={() => setActiveTab(tab)}
    className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap pb-2 border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-caption hover:text-heading"}`}
  >
                  {tab}
                </button>)}
            </div>

            {
    /* Tab Content */
  }
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              {activeTab === "overview" && <div className="space-y-6 text-body">
                  <h3 className="text-lg font-heading font-bold text-heading">Course Description</h3>
                  <p>In this comprehensive course, you will learn the fundamentals and advanced techniques of building embedded systems. We will cover microcontrollers, sensors, real-time operating systems (RTOS), and IoT connectivity.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                    <div>
                      <div className="text-xs text-caption uppercase font-bold mb-1">Instructor</div>
                      <div className="font-medium text-heading flex items-center gap-2"><User className="w-4 h-4" /> {courseData.instructor}</div>
                    </div>
                    <div>
                      <div className="text-xs text-caption uppercase font-bold mb-1">Language</div>
                      <div className="font-medium text-heading">{courseData.language}</div>
                    </div>
                    <div>
                      <div className="text-xs text-caption uppercase font-bold mb-1">Difficulty</div>
                      <div className="font-medium text-heading">{courseData.difficulty}</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-heading font-bold text-heading mb-4">What you'll learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span>Program ARM Cortex-M microcontrollers</span></li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span>Interface with analog and digital sensors</span></li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span>Implement I2C, SPI, and UART communication</span></li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span>Connect devices to AWS IoT Core</span></li>
                    </ul>
                  </div>
                </div>}

              {activeTab === "resources" && <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-heading mb-4">Downloadable Resources</h3>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                      <div>
                        <div className="font-bold text-heading text-sm">Lesson 2 Slides</div>
                        <div className="text-xs text-caption">PDF • 2.4 MB</div>
                      </div>
                    </div>
                    <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"><Download className="w-5 h-5" /></button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><FileCode className="w-5 h-5" /></div>
                      <div>
                        <div className="font-bold text-heading text-sm">Setup Script</div>
                        <div className="text-xs text-caption">ZIP • 150 KB</div>
                      </div>
                    </div>
                    <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"><Download className="w-5 h-5" /></button>
                  </div>
                </div>}

              {activeTab === "assignments" && <div className="space-y-6">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-lg font-heading font-bold text-heading mb-2">Module 1 Assignment: Blinking LED</h3>
                       <p className="text-sm text-body">Write a basic script to toggle the GPIO pin connected to the onboard LED every 500ms.</p>
                     </div>
                     <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Due: Oct 12</span>
                   </div>
                   
                   <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center">
                     <UploadCloud className="w-10 h-10 text-caption mb-3" />
                     <div className="font-bold text-heading mb-1">Upload your submission</div>
                     <div className="text-xs text-caption mb-4">Supported files: .zip, .c, .cpp, .pdf</div>
                     <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-secondary transition-colors">Select File</button>
                   </div>
                </div>}

              {activeTab === "quiz" && <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-heading">Module 1 Quiz</h3>
                      <div className="text-sm text-caption">Test your knowledge on embedded systems basics.</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-border">
                    <div className="text-center"><div className="text-xs text-caption uppercase font-bold">Questions</div><div className="font-bold text-lg text-heading">10</div></div>
                    <div className="text-center"><div className="text-xs text-caption uppercase font-bold">Time Limit</div><div className="font-bold text-lg text-heading">15m</div></div>
                    <div className="text-center"><div className="text-xs text-caption uppercase font-bold">Total Marks</div><div className="font-bold text-lg text-heading">100</div></div>
                    <div className="text-center"><div className="text-xs text-caption uppercase font-bold">Attempts</div><div className="font-bold text-lg text-heading">0/3</div></div>
                  </div>
                  <button className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-colors">Start Quiz</button>
                </div>}

              {activeTab === "reviews" && <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 p-6 rounded-xl border border-border">
                    <div className="text-center">
                      <div className="text-5xl font-heading font-bold text-heading mb-2">4.8</div>
                      <div className="flex items-center text-orange-400 gap-1 mb-1 justify-center">
                        <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><StarHalf className="w-4 h-4 fill-current" />
                      </div>
                      <div className="text-xs text-caption">Based on 124 reviews</div>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => <div key={stars} className="flex items-center gap-3 text-sm">
                          <span className="w-3">{stars}</span>
                          <Star className="w-4 h-4 text-caption" />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400" style={{ width: stars === 5 ? "75%" : stars === 4 ? "20%" : "0%" }} />
                          </div>
                        </div>)}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-b border-border pb-6">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">AJ</div>
                           <div>
                             <div className="font-bold text-heading text-sm">Adam Jones</div>
                             <div className="text-xs text-caption">2 weeks ago</div>
                           </div>
                         </div>
                         <div className="flex text-orange-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                      </div>
                      <p className="text-sm text-body mt-3">Excellent course! The explanations were very clear and the practical examples helped me understand RTOS deeply.</p>
                    </div>
                  </div>
                </div>}
            </div>

          </div>
        </div>

        {
    /* RIGHT COLUMN: Curriculum Sidebar */
  }
        <div className={`fixed inset-y-0 right-0 z-30 w-80 bg-white border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:w-[30%] lg:min-w-[320px] lg:translate-x-0 flex flex-col ${showMobileSidebar ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-6 border-b border-border shrink-0 flex justify-between items-center bg-gray-50">
            <div>
              <h3 className="font-heading font-bold text-heading">Course Content</h3>
              <div className="text-sm text-caption mt-1">{completedCount} / {courseData.totalLessons} Lessons</div>
            </div>
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-200" onClick={() => setShowMobileSidebar(false)}>
               <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-border shrink-0 bg-white">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-heading">Overall Progress</span>
              <span className="text-primary">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
            {progressPercentage >= 100 && <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                <Award className="w-4 h-4" /> Certificate Unlocked!
              </div>}
          </div>

          {
    /* Accordion Modules */
  }
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {curriculum.map((module) => <div key={module.id} className="border-b border-border">
                <button
    onClick={() => toggleModule(module.id)}
    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
  >
                  <div>
                    <div className="font-bold text-heading text-sm">{module.title}</div>
                    <div className="text-xs text-caption mt-1 flex items-center gap-3">
                       <span>{module.lessons.filter((l) => l.completed).length}/{module.lessons.length} Completed</span>
                       <span>•</span>
                       <span>{module.duration}</span>
                    </div>
                  </div>
                  {expandedModules.includes(module.id) ? <ChevronUp className="w-5 h-5 text-caption" /> : <ChevronDown className="w-5 h-5 text-caption" />}
                </button>
                
                {expandedModules.includes(module.id) && <div className="bg-gray-50/50 pb-2">
                    {module.lessons.map((lesson) => {
    const isActive = activeLessonId === lesson.id;
    return <div
      key={lesson.id}
      onClick={() => selectLesson(lesson, module.id)}
      className={`flex items-start gap-3 p-3 pl-4 mx-2 rounded-xl cursor-pointer transition-colors ${isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-100 border border-transparent"} ${lesson.locked ? "opacity-60 cursor-not-allowed" : ""}`}
    >
                          <div className="shrink-0 mt-0.5">
                            {lesson.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : lesson.locked ? <Lock className="w-5 h-5 text-caption" /> : isActive ? <PlayCircle className="w-5 h-5 text-primary" /> : <PlayCircle className="w-5 h-5 text-caption" />}
                          </div>
                          <div>
                            <div className={`text-sm font-medium line-clamp-2 leading-tight ${isActive ? "text-primary font-bold" : "text-heading"}`}>
                              {lesson.id.toString().substring(1)}. {lesson.title}
                            </div>
                            <div className="text-xs text-caption mt-1 flex items-center gap-2">
                              <MonitorPlay className="w-3 h-3" /> {lesson.duration}
                            </div>
                          </div>
                        </div>;
  })}
                  </div>}
              </div>)}
          </div>
        </div>

        {
    /* Mobile Sidebar Overlay */
  }
        {showMobileSidebar && <div
    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
    onClick={() => setShowMobileSidebar(false)}
  />}
      </div>

      {
    /* Global Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>}
    </div>;
};
var stdin_default = CoursePlayer;
export {
  stdin_default as default
};
