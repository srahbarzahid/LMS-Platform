import React from 'react';

interface HeatmapProps {
  data: { date: string; count: number }[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  // Simple GitHub style calendar for the last 90 days
  const weeks = [];
  let currentWeek: any[] = [];
  
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count < 10) return 'bg-orange-200';
    if (count < 20) return 'bg-orange-300';
    if (count < 30) return 'bg-orange-400';
    return 'bg-primary';
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-heading font-bold text-heading">Activity Heatmap</h2>
      </div>
      <div className="flex gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day, j) => (
              <div 
                key={j} 
                title={`${day.date}: ${day.count} actions`}
                className={`w-4 h-4 rounded-sm ${getColor(day.count)} transition-transform hover:scale-125 cursor-pointer`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-caption">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
        <div className="w-3 h-3 rounded-sm bg-orange-200"></div>
        <div className="w-3 h-3 rounded-sm bg-orange-300"></div>
        <div className="w-3 h-3 rounded-sm bg-orange-400"></div>
        <div className="w-3 h-3 rounded-sm bg-primary"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
