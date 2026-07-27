import { useState, useMemo } from 'react';
import { Search, Filter, PlayCircle, CheckCircle2, Clock, Calendar, RefreshCcw, FileText, BarChart2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const mockQuizzes = [
  {
    id: 1,
    title: 'Embedded Systems Basics',
    course: 'Mastering Embedded Systems & IoT',
    module: 'Module 1: Introduction',
    questions: 15,
    totalMarks: 30,
    passingMarks: 20,
    timeLimit: '30 mins',
    allowedAttempts: 2,
    attemptsUsed: 0,
    dueDate: '2026-07-10T23:59:59Z',
    status: 'Not Started', // Not Started, In Progress, Completed, Expired
  },
  {
    id: 2,
    title: 'Kinematics & Dynamics',
    course: 'Introduction to Robotics',
    module: 'Module 3: Kinematics',
    questions: 20,
    totalMarks: 40,
    passingMarks: 25,
    timeLimit: '45 mins',
    allowedAttempts: 1,
    attemptsUsed: 1,
    dueDate: '2026-07-01T23:59:59Z',
    status: 'Completed',
    score: 35,
  },
  {
    id: 3,
    title: 'React Native Navigation',
    course: 'Advanced React Native',
    module: 'Module 5: Advanced Routing',
    questions: 10,
    totalMarks: 20,
    passingMarks: 15,
    timeLimit: '20 mins',
    allowedAttempts: 3,
    attemptsUsed: 1,
    dueDate: '2026-07-15T23:59:59Z',
    status: 'In Progress',
  },
  {
    id: 4,
    title: 'Wireframing Principles',
    course: 'UI/UX Design Masterclass',
    module: 'Module 2: Wireframing',
    questions: 10,
    totalMarks: 10,
    passingMarks: 7,
    timeLimit: '15 mins',
    allowedAttempts: 1,
    attemptsUsed: 1,
    dueDate: '2026-06-20T23:59:59Z',
    status: 'Expired',
  },
];

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [sortBy, setSortBy] = useState('Due Date');

  const courses = ['All Courses', ...Array.from(new Set(mockQuizzes.map(q => q.course)))];
  const statuses = ['All', 'Not Started', 'In Progress', 'Completed', 'Expired'];

  const filteredQuizzes = useMemo(() => {
    let result = mockQuizzes.filter(quiz => {
      if (statusFilter !== 'All' && quiz.status !== statusFilter) return false;
      if (courseFilter !== 'All Courses' && quiz.course !== courseFilter) return false;
      if (searchQuery && !quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'Due Date') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'Course Name') {
        return a.course.localeCompare(b.course);
      }
      return 0; // Recently Added mock logic
    });

    return result;
  }, [searchQuery, statusFilter, courseFilter, sortBy]);

  // Calculate stats
  const totalQuizzes = mockQuizzes.length;
  const pendingQuizzes = mockQuizzes.filter(q => q.status === 'Not Started' || q.status === 'In Progress').length;
  const completedQuizzes = mockQuizzes.filter(q => q.status === 'Completed').length;
  
  const completedScores = mockQuizzes.filter(q => q.status === 'Completed' && q.score);
  const avgScore = completedScores.length > 0 
    ? Math.round(completedScores.reduce((acc, q) => acc + ((q.score! / q.totalMarks) * 100), 0) / completedScores.length)
    : 0;

  const handleAction = (quizId: number, status: string) => {
    if (status === 'Completed' || status === 'Expired') {
      navigate(`/student/quiz-result/${quizId}`);
    } else {
      navigate(`/student/quiz-player/${quizId}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Not Started': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-heading">My Quizzes</h1>
        <p className="text-body mt-2 mb-8">View and complete quizzes from your enrolled courses.</p>
        
        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="w-4 h-4 text-caption absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
            <div className="relative">
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
              >
                {courses.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary cursor-pointer"
              >
                <option value="Recently Added">Recently Added</option>
                <option value="Due Date">Due Date</option>
                <option value="Course Name">Course Name</option>
              </select>
              <Filter className="w-4 h-4 text-caption absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Total Quizzes</div>
            <div className="text-2xl font-heading font-bold text-heading">{totalQuizzes}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Pending</div>
            <div className="text-2xl font-heading font-bold text-heading">{pendingQuizzes}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Completed</div>
            <div className="text-2xl font-heading font-bold text-heading">{completedQuizzes}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-caption font-medium mb-1">Avg. Score</div>
            <div className="text-2xl font-heading font-bold text-heading">{avgScore}%</div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-3xl border border-border shadow-sm p-6 flex flex-col hover:shadow-lg transition-shadow">
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getStatusBadge(quiz.status)}`}>
                  {quiz.status}
                </span>
                <span className="text-xs text-caption flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(quiz.dueDate).toLocaleDateString()}
                </span>
              </div>

              {/* Title & Course */}
              <h3 className="font-heading font-bold text-heading text-lg mb-1 leading-tight line-clamp-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-primary font-medium mb-1 line-clamp-1">{quiz.course}</p>
              <p className="text-xs text-caption mb-5 line-clamp-1">{quiz.module}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-body mb-6 bg-gray-50 p-4 rounded-2xl mt-auto">
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption">Questions</span>
                  <span className="font-bold text-heading">{quiz.questions}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption">Marks</span>
                  <span className="font-bold text-heading">{quiz.passingMarks} / {quiz.totalMarks} to pass</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption">Time Limit</span>
                  <span className="font-bold text-heading">{quiz.timeLimit}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption">Attempts</span>
                  <span className="font-bold text-heading">{quiz.attemptsUsed} / {quiz.allowedAttempts} used</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border mt-auto">
                {quiz.status === 'Not Started' && (
                  <button 
                    onClick={() => handleAction(quiz.id, quiz.status)}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Quiz
                  </button>
                )}

                {quiz.status === 'In Progress' && (
                  <button 
                    onClick={() => handleAction(quiz.id, quiz.status)}
                    className="w-full py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" /> Continue Quiz
                  </button>
                )}

                {(quiz.status === 'Completed' || quiz.status === 'Expired') && (
                  <button 
                    onClick={() => handleAction(quiz.id, quiz.status)}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-heading border border-border rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {quiz.status === 'Completed' ? 'View Result' : 'View Details'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-border p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-caption" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-heading mb-2">
            {searchQuery ? 'No matching quizzes found' : "You don't have any quizzes yet."}
          </h2>
          <p className="text-body max-w-md mx-auto mb-8">
            {searchQuery 
              ? 'Try adjusting your search or filters to see more results.' 
              : 'Enroll in courses that offer quizzes to test your knowledge.'}
          </p>
          {!searchQuery && (
            <Link to="/courses" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20">
              Browse Courses
            </Link>
          )}
        </div>
      )}

    </div>
  );
};

export default StudentQuizzes;
