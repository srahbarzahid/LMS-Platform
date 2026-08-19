import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  PlaySquare,
  CheckCircle,
  Clock,
  Settings2,
  ChevronRight,
  ChevronDown,
  ListTree,
  CheckSquare,
  FileSignature,
  Save,
  Plus,
  Trash2,
  GripVertical,
  AlertCircle,
  X,
  Eye
} from "lucide-react";
import { instructorApi } from "../../api/instructorApi";
import { getApiErrorMessage } from "../../api/client";
import ConfirmModal from "../../components/common/ConfirmModal";

const emptyQuestion = {
  id: "q1",
  question: "New Question",
  options: ["Option 1", "Option 2"],
  correctOption: 0
};

const InstructorQuizzes = () => {
  const [courseTree, setCourseTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion]);
  const [marksPerQuestion, setMarksPerQuestion] = useState(10);
  const [passingMarks, setPassingMarks] = useState(20);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const totalMarks = (Number(marksPerQuestion) || 0) * questions.length;

  const selectedCourse = useMemo(
    () => courseTree.find((course) => course.id === selectedCourseId) || courseTree[0],
    [courseTree, selectedCourseId]
  );
  const selectedQuiz = useMemo(() => {
    return selectedCourse?.modules?.flatMap((module) => module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title }))).find((item) => item.id === selectedItemId);
  }, [selectedCourse, selectedItemId]);

  const selectQuiz = (item) => {
    setSelectedItemId(item.id);
    setQuizTitle(item.title || "");
    const qList = Array.isArray(item.questions)
      ? item.questions
      : Array.isArray(item.questionList)
      ? item.questionList
      : [];
    const initialQuestions = qList.length ? qList : [emptyQuestion];
    setQuestions(initialQuestions);

    const mpq = typeof item.marksPerQuestion === "number" ? item.marksPerQuestion : 10;
    setMarksPerQuestion(mpq);
    const tot = mpq * initialQuestions.length;
    setPassingMarks(typeof item.passingMarks === "number" ? item.passingMarks : Math.round(tot * 0.6));
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
        const firstQuiz = firstCourse?.modules?.flatMap((module) => module.lessons.map((item) => ({ ...item, moduleId: module.id, moduleTitle: module.title }))).find((item) => item.type === "quiz");
        if (firstQuiz) selectQuiz(firstQuiz);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load quiz workspace"));
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
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q${Date.now()}`,
        question: "New Question",
        options: ["Option 1", "Option 2"],
        correctOption: 0
      }
    ]);
  };
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };
  const updateQuestion = (id, text) => {
    setQuestions(questions.map((q) => q.id === id ? { ...q, question: text } : q));
  };
  const addOption = (questionId) => {
    setQuestions(questions.map((q) => {
      if (q.id === questionId && q.options.length < 6) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };
  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map((q) => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = [...q.options];
        newOptions.splice(optionIndex, 1);
        let newCorrect = q.correctOption;
        if (newCorrect === optionIndex) newCorrect = 0;
        else if (newCorrect > optionIndex) newCorrect--;
        return { ...q, options: newOptions, correctOption: newCorrect };
      }
      return q;
    }));
  };
  const updateOption = (questionId, optionIndex, text) => {
    setQuestions(questions.map((q) => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  const setCorrectOption = (questionId, optionIndex) => {
    setQuestions(questions.map((q) => q.id === questionId ? { ...q, correctOption: optionIndex } : q));
  };
  const handleSaveQuiz = async () => {
    if (!selectedQuiz) {
      toast.error("Select a quiz from your curriculum first");
      return;
    }

    try {
      const mpq = Number(marksPerQuestion) || 10;
      const passM = Number(passingMarks) || 0;

      const response = await instructorApi.updateQuiz(selectedQuiz.id, {
        title: quizTitle,
        courseId: selectedCourse.id,
        moduleId: selectedQuiz.moduleId,
        questions,
        marksPerQuestion: mpq,
        passingMarks: passM
      });
      const resData = response.data?.data || response.data || {};
      const updatedQuestions = Array.isArray(resData.questions)
        ? resData.questions
        : questions;

      setQuestions(updatedQuestions.length ? updatedQuestions : [emptyQuestion]);

      setCourseTree((prev) =>
        prev.map((course) => ({
          ...course,
          modules: course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((item) =>
              item.id === selectedQuiz.id
                ? {
                    ...item,
                    title: quizTitle,
                    questions: updatedQuestions,
                    questionCount: updatedQuestions.length,
                    marksPerQuestion: mpq,
                    totalMarks: mpq * updatedQuestions.length,
                    passingMarks: passM
                  }
                : item
            )
          }))
        }))
      );

      toast.success("Quiz saved");
      setShowPreviewModal(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save quiz"));
    }
  };
  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      await instructorApi.deleteQuiz(selectedQuiz.id);
      setSelectedItemId("");
      setQuizTitle("");
      setQuestions([emptyQuestion]);
      setCourseTree((prev) => prev.map((course) => ({
        ...course,
        modules: course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.filter((item) => item.id !== selectedQuiz.id)
        }))
      })));
      setShowDeleteModal(false);
      toast.success("Quiz deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete quiz"));
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
          <h1 className="text-2xl font-heading font-bold text-heading">Quiz Workspace</h1>
          <p className="text-sm text-caption mt-1">Select a quiz from the curriculum to edit its questions.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setShowPreviewModal(true)} className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={handleSaveQuiz} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
            <Save className="w-4 h-4" /> Save Quiz
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
    const isQuiz = item.type === "quiz";
    return <div
      key={item.id}
      onClick={() => {
        if (isQuiz) selectQuiz({ ...item, moduleId: module.id, moduleTitle: module.title });
      }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative
                            ${isActive ? "bg-blue-50 border border-blue-200 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full cursor-pointer" : isQuiz ? "hover:bg-gray-50 border border-transparent cursor-pointer" : "opacity-50 cursor-not-allowed border border-transparent"}`}
    >
                          {isQuiz ? <CheckSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : "text-caption"}`} /> : <PlaySquare className="w-4 h-4 shrink-0 text-gray-400" />}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm truncate ${isActive ? "font-bold text-blue-600" : "font-medium text-body"}`}>
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
            <span>{selectedQuiz?.moduleTitle || "Module"}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-blue-600">{quizTitle || "Select a quiz"}</span>
          </div>

          {
    /* Quiz Information Section */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSignature className="w-5 h-5 text-blue-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Quiz Information</h2>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-heading uppercase tracking-wider">Active</span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Quiz Title</label>
                <input
    type="text"
    value={quizTitle}
    onChange={(e) => setQuizTitle(e.target.value)}
    className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
  />
              </div>
            </div>
          </div>

          {
    /* Questions Builder Section */
  }
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-blue-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Questions ({questions.length})</h2>
              </div>
              <button onClick={addQuestion} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
            <div className="p-6 space-y-6">
              {questions.map((q, qIdx) => <div key={q.id || qIdx} className="border border-border rounded-2xl p-5 space-y-4 bg-gray-50/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <GripVertical className="w-4 h-4 text-gray-300" />
                      <span className="text-sm font-bold text-blue-600">Q{qIdx + 1}.</span>
                      <input
    type="text"
    value={q.question}
    onChange={(e) => updateQuestion(q.id, e.target.value)}
    placeholder="Enter your question text..."
    className="flex-1 bg-white border border-border rounded-xl px-4 py-2 text-sm font-bold text-heading outline-none focus:border-blue-500 transition-colors"
  />
                    </div>
                    {questions.length > 1 && <button onClick={() => deleteQuestion(q.id)} className="text-caption hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>}
                  </div>

                  {
    /* Options list */
  }
                  <div className="pl-6 space-y-2">
                    <label className="text-xs font-bold text-caption uppercase tracking-wider block mb-1">Answer Options (Select the radio button for the correct answer)</label>
                    {q.options.map((opt, oIdx) => <div key={oIdx} className="flex items-center gap-3">
                        <input
    type="radio"
    name={`correct-${q.id}`}
    checked={q.correctOption === oIdx}
    onChange={() => setCorrectOption(q.id, oIdx)}
    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
  />
                        <input
    type="text"
    value={opt}
    onChange={(e) => updateOption(q.id, oIdx, e.target.value)}
    className={`flex-1 bg-white border rounded-xl px-3 py-1.5 text-sm outline-none transition-colors ${q.correctOption === oIdx ? "border-green-500 font-medium bg-green-50/30" : "border-border"}`}
  />
                        {q.options.length > 2 && <button onClick={() => removeOption(q.id, oIdx)} className="text-caption hover:text-red-500 p-1 cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>}
                      </div>)}
                    
                    {q.options.length < 6 && <button onClick={() => addOption(q.id)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> Add Option
                      </button>}
                  </div>
                </div>)}
            </div>
          </div>

          {/* Quiz Marks & Grading Settings */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-gray-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Quiz Marks & Grading</h2>
              </div>
              <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700">
                Total: {totalMarks} Marks
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Marks Per Question</label>
                <input
                  type="number"
                  value={marksPerQuestion}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 0);
                    setMarksPerQuestion(val);
                  }}
                  min="1"
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-caption">Marks assigned to each question</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Total Calculated Marks</label>
                <div className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-heading flex items-center justify-between">
                  <span>{totalMarks} Marks</span>
                  <span className="text-xs text-caption font-medium">({questions.length} × {marksPerQuestion})</span>
                </div>
                <p className="text-xs text-caption">Auto-computed ({questions.length} Question{questions.length === 1 ? "" : "s"})</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Minimum Passing Marks</label>
                <input
                  type="number"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(Math.max(0, Number(e.target.value) || 0))}
                  min="0"
                  max={totalMarks}
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-caption">Marks required out of {totalMarks} to pass</p>
              </div>
            </div>
          </div>

          {/* Bottom Save Action Section */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-heading text-base">Save your quiz changes</h3>
              <p className="text-xs text-caption">Save all questions, option choices, and passing criteria.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSaveQuiz}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Quiz
              </button>
            </div>
          </div>

          {
    /* Danger Zone */
  }
          <div className="bg-red-50/30 rounded-2xl border border-red-200 shadow-sm overflow-hidden">
             <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-heading text-red-600 mb-1">Delete Quiz</h3>
                 <p className="text-sm text-red-800/70">Once you delete this quiz, there is no going back. All student progress will be lost.</p>
               </div>
               <button onClick={() => setShowDeleteModal(true)} className="flex shrink-0 items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:border-red-300 shadow-sm transition-colors cursor-pointer">
                 <Trash2 className="w-4 h-4" /> Delete Quiz
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>

    <ConfirmModal
      isOpen={showDeleteModal}
      title="Confirm Quiz Deletion"
      message="This action cannot be undone. To permanently delete this quiz, please type its exact title below."
      expectedTitle={selectedQuiz?.title || quizTitle}
      onConfirm={handleDeleteQuiz}
      onCancel={() => setShowDeleteModal(false)}
      confirmText="Permanently Delete"
      isDestructive={true}
    />

    {/* Student Quiz Preview Modal */}
    {showPreviewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-border">
          <div className="p-6 border-b border-border bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-heading">Student Quiz Preview</h3>
                <p className="text-xs text-caption">Live preview of how students will see this quiz</p>
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
              <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase bg-blue-50 text-blue-600">
                Quiz Assessment
              </span>
              <h2 className="text-2xl font-heading font-bold text-heading mt-2">{quizTitle || "Untitled Quiz"}</h2>
              <p className="text-xs text-caption mt-1">
                {questions.length} Questions • {totalMarks} Total Marks ({marksPerQuestion} marks/question) • Pass: {passingMarks}/{totalMarks} Marks
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="p-5 rounded-2xl border border-border bg-gray-50/50 space-y-3">
                  <h4 className="text-sm font-bold text-heading">
                    {idx + 1}. {q.question || "Untitled Question"}
                  </h4>
                  <div className="space-y-2 pl-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium ${
                          q.correctOption === oIdx
                            ? "bg-green-50 border-green-300 text-green-800"
                            : "bg-white border-border text-body"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            q.correctOption === oIdx ? "border-green-600 bg-green-600" : "border-gray-300"
                          }`}
                        >
                          {q.correctOption === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span>{opt}</span>
                        {q.correctOption === oIdx && (
                          <span className="ml-auto text-xs font-bold text-green-600 uppercase">Correct Answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
var stdin_default = InstructorQuizzes;
export {
  stdin_default as default
};
