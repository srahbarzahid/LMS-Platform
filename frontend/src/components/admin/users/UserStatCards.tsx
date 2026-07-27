import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

interface UserStatCardsProps {
  stats: Stat[];
}

const UserStatCards = ({ stats }: UserStatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="relative overflow-hidden bg-white p-4 rounded-xl border border-border shadow-sm group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 pointer-events-none text-gray-900">
              <Icon className="w-24 h-24" />
            </div>
            
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="text-2xl font-heading font-black text-heading tracking-tight leading-tight">{stat.value}</div>
              <div className="text-[10px] font-bold text-caption uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStatCards;
