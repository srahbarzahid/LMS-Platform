import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Edit2,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  PlaySquare,
  CheckSquare,
  ClipboardList,
  Briefcase,
  CheckCircle,
  X,
  ExternalLink,
  Copy,
  Send,
  AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";
import ConfirmModal from "../../components/common/ConfirmModal";

const normalizeCurriculumModules = (modules = []) =>
  (Array.isArray(modules) ? modules : []).map((module) => {
    const rawItems = Array.isArray(module.items)
      ? module.items
      : Array.isArray(module.lessons)
      ? module.lessons
      : [];

    return {
      id: module.id,
      title: module.title,
      items: rawItems.map((item) => {
        const qCount =
          typeof item.questionCount === "number"
            ? item.questionCount
            : Array.isArray(item.questions)
            ? item.questions.length
            : Array.isArray(item.questionList)
            ? item.questionList.length
            : typeof item.questions === "number"
            ? item.questions
            : 0;

        const dur =
          item.durationMinutes ||
          item.durationLabel ||
          (item.duration && item.duration !== "Not set" && item.duration !== "00:00" ? item.duration : "Not set");

        const pts = item.points ?? item.maxMarks ?? 100;

        return {
          ...item,
          type: item.type === "video" ? "lesson" : item.type,
          duration: dur,
          questions: qCount,
          points: pts,
          status: item.status || "Draft"
        };
      })
    };
  });

const InstructorCurriculum = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "";
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [expandedModules, setExpandedModules] = useState({});
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {
    }
  });
  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const response = await instructorApi.getCourses();
        const nextCourses = response.data || [];
        if (!isMounted) return;
        setCourses(nextCourses);
        if (!selectedCourseId && nextCourses.length > 0) {
          setSelectedCourseId(nextCourses[0].id);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load courses"));
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    let isMounted = true;

    const fetchCurriculum = async () => {
      if (!selectedCourseId) {
        setModules([]);
        setExpandedModules({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await instructorApi.getCurriculum(selectedCourseId);
        const nextModules = normalizeCurriculumModules(response.data);
        if (!isMounted) return;
        setModules(nextModules);
        const expandState = {};
        nextModules.forEach((module) => {
          expandState[module.id] = true;
        });
        setExpandedModules(expandState);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load curriculum"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCurriculum();
    return () => {
      isMounted = false;
    };
  }, [selectedCourseId]);
  const selectedCourse = courses.find((course) => course.id === selectedCourseId);
  const handleCourseSelect = (course) => {
    setSelectedCourseId(course.id);
    navigate(`/instructor/curriculum?courseId=${course.id}`, { replace: true });
  };
  const handleSaveCurriculum = async () => {
    if (!selectedCourseId) {
      toast.error("Select a course first");
      return;
    }

    setSaving(true);
    try {
      const response = await instructorApi.updateCurriculum(selectedCourseId, { modules });
      const nextModules = normalizeCurriculumModules(response.data);
      setModules(nextModules);
      toast.success("Curriculum saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save curriculum"));
    } finally {
      setSaving(false);
    }
  };
  const handleSubmitForReview = async () => {
    if (!selectedCourseId) {
      toast.error("Select a course first");
      return;
    }

    if (modules.length === 0) {
      toast.error("Add at least one module before submitting");
      return;
    }

    const emptyModules = modules.filter((m) => !Array.isArray(m.items) || m.items.length === 0);
    if (emptyModules.length > 0) {
      toast.error(`Please add at least one lesson, quiz, or task to all modules before submitting (${emptyModules.length} empty module(s) remaining)`);
      return;
    }

    setSaving(true);
    try {
      await instructorApi.updateCurriculum(selectedCourseId, { modules });
      await instructorApi.publishCourse(selectedCourseId);
      toast.success("Course submitted for admin review successfully!");
      navigate("/instructor/courses");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to submit course"));
    } finally {
      setSaving(false);
    }
  };
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  const moveModule = (index, direction) => {
    const newModules = [...modules];
    if (direction === "up" && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === "down" && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    }
    setModules(newModules);
  };
  const handleAddModule = () => {
    const newModule = {
      id: `m${Date.now()}`,
      title: "New Module",
      items: []
    };
    setModules([...modules, newModule]);
    setExpandedModules((prev) => ({ ...prev, [newModule.id]: true }));
    toast.success("New module added!");
    startEditModule(newModule.id, newModule.title);
  };
  const startEditModule = (id, title) => {
    setEditingItemId(null);
    setEditingModuleId(id);
    setEditValue(title);
  };
  const persistModules = async (updatedModules) => {
    setModules(updatedModules);
    if (!selectedCourseId) return;
    try {
      const response = await instructorApi.updateCurriculum(selectedCourseId, { modules: updatedModules });
      const nextModules = normalizeCurriculumModules(response.data);
      setModules(nextModules);
    } catch (err) {
      console.error("Auto save curriculum error:", err);
    }
  };

  const saveModuleTitle = async (id) => {
    if (!editValue.trim()) return;
    const updatedModules = modules.map((m) => m.id === id ? { ...m, title: editValue.trim() } : m);
    setEditingModuleId(null);
    toast.success("Module title updated & saved!");
    await persistModules(updatedModules);
  };

  const deleteModule = (id) => {
    const targetModule = modules.find((m) => m.id === id);
    setConfirmModal({
      isOpen: true,
      title: "Delete Module Confirmation",
      message: "This action cannot be undone. All lessons and quizzes inside it will be permanently lost.",
      expectedTitle: targetModule?.title || "",
      onConfirm: async () => {
        const updatedModules = modules.filter((m) => m.id !== id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        toast.success("Module deleted!");
        await persistModules(updatedModules);
      }
    });
  };

  const duplicateItem = (moduleId, item) => {
    const updatedModules = modules.map((m) => {
      if (m.id === moduleId) {
        const itemIndex = m.items.findIndex((i) => i.id === item.id);
        const newItem = { ...item, id: `i${Date.now()}`, title: `${item.title} (Copy)`, status: "Draft" };
        const newItems = [...m.items];
        newItems.splice(itemIndex + 1, 0, newItem);
        return { ...m, items: newItems };
      }
      return m;
    });
    setModules(updatedModules);
    toast.success(`${item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "Item"} duplicated!`);
  };

  const startEditItem = (id, title) => {
    setEditingModuleId(null);
    setEditingItemId(id);
    setEditValue(title);
  };

  const saveItemTitle = async (moduleId, itemId) => {
    if (!editValue.trim()) return;
    const updatedModules = modules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          items: m.items.map((i) => i.id === itemId ? { ...i, title: editValue.trim() } : i)
        };
      }
      return m;
    });
    setEditingItemId(null);
    toast.success("Item saved!");
    await persistModules(updatedModules);
  };

  const deleteItem = (moduleId, item) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete ${item.type ? item.type.toUpperCase() : "Item"} Confirmation`,
      message: "This action cannot be undone. To permanently delete this item, please type its exact title below.",
      expectedTitle: item.title,
      onConfirm: async () => {
        const updatedModules = modules.map((m) => {
          if (m.id === moduleId) {
            return { ...m, items: m.items.filter((i) => i.id !== item.id) };
          }
          return m;
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        toast.success("Item deleted!");
        await persistModules(updatedModules);
      }
    });
  };

  const handleAddItem = (moduleId, type) => {
    const newItem = {
      id: `i${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      status: "Draft",
      ...(type === "lesson"
        ? { duration: "Not set" }
        : type === "quiz"
        ? { questions: 0 }
        : type === "project"
        ? { points: 100, maxMarks: 100 }
        : { points: 100 })
    };
    const updatedModules = modules.map((m) => {
      if (m.id === moduleId) {
        return { ...m, items: [...m.items, newItem] };
      }
      return m;
    });
    setModules(updatedModules);
    setExpandedModules((prev) => ({ ...prev, [moduleId]: true }));
    startEditItem(newItem.id, newItem.title);
  };
  const handleDragStart = (e, moduleId, itemIndex) => {
    setDraggedItem({ moduleId, itemIndex });
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.style.opacity = "0.5";
    }, 0);
  };
  const handleDragEnd = (e) => {
    if (e.target instanceof HTMLElement) e.target.style.opacity = "1";
    setDraggedItem(null);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e, targetModuleId, targetItemIndex) => {
    e.preventDefault();
    if (!draggedItem) return;
    const sourceModuleId = draggedItem.moduleId;
    const sourceItemIndex = draggedItem.itemIndex;
    if (sourceModuleId === targetModuleId && sourceItemIndex === targetItemIndex) {
      return;
    }
    setModules((prev) => {
      const newModules = JSON.parse(JSON.stringify(prev));
      const sourceModule = newModules.find((m) => m.id === sourceModuleId);
      const targetModule = newModules.find((m) => m.id === targetModuleId);
      const [movedItem] = sourceModule.items.splice(sourceItemIndex, 1);
      targetModule.items.splice(targetItemIndex, 0, movedItem);
      return newModules;
    });
  };
  const handleDropOnModuleEnd = (e, targetModuleId) => {
    e.preventDefault();
    if (!draggedItem) return;
    const targetModule = modules.find((m) => m.id === targetModuleId);
    if (!targetModule) return;
    handleDrop(e, targetModuleId, targetModule.items.length);
  };
  const getItemIcon = (type) => {
    switch (type) {
      case "lesson":
        return <PlaySquare className="w-4 h-4 text-orange-500" />;
      case "quiz":
        return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case "assignment":
        return <ClipboardList className="w-4 h-4 text-green-500" />;
      case "project":
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      default:
        return <PlaySquare className="w-4 h-4 text-gray-500" />;
    }
  };
  const getItemMeta = (item) => {
    if (item.type === "lesson") {
      if (item.duration && item.duration !== "Not set" && item.duration !== "00:00") {
        return typeof item.duration === "number" || (!isNaN(Number(item.duration)) && Number(item.duration) > 0)
          ? `${item.duration} min`
          : String(item.duration);
      }
      const isVideo = Boolean(item.videoUrl) || item.lessonType === "video";
      return isVideo ? "Not set" : "Text Article";
    }
    if (item.type === "quiz") {
      const count =
        typeof item.questionCount === "number"
          ? item.questionCount
          : Array.isArray(item.questions)
          ? item.questions.length
          : Array.isArray(item.questionList)
          ? item.questionList.length
          : typeof item.questions === "number"
          ? item.questions
          : 0;
      return `${count} Question${count === 1 ? "" : "s"}`;
    }
    if (item.type === "assignment" || item.type === "project") {
      const pts = item.points ?? item.maxMarks ?? 100;
      return `${pts} Points`;
    }
    return "";
  };
  const hasModules = modules.length > 0;
  const totalModulesCount = modules.length;
  const completedModulesCount = modules.filter((m) => Array.isArray(m.items) && m.items.length > 0).length;
  const allModulesFilled = hasModules && completedModulesCount === totalModulesCount;

  const setupSteps = [
    {
      label: "Basic Information",
      done: Boolean(selectedCourse?.title && selectedCourse?.category)
    },
    {
      label: "Media Assets",
      done: Boolean(selectedCourse?.thumbnail || selectedCourse?.promoVideoUrl)
    },
    {
      label: "Pricing & Level",
      done: Boolean(selectedCourse && selectedCourse?.price !== undefined)
    },
    {
      label: "Course Overview & Details",
      done: Boolean(selectedCourse?.shortDescription || selectedCourse?.description || selectedCourse?.fullDescription)
    },
    {
      label: "Curriculum Modules",
      done: hasModules
    },
    {
      label: `Module Content (${completedModulesCount}/${totalModulesCount || 1} Modules Completed)`,
      done: allModulesFilled
    },
    {
      label: "Lessons & Learning Items",
      done: modules.some((m) => (m.items || []).some((i) => i.type === "lesson"))
    },
    {
      label: "Quizzes & Tasks",
      done: modules.some((m) => (m.items || []).some((i) => i.type === "quiz" || i.type === "assignment" || i.type === "project"))
    }
  ];

  const completionPercent = setupSteps.length
    ? Math.round((setupSteps.filter((step) => step.done).length / setupSteps.length) * 100)
    : 0;
  return <div className="max-w-5xl mx-auto space-y-6 pb-8">
      
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Curriculum Builder</h1>
          <p className="text-body mt-1">Organize your course structure by creating modules and placeholders.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group/course z-50">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-heading shadow-xs cursor-pointer hover:bg-gray-50 transition-all max-w-[180px] sm:max-w-[220px]">
              <span className="truncate">{selectedCourse?.title || "Select Course"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-caption shrink-0 ml-auto group-hover/course:rotate-180 transition-transform" />
            </div>
            
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-border rounded-xl shadow-lg opacity-0 invisible group-hover/course:opacity-100 group-hover/course:visible transition-all py-1.5 origin-top-right">
              {courses.length === 0 ? <div className="px-3.5 py-2 text-xs text-caption">No courses found</div> : courses.map((course) => <button
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer truncate ${selectedCourseId === course.id ? "bg-primary/5 text-primary font-bold" : "text-body hover:bg-gray-50 hover:text-heading"}`}
              >
                  {course.title}
                </button>)}
            </div>
          </div>

          <button
            onClick={handleSaveCurriculum}
            disabled={saving || !selectedCourseId}
            className="flex items-center gap-1.5 bg-white border border-border text-heading px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5 text-gray-500" />}
            <span>Save</span>
          </button>

          <button
            onClick={handleSubmitForReview}
            disabled={saving || !selectedCourseId || !allModulesFilled}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            title={!allModulesFilled ? "Add content to all modules to enable review submission" : "Submit course for review"}
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {
    /* Main Builder Area */
  }
        <div className="lg:col-span-3 space-y-4">
          {loading ? <div className="flex py-20 items-center justify-center bg-white rounded-2xl border border-border">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div> : <>
              {modules.map((module, index) => <div key={module.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-all">
                  
                  {
    /* Module Header */
  }
                  <div className="bg-gray-50 p-4 border-b border-border flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveModule(index, "up")} disabled={index === 0} className="text-caption hover:text-heading disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveModule(index, "down")} disabled={index === modules.length - 1} className="text-caption hover:text-heading disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer" onClick={() => toggleModule(module.id)}>Module {index + 1}:</span>
                        {editingModuleId === module.id ? <div className="flex items-center gap-2 flex-1">
                            <input
    type="text"
    value={editValue}
    onChange={(e) => setEditValue(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && saveModuleTitle(module.id)}
    autoFocus
    className="font-heading font-bold text-heading text-lg border border-primary rounded px-2 py-0.5 outline-none flex-1 w-full"
  />
                            <button onClick={() => saveModuleTitle(module.id)} className="text-primary hover:text-secondary cursor-pointer"><CheckCircle className="w-5 h-5" /></button>
                            <button onClick={() => setEditingModuleId(null)} className="text-caption hover:text-red-500 cursor-pointer"><X className="w-5 h-5" /></button>
                          </div> : <h3 className="font-heading font-bold text-heading text-lg cursor-pointer" onClick={() => toggleModule(module.id)}>{module.title}</h3>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditModule(module.id, module.title)} className="p-2 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteModule(module.id)} className="p-2 text-caption hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button onClick={() => toggleModule(module.id)} className="p-2 text-caption hover:bg-gray-200 rounded-full transition-colors ml-2 cursor-pointer">
                      {expandedModules[module.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {
    /* Module Content */
  }
                  {expandedModules[module.id] && <div
    className="p-4 space-y-2 bg-white min-h-[50px]"
    onDragOver={handleDragOver}
    onDrop={(e) => handleDropOnModuleEnd(e, module.id)}
  >
                      {module.items.map((item, itemIndex) => <div
    key={item.id}
    draggable
    onDragStart={(e) => handleDragStart(e, module.id, itemIndex)}
    onDragEnd={handleDragEnd}
    onDragOver={handleDragOver}
    onDrop={(e) => {
      e.stopPropagation();
      handleDrop(e, module.id, itemIndex);
    }}
    className="flex items-center justify-between p-3 rounded-xl border border-border bg-gray-50/50 hover:bg-gray-50 transition-colors group cursor-default"
  >
                          <div className="flex items-center gap-3 flex-1 mr-4">
                            <GripVertical className="w-4 h-4 text-gray-300 cursor-grab hover:text-gray-500 shrink-0" />
                            {getItemIcon(item.type)}
                            {editingItemId === item.id ? <div className="flex items-center gap-2 flex-1">
                                <input
    type="text"
    value={editValue}
    onChange={(e) => setEditValue(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && saveItemTitle(module.id, item.id)}
    autoFocus
    className="text-sm font-bold text-heading border border-primary rounded px-2 py-0.5 outline-none flex-1 w-full"
  />
                                <button onClick={() => saveItemTitle(module.id, item.id)} className="text-primary hover:text-secondary shrink-0 cursor-pointer"><CheckCircle className="w-4 h-4" /></button>
                                <button onClick={() => setEditingItemId(null)} className="text-caption hover:text-red-500 shrink-0 cursor-pointer"><X className="w-4 h-4" /></button>
                              </div> : <div className="flex items-center gap-2 flex-1">
                                <span onClick={() => startEditItem(item.id, item.title)} className="text-sm font-bold text-heading hover:text-primary cursor-pointer" title="Click to edit name">{item.title}</span>
                                {item.status && <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                    {item.status}
                                  </span>}
                              </div>}
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-caption font-medium bg-white px-2 py-1 rounded border border-border shadow-sm">
                              {getItemMeta(item)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => {
    const route = item.type === "lesson" ? "lessons" : item.type === "quiz" ? "quizzes" : item.type === "assignment" ? "assignments" : item.type === "project" ? "projects" : "lessons";
    navigate(`/instructor/${route}`);
  }} title="Open Workspace" className="px-2 py-1 flex items-center gap-1 bg-white border border-border shadow-sm text-xs font-bold text-heading hover:text-primary hover:border-primary/30 rounded-lg transition-colors cursor-pointer">
                                <ExternalLink className="w-3.5 h-3.5" /> Workspace
                              </button>
                              <button onClick={() => startEditItem(item.id, item.title)} title="Edit Name" className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => duplicateItem(module.id, item)} title="Duplicate" className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteItem(module.id, item)} title="Delete" className="p-1.5 text-caption hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>)}

                      {
    /* Add New Item Dropdown within Module */
  }
                      <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => handleAddItem(module.id, "lesson")}
                          className="py-2.5 px-3 border-2 border-dashed border-border rounded-xl text-xs sm:text-sm font-bold text-caption hover:text-orange-600 hover:border-orange-500/50 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <PlaySquare className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>Add Lesson</span>
                        </button>

                        <button
                          onClick={() => handleAddItem(module.id, "quiz")}
                          className="py-2.5 px-3 border-2 border-dashed border-border rounded-xl text-xs sm:text-sm font-bold text-caption hover:text-blue-600 hover:border-blue-500/50 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>Add Quiz</span>
                        </button>

                        <button
                          onClick={() => handleAddItem(module.id, "assignment")}
                          className="py-2.5 px-3 border-2 border-dashed border-border rounded-xl text-xs sm:text-sm font-bold text-caption hover:text-emerald-600 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ClipboardList className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Add Task</span>
                        </button>

                        <button
                          onClick={() => handleAddItem(module.id, "project")}
                          className="py-2.5 px-3 border-2 border-dashed border-border rounded-xl text-xs sm:text-sm font-bold text-caption hover:text-purple-600 hover:border-purple-500/50 hover:bg-purple-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />
                          <span>Add Project</span>
                        </button>
                      </div>
                    </div>}
                </div>)}

              {
    /* Add New Module Button */
  }
              <button onClick={handleAddModule} className="w-full py-6 bg-white border border-border rounded-2xl shadow-sm text-heading font-bold hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Plus className="w-5 h-5" />
                </div>
                Add New Module
              </button>
            </>}
        </div>

        {
    /* Sidebar Panel for Course Completion */
  }
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sticky top-24">
            <h3 className="font-heading font-bold text-heading mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Course Setup
            </h3>
            
            <div className="space-y-3 mb-6">
              {setupSteps.map((step, idx) => <div key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                <span className={`text-sm font-medium ${step.done ? "text-heading" : "text-caption"}`}>{step.label}</span>
                </div>)}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-heading">Overall Completion</span>
                <span className="text-sm font-bold text-emerald-600">{completionPercent}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${completionPercent}%` }} />
              </div>

              {completionPercent === 100 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Course ready to submit for review</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs font-medium text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Complete setup to submit for review</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        expectedTitle={confirmModal.expectedTitle}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        confirmText="Permanently Delete"
        isDestructive={true}
      />
    </div>;
};
var stdin_default = InstructorCurriculum;
export {
  stdin_default as default
};
