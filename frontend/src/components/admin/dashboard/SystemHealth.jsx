import { Server, Lightbulb, FileText, Award } from "lucide-react";
import { Link } from "react-router-dom";

const SystemHealth = ({ systemStatus, platformInsights, pendingApprovals }) => {
  const StatusItem = ({ label, status }) => {
    const isRunning = status === "Running" || status === "Operational";
    const isUnderConstruction = status === "Under Construction";

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-border dark:border-neutral-800">
        <span className="text-sm font-medium text-heading dark:text-white">{label}</span>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isRunning
                ? "bg-emerald-500"
                : isUnderConstruction
                ? "bg-amber-500 animate-pulse"
                : "bg-red-500"
            }`}
          />
          <span
            className={`text-xs font-bold ${
              isRunning
                ? "text-emerald-600 dark:text-emerald-400"
                : isUnderConstruction
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Pending Approvals & Action Items */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-heading dark:text-white">Pending Approvals</h2>
        </div>
        <div className="space-y-4">
          <Link
            to="/admin/course-approvals"
            className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 rounded-xl hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading dark:text-white group-hover:text-primary transition-colors">
                  Course Approvals
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Requires Review</div>
              </div>
            </div>
            <span className="text-lg font-black text-orange-600 dark:text-orange-400">
              {pendingApprovals?.courses ?? 0}
            </span>
          </Link>

          <Link
            to="/admin/certificates"
            className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 rounded-xl hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading dark:text-white group-hover:text-primary transition-colors">
                  Issued Certificates
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Database Verified</div>
              </div>
            </div>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400">
              {pendingApprovals?.certificates ?? 0}
            </span>
          </Link>
        </div>
      </div>

      {/* Intelligent Platform Insights */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-heading dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Platform Insights
          </h2>
        </div>
        <div className="space-y-3.5">
          {Array.isArray(platformInsights) && platformInsights.length > 0 ? (
            platformInsights.map((insight, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                </div>
                <p className="text-sm text-body dark:text-neutral-300 leading-relaxed">{insight}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-caption">No platform insights available at this time.</p>
          )}
        </div>
      </div>

      {/* Website & System Status */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-border dark:border-neutral-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-heading dark:text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" /> System Status
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <StatusItem label="Homepage API" status={systemStatus?.homepage || "Running"} />
          <StatusItem label="Payment Gateway" status={systemStatus?.paymentGateway || "Under Construction"} />
          <StatusItem label="Email Delivery" status={systemStatus?.emailService || "Under Construction"} />
          <StatusItem label="Certificate Render" status={systemStatus?.certificateService || "Running"} />
          <StatusItem label="Cloud Storage" status={systemStatus?.storage || "Running"} />
          <StatusItem label="Security Layer" status={systemStatus?.security || "Running"} />
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
