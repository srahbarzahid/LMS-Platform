import { useState } from 'react';
import { 
  PlaySquare, CheckCircle, 
  Clock, Settings2,
  ChevronRight, ChevronDown, ListTree,
  CheckSquare, FileSignature, Save, 
  Plus, Trash2, GripVertical, AlertCircle, X,
  Eye
} from 'lucide-react';

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
    ]
  }
];

const InstructorQuizzes = () => {
  // State
  const [selectedCourse] = useState('Select Course: UI/UX Masterclass');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ 'm1': true, 'm2': true });
  const [selectedItemId, setSelectedItemId] = useState<string>('i3');
  
  // Quiz State
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      question: 'Which of the following is true about React?',
      options: ['It is a framework', 'It is a library', 'It is a database', 'It is an OS'],
      correctOption: 1 // 0-indexed
    }
  ]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q${Date.now()}`,
        question: 'New Question',
        options: ['Option 1', 'Option 2'],
        correctOption: 0
      }
    ]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, question: text } : q));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length < 6) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
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

  const updateOption = (questionId: string, optionIndex: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const setCorrectOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, correctOption: optionIndex } : q));
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm sticky top-0 z-30 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Quiz Workspace</h1>
          <p className="text-sm text-caption mt-1">Select a quiz from the curriculum to edit its questions.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-border text-heading px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-secondary transition-colors cursor-pointer">
            <Save className="w-4 h-4" /> Save Quiz
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
                      const isQuiz = item.type === 'quiz';
                      return (
                        <div 
                          key={item.id}
                          onClick={() => { if(isQuiz) setSelectedItemId(item.id); }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative
                            ${isActive 
                              ? 'bg-blue-50 border border-blue-200 before:absolute before:left-[-9px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full cursor-pointer' 
                              : isQuiz 
                                ? 'hover:bg-gray-50 border border-transparent cursor-pointer' 
                                : 'opacity-50 cursor-not-allowed border border-transparent'
                            }`}
                        >
                          {isQuiz ? (
                            <CheckSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-500' : 'text-caption'}`} />
                          ) : (
                            <PlaySquare className="w-4 h-4 shrink-0 text-gray-400" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm truncate ${isActive ? 'font-bold text-blue-600' : 'font-medium text-body'}`}>
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
        <div className="flex-1 max-w-4xl space-y-8">
          
          {/* Context Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-caption bg-white border border-border px-4 py-3 rounded-xl shadow-sm">
            <ListTree className="w-4 h-4" />
            <span>UI/UX Masterclass</span>
            <ChevronRight className="w-3 h-3" />
            <span>Module 1</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-blue-600">Environment Check Quiz</span>
          </div>

          {/* Quiz Info Section */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSignature className="w-5 h-5 text-blue-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Quiz Settings</h2>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-xs font-bold text-heading uppercase tracking-wider">Draft</span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Quiz Title</label>
                <input 
                  type="text" 
                  defaultValue="Environment Check Quiz"
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Instructions</label>
                <textarea 
                  rows={2}
                  placeholder="Briefly describe what this quiz covers..."
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors resize-none custom-scrollbar"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-5 border-t border-border mt-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-caption uppercase tracking-wider">Total Questions</span>
                  <p className="text-lg font-bold text-blue-600">{questions.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-caption uppercase tracking-wider">Estimated Time</span>
                  <div className="flex items-center gap-2 mt-1">
                     <Clock className="w-4 h-4 text-orange-500" />
                     <span className="text-sm text-heading">{questions.length * 2} mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h2 className="font-heading font-bold text-lg text-heading">Questions ({questions.length})</h2>
              </div>
              <button onClick={addQuestion} className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="border border-border rounded-xl overflow-hidden bg-gray-50/30">
                  <div className="flex items-start gap-3 p-4 border-b border-border bg-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <textarea 
                        value={q.question}
                        onChange={(e) => updateQuestion(q.id, e.target.value)}
                        placeholder="Type your question here..."
                        rows={2}
                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none font-medium text-heading"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="p-1.5 text-caption hover:text-gray-700 hover:bg-gray-200 rounded transition-colors cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteQuestion(q.id)} disabled={questions.length === 1} className="p-1.5 text-caption hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs font-bold text-caption uppercase tracking-wider mb-2 flex items-center gap-2">
                      Answers <span className="normal-case text-gray-400 font-normal">(Select the correct one)</span>
                    </p>
                    
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-3">
                        <div 
                          onClick={() => setCorrectOption(q.id, optIdx)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-colors shrink-0
                            ${q.correctOption === optIdx ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 hover:border-green-500'}`}
                        >
                          {q.correctOption === optIdx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input 
                          type="text" 
                          value={opt}
                          onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className={`flex-1 bg-white border rounded-lg px-3 py-2 text-sm outline-none transition-colors
                            ${q.correctOption === optIdx ? 'border-green-200 bg-green-50/30 font-medium' : 'border-border focus:border-blue-500'}`}
                        />
                        <button 
                          onClick={() => removeOption(q.id, optIdx)}
                          disabled={q.options.length <= 2}
                          className="p-2 text-caption hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {q.options.length < 6 && (
                      <button onClick={() => addOption(q.id)} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 cursor-pointer ml-8">
                        <Plus className="w-4 h-4" /> Add Option
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <AlertCircle className="w-10 h-10 text-caption mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-heading">No questions yet</h3>
                  <p className="text-sm text-caption mb-4">Add your first question to get started.</p>
                  <button onClick={addQuestion} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    Add Question
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-border px-6 py-4 flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-gray-500" />
              <h2 className="font-heading font-bold text-lg text-heading">Passing Grade</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-w-xs">
                <label className="text-sm font-bold text-heading">Minimum score to pass (%)</label>
                <input 
                  type="number" 
                  defaultValue="80"
                  min="0"
                  max="100"
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/30 rounded-2xl border border-red-200 shadow-sm overflow-hidden mt-8">
             <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                 <h3 className="font-bold text-heading text-red-600 mb-1">Delete Quiz</h3>
                 <p className="text-sm text-red-800/70">Once you delete this quiz, there is no going back. All student progress will be lost.</p>
               </div>
               <button className="flex shrink-0 items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 hover:border-red-300 shadow-sm transition-colors cursor-pointer">
                 <Trash2 className="w-4 h-4" /> Delete Quiz
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InstructorQuizzes;
