import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import { User, Shield, Bell, Sliders, RefreshCw } from "lucide-react";
const InstructorProfileTab = lazy(() => import("./settings/tabs/InstructorProfileTab"));
const InstructorAccountSecurityTab = lazy(() => import("./settings/tabs/InstructorAccountSecurityTab"));
const InstructorNotificationsTab = lazy(() => import("./settings/tabs/InstructorNotificationsTab"));
const InstructorPreferencesTab = lazy(() => import("./settings/tabs/InstructorPreferencesTab"));
const InstructorSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "security", "notifications", "preferences"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const tabs = [
    { key: "profile", label: "Profile", icon: <User className="w-5 h-5" />, description: "Identity, designation & bio" },
    { key: "security", label: "Account & Security", icon: <Shield className="w-5 h-5" />, description: "Password & active sessions" },
    { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, description: "Email & student activity alerts" },
    { key: "preferences", label: "Preferences", icon: <Sliders className="w-5 h-5" />, description: "Language & theme mode" }
  ];
  return <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {
    /* Page Header */
  }
      <div>
        <h1 className="text-3xl font-heading font-bold text-heading">Instructor Settings</h1>
        <p className="text-body mt-1">Manage your public instructor profile, account security, student activity alerts, and UI preferences.</p>
      </div>

      {
    /* Main Container Card */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-11rem)] min-h-[550px]">
        {/* Left Side Tab Navigation (Fixed) */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-gray-50/50 dark:bg-neutral-900/50 p-6 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-none h-full">
          <div className="hidden md:block text-[11px] font-semibold tracking-[1px] uppercase text-caption mb-2 px-3">
            Settings Menu
          </div>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all text-left shrink-0 md:w-full cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-neutral-800 text-primary border border-border shadow-md"
                    : "text-caption hover:bg-gray-100 dark:hover:bg-neutral-800/60 hover:text-heading border border-transparent"
                }`}
              >
                <div className={`shrink-0 ${isActive ? "text-primary" : "text-caption"}`}>{tab.icon}</div>
                <div className="overflow-hidden">
                  <div className="truncate text-sm leading-snug">{tab.label}</div>
                  <div className="hidden md:block text-[11px] font-normal text-caption truncate mt-0.5">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area (Only Right Side Scrolls) */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto h-full min-w-0">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center p-12">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            }
          >
            {activeTab === "profile" && <InstructorProfileTab />}
            {activeTab === "security" && <InstructorAccountSecurityTab />}
            {activeTab === "notifications" && <InstructorNotificationsTab />}
            {activeTab === "preferences" && <InstructorPreferencesTab />}
          </Suspense>
        </div>
      </div>
    </div>;
};
var stdin_default = InstructorSettings;
export {
  stdin_default as default
};
