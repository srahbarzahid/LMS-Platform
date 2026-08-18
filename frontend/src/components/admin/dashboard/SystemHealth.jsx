import { Server, Lightbulb, FileText, Award } from "lucide-react";
import { Link } from "react-router-dom";
const SystemHealth = ({ systemStatus, platformInsights, pendingApprovals }) => {
  const StatusItem = ({ label, status }) => <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-border">
      <span className="text-sm font-medium text-heading">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${status === "Running" ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`} />
        <span className={`text-xs font-bold ${status === "Running" ? "text-emerald-600" : "text-red-600"}`}>{status}</span>
      </div>
    </div>;
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      {
    /* Pending Approvals & Action Items */
  }
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-heading">Pending Approvals</h2>
        </div>
        <div className="space-y-4">
          <Link to="/admin/course-approvals" className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">Course Approvals</div>
                <div className="text-xs text-orange-600 font-medium">Requires Review</div>
              </div>
            </div>
            <span className="text-lg font-black text-orange-600">{pendingApprovals.courses}</span>
          </Link>

          <Link to="/admin/certificates" className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">Certificate Verify</div>
                <div className="text-xs text-purple-600 font-medium">Pending Output</div>
              </div>
            </div>
            <span className="text-lg font-black text-purple-600">{pendingApprovals.certificates}</span>
          </Link>
        </div>
      </div>

      {
    /* Intelligent Platform Insights */
  }
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-heading flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" /> Platform Insights
          </h2>
        </div>
        <div className="space-y-4">
          {platformInsights.map((insight, index) => <div key={index} className="flex gap-3">
              <div className="mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              </div>
              <p className="text-sm text-body leading-relaxed">{insight}</p>
            </div>)}
        </div>
      </div>

      {
    /* Website Status */
  }
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-heading flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" /> System Status
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <StatusItem label="Homepage API" status={systemStatus.homepage} />
          <StatusItem label="Payment Gateway" status={systemStatus.paymentGateway} />
          <StatusItem label="Email Delivery" status={systemStatus.emailService} />
          <StatusItem label="Certificate Render" status={systemStatus.certificateService} />
          <StatusItem label="Cloud Storage" status={systemStatus.storage} />
          <StatusItem label="Security Layer" status={systemStatus.security} />
        </div>
      </div>

    </div>;
};
var stdin_default = SystemHealth;
export {
  stdin_default as default
};
