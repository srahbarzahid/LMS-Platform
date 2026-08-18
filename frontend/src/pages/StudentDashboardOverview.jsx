import { BookOpen, Clock, Award, CheckCircle2, Flame, FileText, Bell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardAnnouncements from "../components/DashboardAnnouncements";
const StudentDashboardOverview = () => {
  return <div className="flex flex-col gap-8 pb-8">
      <DashboardAnnouncements endpoint="/student/announcements" />
      
      {
    /* Top Section: Welcome & Stats */
  }
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {
    /* Welcome Banner */
  }
        <div className="xl:col-span-2 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
          {
    /* Background decorative elements */
  }
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2" />
          
          <div className="relative z-10 mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2 text-white">Welcome back, Alex 👋</h1>
            <p className="text-gray-400 max-w-md">You've completed 85% of your weekly goal. Keep going to hit 20 learning hours!</p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <Link to="/student/course-player/1" className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20">
              Continue Learning
            </Link>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-orange-500 flex items-center justify-center mb-2 bg-gray-800/50 backdrop-blur-sm">
                  <span className="font-bold sm:text-lg">32</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">Current streak</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-blue-500 flex items-center justify-center mb-2 bg-gray-800/50 backdrop-blur-sm">
                  <span className="font-bold sm:text-lg">126</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">Learning hours</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-emerald-500 flex items-center justify-center mb-2 bg-gray-800/50 backdrop-blur-sm">
                  <span className="font-bold sm:text-lg">3.6K</span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400">XP points</span>
              </div>
            </div>
          </div>
        </div>

        {
    /* 4 Stat Cards */
  }
        <div className="xl:col-span-1 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Enrolled</span>
            </div>
            <div className="text-2xl font-bold text-heading">24</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Completed</span>
            </div>
            <div className="text-2xl font-bold text-heading">06</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Learning Hrs</span>
            </div>
            <div className="text-2xl font-bold text-heading">45 hrs</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs text-caption font-medium uppercase tracking-wider">Streak</span>
            </div>
            <div className="text-2xl font-bold text-heading">7 Days</div>
          </div>
        </div>
      </div>

      {
    /* Middle Section: Continue Learning & Chart */
  }
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {
    /* Continue Learning */
  }
        <div className="xl:col-span-2 bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Continue Learning</h2>
            <Link to="/student/my-courses" className="text-sm text-primary font-medium hover:underline">View My Courses</Link>
          </div>
          <div className="space-y-6">
            {
    /* Course 1 */
  }
            <div className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-border transition-all">
              <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400" alt="Course" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow w-full">
                <div className="text-[10px] text-blue-500 font-bold mb-1 uppercase tracking-wider bg-blue-50 w-max px-2 py-0.5 rounded">Design</div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-heading">UI/UX Design Masterclass</h3>
                  <Link to="/student/course-player/1" className="hidden sm:block px-5 py-1.5 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm">Resume Lesson</Link>
                </div>
                <div className="flex justify-between text-xs text-caption mb-2 font-medium">
                  <span>16/20 Lessons</span>
                  <span>80% Complete</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
            
            {
    /* Course 2 */
  }
            <div className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-border transition-all">
              <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400" alt="Course" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow w-full">
                <div className="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-wider bg-indigo-50 w-max px-2 py-0.5 rounded">Development</div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-heading">React Development</h3>
                  <Link to="/student/course-player/1" className="hidden sm:block px-5 py-1.5 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-medium rounded-full hover:shadow-md hover:from-orange-700 hover:to-orange-500 transition-all text-sm">Resume Lesson</Link>
                </div>
                <div className="flex justify-between text-xs text-caption mb-2 font-medium">
                  <span>30/60 Lessons</span>
                  <span>50% Complete</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {
    /* Learning Progress Donut Chart */
  }
        <div className="xl:col-span-1 bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Learning Progress</h2>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center gap-8 py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {
    /* Using strokeDasharray of 251.2 (approx 2 * pi * 40) */
  }
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                {
    /* Communication 60% */
  }
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - 251.2 * 0.6} className="transition-all duration-1000" />
                {
    /* UI Design 24% (Offset by 60% which is 216deg) */
  }
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - 251.2 * 0.24} style={{ transformOrigin: "center", transform: "rotate(216deg)" }} />
                {
    /* Coding 16% (Offset by 84% which is 302.4deg) */
  }
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - 251.2 * 0.16} style={{ transformOrigin: "center", transform: "rotate(302.4deg)" }} />
              </svg>
              <div className="text-center">
                <div className="text-2xl font-bold text-heading">100%</div>
                <div className="text-xs text-caption">Total</div>
              </div>
            </div>
            
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                  <span className="text-body font-medium">Communication</span>
                </div>
                <span className="font-bold text-heading">60%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-purple-500" />
                  <span className="text-body font-medium">UI Design</span>
                </div>
                <span className="font-bold text-heading">24%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span className="text-body font-medium">Coding</span>
                </div>
                <span className="font-bold text-heading">16%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Bottom Section: Assignments, Quizzes & Notifications */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {
    /* Pending Assignments & Quizzes */
  }
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border shadow-sm p-6 lg:p-8 overflow-hidden">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-bold text-heading">Pending Tasks</h2>
            <Link to="/student/assignments" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="text-xs text-caption uppercase tracking-wider border-b border-border">
                  <th className="pb-3 font-medium">Task Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border/50 hover:bg-gray-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4" /></div>
                      <span className="font-bold text-heading">Prototyping Assignment</span>
                    </div>
                  </td>
                  <td className="py-4 text-body">UI/UX Masterclass</td>
                  <td className="py-4 font-medium text-red-500">Today, 11:59 PM</td>
                  <td className="py-4 text-right"><button className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-secondary transition-colors">Start</button></td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-gray-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                      <span className="font-bold text-heading">React Hooks Quiz</span>
                    </div>
                  </td>
                  <td className="py-4 text-body">React Development</td>
                  <td className="py-4 font-medium text-heading">Tomorrow</td>
                  <td className="py-4 text-right"><button className="border border-border text-heading px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors">Start</button></td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4" /></div>
                      <span className="font-bold text-heading">Color Theory Essay</span>
                    </div>
                  </td>
                  <td className="py-4 text-body">UI/UX Masterclass</td>
                  <td className="py-4 font-medium text-caption">Oct 15, 2026</td>
                  <td className="py-4 text-right"><button className="border border-border text-heading px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors">Start</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {
    /* Notifications & Recently Viewed */
  }
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-heading font-bold text-heading mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500"><Award className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-heading">Assignment Graded</h4>
                  <p className="text-xs text-body mt-0.5">You scored 95% on "Wireframing Basics".</p>
                  <span className="text-[10px] text-caption mt-1 block font-medium">2 hours ago</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500"><Bell className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-heading">New Course Material</h4>
                  <p className="text-xs text-body mt-0.5">Module 4 is now available in React Dev.</p>
                  <span className="text-[10px] text-caption mt-1 block font-medium">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-heading font-bold text-heading mb-4">Recently Viewed</h2>
            <Link to="/student/course-player/1" className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Course" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-heading group-hover:text-primary transition-colors line-clamp-1">Business Strategy 101</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-1 bg-primary/10 w-max px-2 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" /> Popular
                </div>
              </div>
            </Link>
          </div>
          
        </div>

      </div>

    </div>;
};
var stdin_default = StudentDashboardOverview;
export {
  stdin_default as default
};
