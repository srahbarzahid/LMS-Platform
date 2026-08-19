import * as Icons from "lucide-react";
const ActivityTimeline = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-6 text-[#9CA3AF]">
        <Icons.Clock className="w-8 h-8 mb-2 opacity-40 text-[#ff6b00]" />
        <p className="text-sm font-medium">No recent activity recorded yet</p>
      </div>
    );
  }
  return <div className="h-full">
      <div className="space-y-6 pt-2">
        {activities.map((activity, index) => {
    const IconComponent = Icons[activity.icon] || Icons.Activity;
    return <div key={activity.id} className="flex gap-4 relative">
              {index !== activities.length - 1 && <div className="absolute top-8 left-[11px] bottom-[-24px] w-[2px] bg-[#f3f4f6]" />}
              <div className="w-6 h-6 rounded-full bg-[#fff4ed] text-[#ff6b00] flex items-center justify-center shrink-0 z-10 ring-4 ring-white mt-1">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827]">{activity.message}</p>
                <span className="text-xs text-[#9CA3AF] mt-1 inline-block font-medium">{activity.time}</span>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
var stdin_default = ActivityTimeline;
export {
  stdin_default as default
};
