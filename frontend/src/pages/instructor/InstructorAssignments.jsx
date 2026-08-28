import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import CustomSelect from "../../components/common/CustomSelect";
import {
  PlaySquare,
  CheckSquare,
  Briefcase,
  ChevronRight,
  ChevronDown,
  ListTree,
  ClipboardList,
  FileSignature,
  Save,
  UploadCloud,
  Eye,
  Trash2,
  Plus,
  X
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useTranslation } from "../../context/LanguageContext";

const InstructorAssignments = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [courseTree, setCourseTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [maxPoints, setMaxPoints] = useState(100);
  const [dueDate, setDueDate] = useState("");
  const [instructionsContent, setInstructionsContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Modal for creating a new assignment
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newModuleId, setNewModuleId] = useState("");
  const [newPoints, setNewPoints] = useState(100);
  const [newDueDate, setNewDueDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const selectedCourse = useMemo(
    () => courseTree.find((course) => course.id === selectedCourseId) || courseTree[0],
    [courseTree, selectedCourseId]
  );

  const selectedAssignment = useMemo(() => {
    return selectedCourse?.modules
      ?.flatMap((module) => module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title })))
      .find((item) => item.id === selectedItemId);
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

        const firstAssignment = firstCourse?.modules
          ?.flatMap((module) => module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title })))
          .find((item) => item.type === "assignment");

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

  const openCreateModal = (targetModuleId = "") => {
    setNewTitle("");
    setNewModuleId(targetModuleId || selectedCourse?.modules?.[0]?.id || "");
    setNewPoints(100);
    setNewDueDate("");
    setNewDescription("");
    setShowCreateModal(true);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter an assignment title");
      return;
    }
    if (!selectedCourse?.id) {
      toast.error("Please select a course first");
      return;
    }

    setCreating(true);
    try {
      const response = await instructorApi.createAssignment({
        title: newTitle.trim(),
        description: newDescription.trim() || newTitle.trim(),
        points: Math.max(1, Number(newPoints) || 100),
        dueDate: newDueDate || null,
        courseId: selectedCourse.id,
        moduleId: newModuleId || null
      });

      const created = response.data || response;
      const createdItem = {
        id: created.id,
        type: "assignment",
        title: created.title || newTitle,
        description: created.description || newDescription,
        points: created.points || newPoints,
        dueDate: created.dueDate || newDueDate,
        attachmentUrl: created.attachmentUrl || null,
        fileUrl: created.fileUrl || null
      };

      // Add newly created assignment to local course tree
      setCourseTree((prev) =>
        prev.map((course) => {
          if (course.id !== selectedCourse.id) return course;
          return {
            ...course,
            modules: course.modules.map((mod) => {
              if (mod.id !== newModuleId) return mod;
              return {
                ...mod,
                lessons: [...mod.lessons, createdItem]
              };
            })
          };
        })
      );

      // Expand target module
      setExpandedModules((prev) => ({ ...prev, [newModuleId]: true }));
      selectAssignment({ ...createdItem, moduleId: newModuleId, moduleTitle: selectedCourse?.modules?.find(m => m.id === newModuleId)?.title || "Module" });

      toast.success("Assignment created successfully!");
      setShowCreateModal(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create assignment"));
    } finally {
      setCreating(false);
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
      setCourseTree((prev) =>
        prev.map((course) => ({
          ...course,
          modules: course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.filter((item) => item.id !== selectedAssignment.id)
          }))
        }))
      );
      setShowDeleteModal(false);
      toast.success("Assignment deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete assignment"));
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
        {/* Header */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-heading">Assignment Workspace</h1>
            <p className="text-sm text-caption mt-1">Create and manage assignment tasks across your course modules.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => openCreateModal()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Assignment
            </button>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              onClick={handleSaveAssignment}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Assignment
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Sidebar - Course Curriculum Tree */}
          <div className="w-full md:w-80 bg-white border border-border rounded-2xl shadow-sm flex flex-col shrink-0 sticky top-0 max-h-[calc(100vh-4rem)] overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center justify-between">
              <div className="relative group/course flex-1">
                <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-heading shadow-sm cursor-pointer hover:bg-gray-50 transition-all justify-between">
                  <span className="truncate">{selectedCourse ? `Course: ${selectedCourse.title}` : "No courses yet"}</span>
                  <ChevronDown className="w-4 h-4 text-caption shrink-0" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {(selectedCourse?.modules || []).map((module, mIdx) => (
                <div key={module.id} className="space-y-1.5">
                  <div className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-lg group transition-colors">
                    <div
                      className="flex items-center gap-2 cursor-pointer flex-1 overflow-hidden"
                      onClick={() => toggleModule(module.id)}
                    >
                      {expandedModules[module.id] ? (
                        <ChevronDown className="w-4 h-4 text-caption group-hover:text-heading shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-caption group-hover:text-heading shrink-0" />
                      )}
                      <h3 className="text-sm font-bold text-heading truncate">
                        Module {mIdx + 1}: {module.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCreateModal(module.id)}
                      className="text-xs text-green-600 font-bold hover:bg-green-50 px-2 py-1 rounded-md transition-colors shrink-0 flex items-center gap-1"
                      title="Add Assignment to this Module"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {expandedModules[module.id] && (
                    <div className="pl-6 space-y-1 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-border">
                      {module.lessons.map((item) => {
                        const isActive = selectedItemId === item.id;
                        const isAssignment = item.type === "assignment";
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (isAssignment) selectAssignment({ ...item, moduleId: module.id, moduleTitle: module.title });
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                              isActive
                                ? "bg-green-50 border border-green-200 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-green-500 before:rounded-full cursor-pointer"
                                : isAssignment
                                ? "hover:bg-gray-50 border border-transparent cursor-pointer"
                                : "opacity-50 cursor-not-allowed border border-transparent"
                            }`}
                          >
                            {isAssignment ? (
                              <ClipboardList className={`w-4 h-4 shrink-0 ${isActive ? "text-green-500" : "text-caption"}`} />
                            ) : (
                              <PlaySquare className="w-4 h-4 shrink-0 text-gray-400" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm truncate ${isActive ? "font-bold text-green-600" : "font-medium text-body"}`}>
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

          {/* Main Editor Area */}
          <div className="flex-1 max-w-4xl space-y-8 w-full">
            {/* Context Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-caption bg-white border border-border px-4 py-3 rounded-xl shadow-sm">
              <ListTree className="w-4 h-4" />
              <span>{selectedCourse?.title || "Course"}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{selectedAssignment?.moduleTitle || "Module"}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-bold text-green-600">{assignmentTitle || "Select an assignment"}</span>
            </div>

            {/* Assignment Info Section */}
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
                      placeholder="e.g. Building a Responsive Dashboard"
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors font-medium text-heading"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heading">Max Score / Points</label>
                    <input
                      type="number"
                      value={maxPoints}
                      onChange={(e) => setMaxPoints(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors font-medium text-heading"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-heading">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors font-medium text-heading"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions & Requirements Section */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-green-500" />
                  <h2 className="font-heading font-bold text-lg text-heading">Instructions & Requirements</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={instructionsContent}
                    onChange={setInstructionsContent}
                    placeholder="Provide clear step-by-step submission instructions for your students..."
                    className="h-56 pb-12 text-heading"
                  />
                </div>
              </div>
            </div>

            {/* Attachment Resources Section */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UploadCloud className="w-5 h-5 text-green-500" />
                  <h2 className="font-heading font-bold text-lg text-heading">Resource Attachments</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-green-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-green-50/20 group"
                >
                  <UploadCloud className="w-10 h-10 text-caption group-hover:text-green-600 transition-colors mb-2" />
                  <p className="text-sm font-bold text-heading">Click to upload reference PDF or starter files</p>
                  <p className="text-xs text-caption mt-1">Supports PDF, ZIP, DOCX up to 25MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                  />
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-wider">Attached Files</label>
                    {attachedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-border rounded-xl text-sm">
                        <span className="font-medium text-heading truncate max-w-md">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={!selectedAssignment}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" /> Delete Assignment
              </button>

              <button
                type="button"
                onClick={handleSaveAssignment}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-lg">Create New Assignment</h3>
                  <p className="text-xs text-caption">Add a new assignment task to a course module.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-caption hover:text-heading p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-heading uppercase tracking-wider mb-1 block">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Portfolio Website Project"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-green-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-heading uppercase tracking-wider mb-1 block">Select Module *</label>
                <CustomSelect
                  options={(selectedCourse?.modules || []).map((m) => ({ value: m.id, label: m.title }))}
                  value={newModuleId}
                  onChange={(e) => setNewModuleId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-heading uppercase tracking-wider mb-1 block">Max Points</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-green-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-heading uppercase tracking-wider mb-1 block">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-green-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-heading uppercase tracking-wider mb-1 block">Instructions Overview</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short description or requirements summary..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-green-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-caption hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-heading text-lg">Student Assignment Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-caption hover:text-heading p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-heading">{assignmentTitle || "Untitled Assignment"}</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-caption bg-gray-50 p-3 rounded-xl border border-border">
                <span>Points: <strong className="text-heading">{maxPoints}</strong></span>
                <span>Due Date: <strong className="text-heading">{dueDate || "No due date"}</strong></span>
              </div>
              <div className="prose prose-sm max-w-none text-body border border-border p-4 rounded-xl bg-white" dangerouslySetInnerHTML={{ __html: instructionsContent || "<p>No instructions provided.</p>" }} />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button onClick={() => setShowPreviewModal(false)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAssignment}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignmentTitle}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default InstructorAssignments;
