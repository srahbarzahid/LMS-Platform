import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  PlaySquare,
  CheckSquare,
  Briefcase,
  FileText,
  ChevronRight,
  ChevronDown,
  ListTree,
  ClipboardList,
  FileSignature,
  Save,
  UploadCloud,
  Eye,
  Trash2,
  X
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";
import ConfirmModal from "../../components/common/ConfirmModal";

const InstructorAssignments = () => {
  const fileInputRef = useRef(null);
  const [courseTree, setCourseTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [maxPoints, setMaxPoints] = useState(100);
  const [dueDate, setDueDate] = useState("");
  const [instructionsContent, setInstructionsContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const selectedCourse = useMemo(
    () => courseTree.find((course) => course.id === selectedCourseId) || courseTree[0],
    [courseTree, selectedCourseId]
  );
  const selectedAssignment = useMemo(() => {
    return selectedCourse?.modules?.flatMap((module) => module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title }))).find((item) => item.id === selectedItemId);
  }, [selectedCourse, selectedItemId]);
  const selectAssignment = (item) => {
    setSelectedItemId(item.id);
    setAssignmentTitle(item.title || "");
    setMaxPoints(item.points ?? item.maxMarks ?? 100);
    setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : "");
    setInstructionsContent(item.description || "");

    const fileUrl = item.attachmentUrl || item.fileUrl;
    if (fileUrl) {
      setAttachedFiles([{ name: fileUrl.split("/").pop() || "Attached Resource", url: fileUrl, isExisting: true }]);
    } else {
      setAttachedFiles([]);
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
        const firstAssignment = firstCourse?.modules?.flatMap((module) => module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title }))).find((item) => item.type === "assignment");
        if (firstAssignment) selectAssignment(firstAssignment);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load assignment workspace"));
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
  const handleFileSelect = (e) => {
    if (e.target.files) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };
  const handleSaveAssignment = async () => {
    if (!selectedAssignment) {
      toast.error("Select an assignment from your curriculum first");
      return;
    }

    try {
      const firstFile = attachedFiles[0];
      const attachmentUrl = firstFile?.url || firstFile?.name || null;
      const numericPoints = Math.max(1, Number(maxPoints) || 100);

      await instructorApi.updateAssignment(selectedAssignment.id, {
        title: assignmentTitle,
        description: instructionsContent,
        points: numericPoints,
        dueDate,
        attachmentUrl,
        fileUrl: attachmentUrl,
        courseId: selectedCourse.id,
        moduleId: selectedAssignment.moduleId
      });

      setCourseTree((prev) =>
        prev.map((course) => ({
          ...course,
          modules: course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((item) =>
              item.id === selectedAssignment.id
                ? {
                    ...item,
                    title: assignmentTitle,
                    description: instructionsContent,
                    points: numericPoints,
                    dueDate,
                    attachmentUrl,
                    fileUrl: attachmentUrl
                  }
                : item
            )
          }))
        }))
      );

      toast.success("Assignment saved successfully!");
      setShowPreviewModal(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save assignment"));
    }
  };
  const handleDeleteAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      await instructorApi.deleteAssignment(selectedAssignment.id);
      setSelectedItemId("");
      setAssignmentTitle("");
      setInstructionsContent("");
      setCourseTree((prev) => prev.map((course) => ({
        ...course,
        modules: course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.filter((item) => item.id !== selectedAssignment.id)
        }))
      })));
      setShowDeleteModal(false);
      toast.success("Assignment deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete assignment"));
    }
  };
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  if (loading) {
    return <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <>
    <div className="flex flex-col gap-6 pb-10">
      {
    /* Header - Non Sticky */
  }
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Assignment Workspace</h1>
          <p className="text-sm text-caption mt-1">Select a task from the curriculum to edit its requirements.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setShowPreviewModal(true)} className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={handleSaveAssignment} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
            <Save className="w-4 h-4" /> Save Assignment
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
                <span className="truncate">{selectedCourse ? `Course: ${selectedCourse.title}` : "No courses yet"}</span>
                <ChevronDown className="w-4 h-4 text-caption shrink-0" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {(selectedCourse?.modules || []).map((module, mIdx) => <div key={module.id} className="space-y-1.5">
                <div
    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg group transition-colors"
    onClick={() => toggleModule(module.id)}
  >
                  {expandedModules[module.id] ? <ChevronDown className="w-4 h-4 text-caption group-hover:text-heading transition-colors" /> : <ChevronRight className="w-4 h-4 text-caption group-hover:text-heading transition-colors" />}
                  <h3 className="text-sm font-bold text-heading">Module {mIdx + 1}: {module.title}</h3>
                </div>
                
                {expandedModules[module.id] && <div className="pl-6 space-y-1 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-border">
                    {module.lessons.map((item) => {
    const isActive = selectedItemId === item.id;
    const isAssignment = item.type === "assignment";
    return <div
      key={item.id}
      onClick={() => {
        if (isAssignment) selectAssignment({ ...item, moduleId: module.id, moduleTitle: module.title });
      }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative
                            ${isActive ? "bg-green-50 border border-green-200 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-green-500 before:rounded-full cursor-pointer" : isAssignment ? "hover:bg-gray-50 border border-transparent cursor-pointer" : "opacity-50 cursor-not-allowed border border-transparent"}`}
    >
                          {isAssignment ? <ClipboardList className={`w-4 h-4 shrink-0 ${isActive ? "text-green-500" : "text-caption"}`} /> : <PlaySquare className="w-4 h-4 shrink-0 text-gray-400" />}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm truncate ${isActive ? "font-bold text-green-600" : "font-medium text-body"}`}>
                              {item.title}
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
            <span>{selectedCourse?.title || "Course"}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{selectedAssignment?.moduleTitle || "Module"}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-green-600">{assignmentTitle || "Select an assignment"}</span>
          </div>

          {
    /* Assignment Info Section */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSignature className="w-5 h-5 text-green-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Assignment Information</h2>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-heading uppercase tracking-wider">Active</span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-bold text-heading">Assignment Title</label>
                  <input
    type="text"
    value={assignmentTitle}
    onChange={(e) => setAssignmentTitle(e.target.value)}
    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Max Score / Points</label>
                  <input
    type="number"
    value={maxPoints}
    onChange={(e) => setMaxPoints(e.target.value)}
    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading">Due Date</label>
                  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
  />
                </div>
              </div>
            </div>
          </div>

          {
    /* Instructions Rich Text Editor */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Instructions & Requirements</h2>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white border border-border text-heading px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
                <UploadCloud className="w-3.5 h-3.5" /> Attach Resource
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            </div>
            <div className="p-6 bg-white">
              <ReactQuill
    theme="snow"
    value={instructionsContent}
    onChange={setInstructionsContent}
    className="h-64 mb-12"
  />

              {attachedFiles.length > 0 && <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-heading">Attached Files ({attachedFiles.length})</h4>
                  <div className="space-y-2">
                    {attachedFiles.map((f, i) => <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-heading">{f.name}</span>
                        </div>
                        <span className="text-xs text-caption">{(f.size / 1024).toFixed(1)} KB</span>
                      </div>)}
                  </div>
                </div>}
            </div>
          </div>

          {/* Bottom Save Action Section */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-heading text-base">Save your assignment changes</h3>
              <p className="text-xs text-caption">Save all instructions, total points, due dates, and attachments.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSaveAssignment}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Assignment
              </button>
            </div>
          </div>

          {
    /* Danger Zone */
  }
          <div className="bg-red-50/30 rounded-2xl border border-red-200 shadow-sm overflow-hidden">
             <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-heading text-red-600 mb-1">Delete Assignment</h3>
                 <p className="text-sm text-red-800/70">Once you delete this assignment, there is no going back. All student submissions will be lost.</p>
               </div>
               <button onClick={() => setShowDeleteModal(true)} className="flex shrink-0 items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:border-red-300 shadow-sm transition-colors cursor-pointer">
                 <Trash2 className="w-4 h-4" /> Delete Assignment
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>

    <ConfirmModal
      isOpen={showDeleteModal}
      title="Confirm Assignment Deletion"
      message="This action cannot be undone. To permanently delete this assignment, please type its exact title below."
      expectedTitle={selectedAssignment?.title || assignmentTitle}
      onConfirm={handleDeleteAssignment}
      onCancel={() => setShowDeleteModal(false)}
      confirmText="Permanently Delete"
      isDestructive={true}
    />

    {/* Student Assignment Preview Modal */}
    {showPreviewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-border">
          <div className="p-6 border-b border-border bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-heading">Student Assignment Preview</h3>
                <p className="text-xs text-caption">Live preview of how students will see this task</p>
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
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase bg-green-50 text-green-600">
                  Practical Task
                </span>
                <span className="text-xs font-bold text-caption">
                  Total Points: {maxPoints || 100}
                </span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-heading mt-2">{assignmentTitle || "Untitled Assignment"}</h2>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-heading">Instructions & Requirements:</h4>
              {assignmentInstructions ? (
                <div
                  className="prose max-w-none text-body bg-gray-50/50 p-6 rounded-2xl border border-border"
                  dangerouslySetInnerHTML={{ __html: assignmentInstructions }}
                />
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-gray-50">
                  <p className="text-sm font-bold text-caption">No assignment instructions added yet.</p>
                </div>
              )}

              {attachedFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-heading">Resource Attachments:</h4>
                  <div className="space-y-2">
                    {attachedFiles.map((file, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-heading">{file.name}</span>
                        </div>
                        <span className="text-xs text-caption">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
  </>;
};
var stdin_default = InstructorAssignments;
export {
  stdin_default as default
};
