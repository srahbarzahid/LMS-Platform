import { PlaySquare, CheckSquare, ClipboardList, Briefcase, Award } from 'lucide-react';

const InstructorStudentProgress = () => {
  return (
    <div className="space-y-6">
      
      {/* Overall Progress Circular Card */}
      <div className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          {/* Circular Progress Mock */}
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" 
              strokeDasharray={502} strokeDashoffset={502 - (502 * 85) / 100}
              className="text-primary transition-all duration-1000" strokeLinecap="round" 
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-heading font-bold text-heading">85%</span>
            <span className="text-xs text-caption mt-1">Overall Progress</span>
          </div>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-heading font-bold text-heading">Almost there!</h2>
          <p className="text-body text-sm">Alice has completed 85% of the UI/UX Masterclass. She is on track to finish by the end of the month.</p>
          <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <Award className="w-5 h-5" /> Eligible for Certificate upon completion
          </div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <ProgressCard 
          title="Lessons Progress" 
          icon={<PlaySquare className="w-5 h-5 text-blue-500" />} 
          color="bg-blue-50"
          percentage={90} 
          completed={27} 
          total={30}
          barColor="bg-blue-500"
        />

        <ProgressCard 
          title="Quizzes Progress" 
          icon={<CheckSquare className="w-5 h-5 text-green-500" />} 
          color="bg-green-50"
          percentage={80} 
          completed={4} 
          total={5}
          barColor="bg-green-500"
        />

        <ProgressCard 
          title="Assignments Progress" 
          icon={<ClipboardList className="w-5 h-5 text-purple-500" />} 
          color="bg-purple-50"
          percentage={75} 
          completed={3} 
          total={4}
          barColor="bg-purple-500"
        />

        <ProgressCard 
          title="Projects Progress" 
          icon={<Briefcase className="w-5 h-5 text-yellow-500" />} 
          color="bg-yellow-50"
          percentage={50} 
          completed={1} 
          total={2}
          barColor="bg-yellow-500"
        />

      </div>
    </div>
  );
};

const ProgressCard = ({ title, icon, color, percentage, completed, total, barColor }: any) => (
  <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <h3 className="font-bold text-heading">{title}</h3>
      </div>
      <div className="text-xl font-heading font-bold text-heading">{percentage}%</div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-caption font-bold">
        <span>Completed: {completed}</span>
        <span>Total: {total}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  </div>
);

export default InstructorStudentProgress;
