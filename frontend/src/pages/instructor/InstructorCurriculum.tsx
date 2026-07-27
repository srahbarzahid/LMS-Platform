import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, GripVertical, 
  ChevronDown, ChevronUp, PlaySquare, 
  CheckSquare, ClipboardList, Briefcase,
  CheckCircle, X, ExternalLink, Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstructorCurriculum = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [selectedCourse, setSelectedCourse] = useState('Select Course: UI/UX Masterclass');
  
  // Editing state
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // DND state
  const [draggedItem, setDraggedItem] = useState<{moduleId: string, itemIndex: number} | null>(null);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    // Mock API Call
    setTimeout(() => {
      const initialModules = [
        {
          id: 'm1',
          title: 'Introduction to the Course',
          items: [
            { id: 'i1', type: 'lesson', title: 'Welcome and Course Overview', duration: '05:30', status: 'Published' },
            { id: 'i2', type: 'lesson', title: 'Setting Up Your Environment', duration: '12:45', status: 'Draft' },
            { id: 'i3', type: 'quiz', title: 'Environment Check Quiz', questions: 5, status: 'Draft' },
          ]
        },
        {
          id: 'm2',
          title: 'Core Concepts & Fundamentals',
          items: [
            { id: 'i4', type: 'lesson', title: 'Understanding the Basics', duration: '18:20', status: 'Draft' },
            { id: 'i5', type: 'assignment', title: 'First Coding Exercise', points: 100, status: 'Draft' },
            { id: 'i6', type: 'project', title: 'Mini Project: Todo App', points: 200, status: 'Draft' },
          ]
        }
      ];
      setModules(initialModules);
      
      // Expand all by default
      const expandState: Record<string, boolean> = {};
      initialModules.forEach(m => expandState[m.id] = true);
      setExpandedModules(expandState);
      
      setLoading(false);
    }, 600);
  }, []);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    const newModules = [...modules];
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    }
    setModules(newModules);
  };

  // --- CRUD Handlers --- //

  const handleAddModule = () => {
    const newModule = {
      id: `m${Date.now()}`,
      title: 'New Module',
      items: []
    };
    setModules([...modules, newModule]);
    setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
    startEditModule(newModule.id, newModule.title);
  };

  const startEditModule = (id: string, title: string) => {
    setEditingItemId(null);
    setEditingModuleId(id);
    setEditValue(title);
  };

  const saveModuleTitle = (id: string) => {
    if (!editValue.trim()) return;
    setModules(modules.map(m => m.id === id ? { ...m, title: editValue } : m));
    setEditingModuleId(null);
  };

  const deleteModule = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Module',
      message: 'Are you sure you want to delete this module? All lessons and quizzes inside it will be permanently lost.',
      onConfirm: () => {
        setModules(modules.filter(m => m.id !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const duplicateItem = (moduleId: string, item: any) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        const itemIndex = m.items.findIndex((i:any) => i.id === item.id);
        const newItem = { ...item, id: `i${Date.now()}`, title: `${item.title} (Copy)`, status: 'Draft' };
        const newItems = [...m.items];
        newItems.splice(itemIndex + 1, 0, newItem);
        return { ...m, items: newItems };
      }
      return m;
    }));
  };

  const startEditItem = (id: string, title: string) => {
    setEditingModuleId(null);
    setEditingItemId(id);
    setEditValue(title);
  };

  const saveItemTitle = (moduleId: string, itemId: string) => {
    if (!editValue.trim()) return;
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          items: m.items.map((i:any) => i.id === itemId ? { ...i, title: editValue } : i)
        };
      }
      return m;
    }));
    setEditingItemId(null);
  };

  const deleteItem = (moduleId: string, itemId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: () => {
        setModules(modules.map(m => {
          if (m.id === moduleId) {
            return { ...m, items: m.items.filter((i:any) => i.id !== itemId) };
          }
          return m;
        }));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddItem = (moduleId: string, type: 'lesson' | 'quiz' | 'assignment' | 'project') => {
    const newItem = {
      id: `i${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      status: 'Draft',
      ...(type === 'lesson' ? { duration: '00:00' } : type === 'quiz' ? { questions: 0 } : { points: 100 })
    };
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, items: [...m.items, newItem] };
      }
      return m;
    }));
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
    startEditItem(newItem.id, newItem.title); // Keep inline edit just for naming the newly created placeholder
  };

  // --- Drag and Drop Handlers --- //

  const handleDragStart = (e: React.DragEvent, moduleId: string, itemIndex: number) => {
    setDraggedItem({ moduleId, itemIndex });
    // Make dragged element slightly transparent
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetModuleId: string, targetItemIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const sourceModuleId = draggedItem.moduleId;
    const sourceItemIndex = draggedItem.itemIndex;

    if (sourceModuleId === targetModuleId && sourceItemIndex === targetItemIndex) {
      return; 
    }

    setModules(prev => {
      const newModules = JSON.parse(JSON.stringify(prev));
      const sourceModule = newModules.find((m:any) => m.id === sourceModuleId);
      const targetModule = newModules.find((m:any) => m.id === targetModuleId);

      const [movedItem] = sourceModule.items.splice(sourceItemIndex, 1);
      targetModule.items.splice(targetItemIndex, 0, movedItem);

      return newModules;
    });
  };

  const handleDropOnModuleEnd = (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    const targetModule = modules.find(m => m.id === targetModuleId);
    if (!targetModule) return;
    handleDrop(e, targetModuleId, targetModule.items.length);
  };

  // --- Render Helpers --- //

  const getItemIcon = (type: string) => {
    switch(type) {
      case 'lesson': return <PlaySquare className="w-4 h-4 text-orange-500" />;
      case 'quiz': return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case 'assignment': return <ClipboardList className="w-4 h-4 text-green-500" />;
      case 'project': return <Briefcase className="w-4 h-4 text-purple-500" />;
      default: return <PlaySquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getItemMeta = (item: any) => {
    if (item.type === 'lesson') return item.duration;
    if (item.type === 'quiz') return `${item.questions} Questions`;
    if (item.type === 'assignment' || item.type === 'project') return `${item.points} Points`;
    return '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-heading">Curriculum Builder</h1>
          <p className="text-body mt-1">Organize your course structure by creating modules and placeholders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group/course z-50">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-heading shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <span>{selectedCourse}</span>
              <ChevronDown className="w-4 h-4 text-caption ml-1 group-hover/course:rotate-180 transition-transform" />
            </div>
            
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 invisible group-hover/course:opacity-100 group-hover/course:visible transition-all py-2 origin-top-right">
              {['Select Course: UI/UX Masterclass', 'Advanced React Architecture'].map(course => (
                <button 
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    selectedCourse === course 
                      ? 'bg-primary/5 text-primary font-bold' 
                      : 'text-body hover:bg-gray-50 hover:text-heading'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Builder Area */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="flex py-20 items-center justify-center bg-white rounded-2xl border border-border">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {modules.map((module, index) => (
                <div key={module.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden transition-all">
                  
                  {/* Module Header */}
                  <div className="bg-gray-50 p-4 border-b border-border flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveModule(index, 'up')} disabled={index === 0} className="text-caption hover:text-heading disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveModule(index, 'down')} disabled={index === modules.length - 1} className="text-caption hover:text-heading disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer" onClick={() => toggleModule(module.id)}>Module {index + 1}:</span>
                        {editingModuleId === module.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input 
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && saveModuleTitle(module.id)}
                              autoFocus
                              className="font-heading font-bold text-heading text-lg border border-primary rounded px-2 py-0.5 outline-none flex-1 w-full"
                            />
                            <button onClick={() => saveModuleTitle(module.id)} className="text-primary hover:text-secondary cursor-pointer"><CheckCircle className="w-5 h-5"/></button>
                            <button onClick={() => setEditingModuleId(null)} className="text-caption hover:text-red-500 cursor-pointer"><X className="w-5 h-5"/></button>
                          </div>
                        ) : (
                          <h3 className="font-heading font-bold text-heading text-lg cursor-pointer" onClick={() => toggleModule(module.id)}>{module.title}</h3>
                        )}
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

                  {/* Module Content */}
                  {expandedModules[module.id] && (
                    <div 
                      className="p-4 space-y-2 bg-white min-h-[50px]"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnModuleEnd(e, module.id)}
                    >
                      {module.items.map((item: any, itemIndex: number) => (
                        <div 
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
                            {editingItemId === item.id ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input 
                                  type="text"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && saveItemTitle(module.id, item.id)}
                                  autoFocus
                                  className="text-sm font-bold text-heading border border-primary rounded px-2 py-0.5 outline-none flex-1 w-full"
                                />
                                <button onClick={() => saveItemTitle(module.id, item.id)} className="text-primary hover:text-secondary shrink-0 cursor-pointer"><CheckCircle className="w-4 h-4"/></button>
                                <button onClick={() => setEditingItemId(null)} className="text-caption hover:text-red-500 shrink-0 cursor-pointer"><X className="w-4 h-4"/></button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-sm font-bold text-heading">{item.title}</span>
                                {item.status && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {item.status}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-caption font-medium bg-white px-2 py-1 rounded border border-border shadow-sm">
                              {getItemMeta(item)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button onClick={() => {
                                const route = item.type === 'lesson' ? 'lessons' : 
                                              item.type === 'quiz' ? 'quizzes' : 
                                              item.type === 'assignment' ? 'assignments' : 
                                              item.type === 'project' ? 'projects' : 'lessons';
                                navigate(`/instructor/${route}`);
                              }} title="Open Workspace" className="px-2 py-1 flex items-center gap-1 bg-white border border-border shadow-sm text-xs font-bold text-heading hover:text-primary hover:border-primary/30 rounded-lg transition-colors cursor-pointer">
                                <ExternalLink className="w-3.5 h-3.5" /> Workspace
                              </button>
                              <button onClick={() => duplicateItem(module.id, item)} title="Duplicate" className="p-1.5 text-caption hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteItem(module.id, item.id)} title="Delete" className="p-1.5 text-caption hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Item Dropdown within Module */}
                      <div className="pt-2 flex items-center gap-2">
                        <button onClick={() => handleAddItem(module.id, 'lesson')} className="flex-1 py-2 border-2 border-dashed border-border rounded-xl text-sm font-bold text-caption hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                          <PlaySquare className="w-4 h-4" /> Add Lesson
                        </button>
                        <button onClick={() => handleAddItem(module.id, 'quiz')} className="flex-1 py-2 border-2 border-dashed border-border rounded-xl text-sm font-bold text-caption hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer hidden sm:flex">
                          <CheckSquare className="w-4 h-4" /> Add Quiz
                        </button>
                        <button onClick={() => handleAddItem(module.id, 'assignment')} className="flex-1 py-2 border-2 border-dashed border-border rounded-xl text-sm font-bold text-caption hover:text-green-500 hover:border-green-500/50 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 cursor-pointer hidden sm:flex">
                          <ClipboardList className="w-4 h-4" /> Add Task
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Module Button */}
              <button onClick={handleAddModule} className="w-full py-6 bg-white border border-border rounded-2xl shadow-sm text-heading font-bold hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Plus className="w-5 h-5" />
                </div>
                Add New Module
              </button>
            </>
          )}
        </div>

        {/* Sidebar Panel for Course Completion */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sticky top-24">
            <h3 className="font-heading font-bold text-heading mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Course Setup
            </h3>
            
            <div className="space-y-3 mb-6">
              {[
                { label: 'Basic Information', done: true },
                { label: 'Media', done: true },
                { label: 'Pricing', done: true },
                { label: 'Details', done: true },
                { label: 'Curriculum Modules', done: modules.length > 0 },
                { label: 'Lessons Added', done: modules.some(m => m.items.some((i:any) => i.type === 'lesson')) },
                { label: 'Videos Uploaded', done: false },
                { label: 'Resources Attached', done: false },
                { label: 'Quizzes Created', done: false },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-medium ${step.done ? 'text-heading' : 'text-caption'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-heading">Overall Completion</span>
                <span className="text-sm font-bold text-primary">60%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <button disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-bold transition-colors cursor-not-allowed">
              Submit for Review
            </button>
            <p className="text-xs text-caption mt-3 text-center">Complete all required steps to publish</p>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md border border-border animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-heading mb-1">{confirmModal.title}</h3>
                <p className="text-body text-sm mb-6 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2 text-sm font-bold text-caption hover:text-heading hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="px-5 py-2 text-sm font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCurriculum;
