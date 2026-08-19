import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  PlaySquare,
  FileText,
  Settings2,
  ChevronRight,
  ChevronDown,
  ListTree,
  FileSignature,
  MonitorPlay,
  Save,
  Eye,
  Trash2,
  Video,
  Film,
  Paperclip,
  X
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";
import ConfirmModal from "../../components/common/ConfirmModal";

const InstructorLessons = () => {
  const [courseTree, setCourseTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSequential, setIsSequential] = useState(true);

  // Lesson Type & Upload Modes
  const [lessonType, setLessonType] = useState("video");
  const [videoMode, setVideoMode] = useState("upload");
  const [textMode, setTextMode] = useState("paragraphs");

  const [videoUrl, setVideoUrl] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const videoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const selectedCourse = useMemo(
    () => courseTree.find((course) => course.id === selectedCourseId) || courseTree[0],
    [courseTree, selectedCourseId]
  );

  const selectedLesson = useMemo(() => {
    return selectedCourse?.modules
      ?.flatMap((module) =>
        module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title }))
      )
      .find((item) => item.id === selectedLessonId);
  }, [selectedCourse, selectedLessonId]);

  const selectLesson = (lesson) => {
    setSelectedLessonId(lesson.id);
    setLessonTitle(lesson.title || "");
    setLessonDuration(lesson.durationMinutes || "");
    setIsPreview(Boolean(lesson.isPreview));
    setIsSequential(lesson.isSequential !== undefined ? Boolean(lesson.isSequential) : true);

    const vUrl = lesson.videoUrl || "";
    setVideoUrl(vUrl);

    const desc = lesson.description || "";
    setLessonContent(desc);

    // Auto-detect type & modes
    if (vUrl) {
      setLessonType("video");
      if (vUrl.startsWith("/uploads") || vUrl.match(/\.(mp4|webm|mov|m4v)$/i)) {
        setVideoMode("upload");
      } else {
        setVideoMode("url");
      }
    } else if (desc.startsWith("/uploads") || desc.match(/\.pdf$/i)) {
      setLessonType("text");
      setTextMode("pdf");
    } else {
      setLessonType(lesson.type === "video" ? "video" : "text");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspace = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getWorkspace();
        const courses = Array.isArray(response.data) ? response.data : [];
        if (!isMounted) return;

        setCourseTree(courses);
        const firstCourse = courses[0];
        setSelectedCourseId(firstCourse?.id || "");
        const expanded = {};
        firstCourse?.modules?.forEach((module) => {
          expanded[module.id] = true;
        });
        setExpandedModules(expanded);
        const firstLesson = firstCourse?.modules
          ?.flatMap((module) =>
            module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title }))
          )
          .find((item) => item.type === "lesson");
        if (firstLesson) selectLesson(firstLesson);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load lesson workspace"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWorkspace();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleFileUpload = async (e, mode) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    if (mode === "video") setIsUploadingVideo(true);
    if (mode === "pdf") setIsUploadingPdf(true);

    try {
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.success && res.data?.url) {
        if (mode === "video") {
          setVideoUrl(res.data.url);
          toast.success("Video file uploaded successfully!");
        } else if (mode === "pdf") {
          setLessonContent(res.data.url);
          toast.success("PDF document uploaded successfully!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, `Failed to upload ${mode === "video" ? "video" : "PDF"}`));
    } finally {
      if (mode === "video") setIsUploadingVideo(false);
      if (mode === "pdf") setIsUploadingPdf(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!selectedLesson) {
      toast.error("Select a lesson from your curriculum first");
      return;
    }

    try {
      const payloadVideoUrl = lessonType === "video" ? videoUrl : "";
      const payloadDescription = lessonType === "text" ? lessonContent : selectedLesson.description || "";

      await instructorApi.updateLesson(selectedLesson.id, {
        title: lessonTitle,
        description: payloadDescription,
        duration: lessonDuration,
        isPreview,
        isSequential,
        videoUrl: payloadVideoUrl
      });

      // Update local courseTree state
      setCourseTree((prev) =>
        prev.map((course) => ({
          ...course,
          modules: course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((item) =>
              item.id === selectedLesson.id
                ? {
                    ...item,
                    title: lessonTitle,
                    description: payloadDescription,
                    videoUrl: payloadVideoUrl,
                    duration: lessonDuration ? `${lessonDuration} min` : "Not set",
                    durationMinutes: lessonDuration,
                    isPreview,
                    isSequential
                  }
                : item
            )
          }))
        }))
      );

      toast.success("Lesson saved successfully!");
      setShowPreviewModal(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save lesson"));
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      await instructorApi.deleteLesson(selectedLesson.id);
      setSelectedLessonId("");
      setLessonTitle("");
      setLessonContent("");
      setVideoUrl("");
      setShowDeleteModal(false);
      setCourseTree((prev) =>
        prev.map((course) => ({
          ...course,
          modules: course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.filter((item) => item.id !== selectedLesson.id)
          }))
        }))
      );
      toast.success("Lesson deleted successfully!");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete lesson"));
    }
  };

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        {/* Header - Non-sticky */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-heading">Lesson Workspace</h1>
            <p className="text-sm text-caption mt-1">Select a lesson from the curriculum to edit its content.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              onClick={handleSaveLesson}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        <div className="flex items-start gap-8">
          {/* Left Sidebar - Sticky Module Tree */}
          <div className="w-80 bg-white border border-border rounded-2xl shadow-sm flex flex-col shrink-0 sticky top-4 max-h-[calc(100vh-4rem)] overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50">
              <div className="relative group/course">
                <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-heading shadow-sm cursor-pointer hover:bg-gray-50 transition-all w-full justify-between">
                  <span className="truncate">
                    {selectedCourse ? `Course: ${selectedCourse.title}` : "No courses yet"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-caption shrink-0" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {(selectedCourse?.modules || []).map((module, mIdx) => (
                <div key={module.id} className="space-y-1.5">
                  <div
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg group transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    {expandedModules[module.id] ? (
                      <ChevronDown className="w-4 h-4 text-caption group-hover:text-heading transition-colors" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-caption group-hover:text-heading transition-colors" />
                    )}
                    <h3 className="text-sm font-bold text-heading">
                      Module {mIdx + 1}: {module.title}
                    </h3>
                  </div>

                  {expandedModules[module.id] && (
                    <div className="pl-6 space-y-1 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-border">
                      {module.lessons
                        .filter((lesson) => lesson.type === "lesson")
                        .map((lesson) => {
                          const isActive = selectedLessonId === lesson.id;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() =>
                                selectLesson({ ...lesson, moduleId: module.id, moduleTitle: module.title })
                              }
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative ${
                                isActive
                                  ? "bg-primary/10 border border-primary/20 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full"
                                  : "hover:bg-gray-50 border border-transparent"
                              }`}
                            >
                              <PlaySquare
                                className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-caption"}`}
                              />
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-sm truncate ${
                                    isActive ? "font-bold text-primary" : "font-medium text-body"
                                  }`}
                                >
                                  {lesson.title}
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
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Context Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-caption bg-white border border-border px-4 py-3 rounded-xl shadow-sm">
              <ListTree className="w-4 h-4" />
              <span>{selectedCourse?.title || "Course"}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{selectedLesson?.moduleTitle || "Module"}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-bold text-primary">{lessonTitle || "Select a lesson"}</span>
            </div>

            {/* Lesson Info Section */}
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
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heading">Lesson Type</label>
                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      <option value="video">Video Lesson</option>
                      <option value="text">Text / Article / PDF Document</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heading">Estimated Duration (Minutes)</label>
                    <input
                      type="text"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div
                    onClick={() => setIsPreview(!isPreview)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer flex-shrink-0 transition-colors ${
                      isPreview ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${
                        isPreview ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-heading">
                    Free Preview (Allow non-enrolled students to watch)
                  </span>
                </div>
              </div>
            </div>

            {/* Video Lesson Content Section */}
            {lessonType === "video" && (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-fade-in">
                <div className="bg-gray-50 border-b border-border px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MonitorPlay className="w-5 h-5 text-blue-500" />
                    <div>
                      <h2 className="font-heading font-bold text-lg text-heading">Video Content</h2>
                      <p className="text-xs text-caption">Upload a video file or paste a video link</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-200 dark:bg-neutral-800 p-1 rounded-xl text-xs font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => setVideoMode("upload")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        videoMode === "upload"
                          ? "bg-white dark:bg-neutral-900 text-primary shadow-xs"
                          : "text-caption hover:text-heading"
                      }`}
                    >
                      Upload Video File
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoMode("url")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        videoMode === "url"
                          ? "bg-white dark:bg-neutral-900 text-primary shadow-xs"
                          : "text-caption hover:text-heading"
                      }`}
                    >
                      Paste Video URL
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {videoMode === "upload" ? (
                    <div>
                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={(e) => handleFileUpload(e, "video")}
                        accept="video/*"
                        className="hidden"
                      />
                      {videoUrl ? (
                        <div className="rounded-2xl border border-border bg-gray-50 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                              <Film className="w-3.5 h-3.5" /> Video Attached
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => videoInputRef.current?.click()}
                                className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-heading hover:border-primary transition-colors cursor-pointer"
                              >
                                Change Video
                              </button>
                              <button
                                type="button"
                                onClick={() => setVideoUrl("")}
                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {videoUrl.startsWith("/uploads") || videoUrl.match(/\.(mp4|webm|mov|m4v)$/i) ? (
                            <video
                              src={videoUrl}
                              controls
                              className="w-full max-h-72 rounded-xl bg-black object-contain shadow-sm"
                            />
                          ) : (
                            <p className="text-sm font-bold text-heading truncate">{videoUrl}</p>
                          )}
                        </div>
                      ) : (
                        <div
                          onClick={() => videoInputRef.current?.click()}
                          className="border-2 border-dashed border-border hover:border-primary/50 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/5 group"
                        >
                          {isUploadingVideo ? (
                            <div className="flex flex-col items-center py-4">
                              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                              <p className="text-sm font-bold text-primary">Uploading video file...</p>
                            </div>
                          ) : (
                            <>
                              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                <Video className="w-7 h-7" />
                              </div>
                              <h4 className="text-sm font-bold text-heading mb-1">Click to Upload Video File</h4>
                              <p className="text-xs text-caption max-w-sm mb-4">
                                Supported: MP4, WEBM, MOV (up to 500MB)
                              </p>
                              <span className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-colors">
                                Browse Video File
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-heading">
                        Hosted Video URL (YouTube / Vimeo / Direct Link)
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                      />
                      <p className="text-xs text-caption">
                        Add a hosted URL from YouTube, Vimeo, or direct MP4 CDN link.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Text & Document Lesson Content Section */}
            {lessonType === "text" && (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-fade-in">
                <div className="bg-gray-50 border-b border-border px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <div>
                      <h2 className="font-heading font-bold text-lg text-heading">Text & Document Content</h2>
                      <p className="text-xs text-caption">Add written paragraphs or upload a PDF document</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-200 dark:bg-neutral-800 p-1 rounded-xl text-xs font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => setTextMode("paragraphs")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        textMode === "paragraphs"
                          ? "bg-white dark:bg-neutral-900 text-primary shadow-xs"
                          : "text-caption hover:text-heading"
                      }`}
                    >
                      Rich Text / Paragraphs
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextMode("pdf")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        textMode === "pdf"
                          ? "bg-white dark:bg-neutral-900 text-primary shadow-xs"
                          : "text-caption hover:text-heading"
                      }`}
                    >
                      Upload PDF Document
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {textMode === "paragraphs" ? (
                    <div className="bg-white space-y-2">
                      <label className="block text-sm font-bold text-heading mb-2">
                        Lesson Paragraphs / Rich Text Editor
                      </label>
                      <ReactQuill
                        theme="snow"
                        value={lessonContent}
                        onChange={setLessonContent}
                        className="h-64 mb-12"
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={pdfInputRef}
                        onChange={(e) => handleFileUpload(e, "pdf")}
                        accept="application/pdf"
                        className="hidden"
                      />
                      {lessonContent && (lessonContent.startsWith("/uploads") || lessonContent.match(/\.pdf$/i)) ? (
                        <div className="rounded-2xl border border-border bg-gray-50 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                              <Paperclip className="w-3.5 h-3.5" /> PDF Document Attached
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => pdfInputRef.current?.click()}
                                className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-heading hover:border-primary transition-colors cursor-pointer"
                              >
                                Change PDF
                              </button>
                              <button
                                type="button"
                                onClick={() => setLessonContent("")}
                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-border">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs shrink-0">
                                PDF
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-bold text-heading truncate">
                                  {lessonContent.split("/").pop()}
                                </p>
                                <p className="text-xs text-caption">Click view to open attached document</p>
                              </div>
                            </div>
                            <a
                              href={lessonContent}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors shrink-0"
                            >
                              View PDF
                            </a>
                          </div>

                          <iframe
                            src={lessonContent}
                            title="PDF Preview"
                            className="w-full h-80 rounded-xl border border-border bg-white shadow-xs"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => pdfInputRef.current?.click()}
                          className="border-2 border-dashed border-border hover:border-primary/50 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/5 group"
                        >
                          {isUploadingPdf ? (
                            <div className="flex flex-col items-center py-4">
                              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                              <p className="text-sm font-bold text-primary">Uploading PDF document...</p>
                            </div>
                          ) : (
                            <>
                              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7" />
                              </div>
                              <h4 className="text-sm font-bold text-heading mb-1">Click to Upload PDF Document</h4>
                              <p className="text-xs text-caption max-w-sm mb-4">
                                Supported: PDF document format (up to 500MB)
                              </p>
                              <span className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-purple-700 transition-colors">
                                Browse PDF File
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Settings */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-green-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Settings</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setIsSequential(!isSequential)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer flex-shrink-0 transition-colors ${
                      isSequential ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${
                        isSequential ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-heading block">Require Sequential Progress</span>
                    <span className="text-xs text-caption">Student must complete previous lessons to unlock this.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Action Section */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-heading text-base">Save your lesson changes</h3>
                <p className="text-xs text-caption">Save all updates, duration, preview settings, and attachments.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveLesson}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/30 rounded-2xl border border-red-200 shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-heading text-red-600 mb-1">Delete Lesson</h3>
                  <p className="text-sm text-red-800/70">Once you delete this lesson, there is no going back.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedLesson && !lessonTitle) return;
                    setShowDeleteModal(true);
                  }}
                  className="flex shrink-0 items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:border-red-300 shadow-sm transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm Lesson Deletion"
        message={`This action cannot be undone. To permanently delete this lesson, please type its exact title below.`}
        expectedTitle={selectedLesson?.title || lessonTitle}
        onConfirm={handleDeleteLesson}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Permanently Delete"
        isDestructive={true}
      />

      {/* Student Lesson Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-border">
            <div className="p-6 border-b border-border bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-heading">Student Lesson Preview</h3>
                  <p className="text-xs text-caption">Live preview of how students will see this lesson</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-2 text-caption hover:text-heading rounded-full bg-white border border-border shadow-xs cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase bg-primary/10 text-primary">
                    {lessonType === "video" ? "Video Lesson" : "Text / Document"}
                  </span>
                  {isPreview && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase bg-green-100 text-green-700">
                      Free Preview Enabled
                    </span>
                  )}
                  <span className="text-xs font-medium text-caption">
                    Estimated Duration: {lessonDuration || "Not set"} min
                  </span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-heading">{lessonTitle || "Untitled Lesson"}</h2>
              </div>

              {lessonType === "video" && (
                <div className="space-y-3">
                  {videoUrl ? (
                    videoUrl.startsWith("/uploads") || videoUrl.match(/\.(mp4|webm|mov|m4v)$/i) ? (
                      <div className="rounded-2xl overflow-hidden bg-black shadow-md">
                        <video src={videoUrl} controls className="w-full max-h-96 object-contain" />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-black">
                        <iframe
                          src={videoUrl.replace("watch?v=", "embed/")}
                          title="Video Preview"
                          className="w-full h-full border-none"
                          allowFullScreen
                        />
                      </div>
                    )
                  ) : (
                    <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-gray-50">
                      <p className="text-sm font-bold text-caption">No video content attached yet.</p>
                    </div>
                  )}
                </div>
              )}

              {lessonType === "text" && (
                <div className="space-y-4">
                  {lessonContent && (lessonContent.startsWith("/uploads") || lessonContent.match(/\.pdf$/i)) ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-bold text-heading">{lessonContent.split("/").pop()}</p>
                            <p className="text-xs text-caption">Attached PDF Document</p>
                          </div>
                        </div>
                        <a
                          href={lessonContent}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-purple-700 transition-colors"
                        >
                          Open PDF
                        </a>
                      </div>
                      <iframe src={lessonContent} title="PDF Preview" className="w-full h-96 rounded-2xl border border-border" />
                    </div>
                  ) : lessonContent ? (
                    <div
                      className="prose max-w-none text-body bg-gray-50/50 p-6 rounded-2xl border border-border"
                      dangerouslySetInnerHTML={{ __html: lessonContent }}
                    />
                  ) : (
                    <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-gray-50">
                      <p className="text-sm font-bold text-caption">No written text content added yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2.5 bg-heading text-white text-sm font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorLessons;
