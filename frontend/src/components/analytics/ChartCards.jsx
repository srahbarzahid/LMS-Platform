import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
const ChartCard = ({ title, children, action }) => <div className="bg-white rounded-2xl border border-[#ff6b00]/10 shadow-[0_4px_20px_-5px_rgba(255,107,0,0.15)] p-6 flex flex-col h-full hover:shadow-[0_8px_30px_-5px_rgba(255,107,0,0.25)] hover:-translate-y-1 transition-[box-shadow,transform] duration-300">
    <div className="flex justify-between items-center mb-6 relative z-10">
      <h2 className="text-lg font-bold text-[#111827]">{title}</h2>
      {action && <div>{action}</div>}
    </div>
    <div className="flex-1 w-full relative z-10" style={{ minHeight: 300 }}>
      {children}
    </div>
  </div>;
const COLORS = ["#ff6b00", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6"];
const formatYAxis = (value) => {
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(value % 1e3 === 0 ? 0 : 1)}k`;
  }
  return value.toString();
};
const CustomLineChart = ({ data, xKey, yKey, color = "#ff6b00" }) => <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
      <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={formatYAxis} width={60} />
      <Tooltip
  contentStyle={{ borderRadius: "12px", border: "1px solid #f3f4f6", backgroundColor: "#FFFFFF", color: "#111827", fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
  itemStyle={{ color: "#ff6b00", fontWeight: "bold" }}
/>
      <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: color, strokeWidth: 2 }} activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }} />
    </LineChart>
  </ResponsiveContainer>;
const CustomVerticalBarChart = ({ data, xKey, yKey }) => <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#e56000" stopOpacity={1} />
          <stop offset="100%" stopColor="#ffa05c" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
      <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={formatYAxis} width={60} />
      <Tooltip cursor={{ fill: "#fff4ed" }} contentStyle={{ borderRadius: "12px", border: "1px solid #f3f4f6", backgroundColor: "#FFFFFF", color: "#111827", fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} itemStyle={{ color: "#ff6b00", fontWeight: "bold" }} />
      <Bar dataKey={yKey} fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={40} />
    </BarChart>
  </ResponsiveContainer>;
const CustomHorizontalBarChart = ({ data, xKey, yKey, color = "#ff6b00" }) => <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} dy={10} />
      <YAxis type="category" dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 600 }} dx={-10} width={120} />
      <Tooltip cursor={{ fill: "#fff4ed" }} contentStyle={{ borderRadius: "12px", border: "1px solid #f3f4f6", backgroundColor: "#FFFFFF", color: "#111827", fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
      <Bar dataKey={yKey} fill={color} radius={[0, 6, 6, 0]} barSize={24} />
    </BarChart>
  </ResponsiveContainer>;
const CustomStackedHorizontalBarChart = ({ data, yKey, keys, colors }) => <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} dy={10} />
      <YAxis type="category" dataKey={yKey} axisLine={false} tickLine={false} tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 600 }} dx={-10} width={100} />
      <Tooltip cursor={{ fill: "#fff4ed" }} contentStyle={{ borderRadius: "12px", border: "1px solid #f3f4f6", backgroundColor: "#FFFFFF", color: "#111827", fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", color: "#4B5563", paddingTop: "10px" }} />
      {keys.map((key, index) => <Bar key={key} dataKey={key} stackId="a" fill={colors[index]} radius={index === 0 ? [0, 0, 0, 0] : index === keys.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} barSize={30} />)}
    </BarChart>
  </ResponsiveContainer>;
const CustomDonutChart = ({ data, nameKey, dataKey }) => <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <defs>
        <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ff6b00" floodOpacity="0.2" />
        </filter>
      </defs>
      <Pie
  data={data}
  cx="50%"
  cy="50%"
  innerRadius={80}
  outerRadius={110}
  paddingAngle={6}
  dataKey={dataKey}
  nameKey={nameKey}
  stroke="none"
  cornerRadius={8}
  filter="url(#pieShadow)"
  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
              {`${(percent * 100).toFixed(0)}%`}
            </text> : null;
  }}
  labelLine={false}
>
        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />)}
      </Pie>
      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f3f4f6", backgroundColor: "#FFFFFF", color: "#111827", fontSize: "13px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "13px", color: "#4B5563", fontWeight: 500 }} />
    </PieChart>
  </ResponsiveContainer>;
const CircularProgressChart = ({ value, label, subtext, color = "#ff6b00" }) => {
  const data = [
    { name: "Completed", value, fill: color },
    { name: "Remaining", value: 100 - value, fill: "#FFFFFF" }
  ];
  return <div className="relative w-full h-[260px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <filter id="progressShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={color} floodOpacity="0.25" />
            </filter>
          </defs>
          <Pie
    data={data}
    cx="50%"
    cy="50%"
    innerRadius={88}
    outerRadius={110}
    startAngle={90}
    endAngle={-270}
    dataKey="value"
    stroke="none"
    cornerRadius={12}
    filter="url(#progressShadow)"
  />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-4xl font-bold text-[#111827]">{label}</span>
        {subtext && <span className="text-sm font-medium text-[#9CA3AF] mt-1">{subtext}</span>}
      </div>
    </div>;
};
export {
  ChartCard,
  CircularProgressChart,
  CustomDonutChart,
  CustomHorizontalBarChart,
  CustomLineChart,
  CustomStackedHorizontalBarChart,
  CustomVerticalBarChart
};
