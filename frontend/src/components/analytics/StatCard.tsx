import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDesc?: string;
  sparklineData?: { value: number }[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendDesc, sparklineData }) => {
  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#ff6b00]/10 shadow-[0_4px_20px_-5px_rgba(255,107,0,0.15)] flex flex-col justify-between hover:shadow-[0_8px_30px_-5px_rgba(255,107,0,0.25)] hover:-translate-y-1 transition-[box-shadow,transform,color] duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-[#ff6b00] flex items-center justify-center shrink-0">
          {icon}
        </div>
        {trend && (
          <div className="flex flex-col items-end">
            <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'text-[#10B981] bg-[#10B981]/10' : isNegative ? 'text-[#EF4444] bg-[#EF4444]/10' : 'text-[#9CA3AF] bg-[#f3f4f6]'}`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
              {trend}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-[#111827]">{value}</h3>
          <p className="text-sm font-medium text-[#4B5563] mt-1">{title}</p>
          {trendDesc && <span className="text-xs text-[#9CA3AF] font-medium block mt-0.5">{trendDesc}</span>}
        </div>
        
        {sparklineData && (
          <div className="w-20 h-10 opacity-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#ff6b00'} 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
