import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import { User, Shield, Bell, Sliders, Building2, RefreshCw } from "lucide-react";
const ProfileTab = lazy(() => import("./tabs/ProfileTab"));
const AccountSecurityTab = lazy(() => import("./tabs/AccountSecurityTab"));
const NotificationsTab = lazy(() => import("./tabs/NotificationsTab"));
const PreferencesTab = lazy(() => import("./tabs/PreferencesTab"));
const GeneralSettingsTab = lazy(() => import("./tabs/GeneralSettingsTab"));
const AdminSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "security", "notifications", "preferences", "general"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const tabs = [
    { key: "profile", label: "Profile", icon: <User className="w-5 h-5" />, description: "Personal details & photo" },
    { key: "security", label: "Account & Security", icon: <Shield className="w-5 h-5" />, description: "Password & active sessions" },
    { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, description: "Alerts & delivery channels" },
    { key: "preferences", label: "Preferences", icon: <Sliders className="w-5 h-5" />, description: "Language & theme mode" },
    { key: "general", label: "General Settings", icon: <Building2 className="w-5 h-5" />, description: "Platform branding & defaults" }
  ];
  return <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {
    /* Header */
  }
      <div>
        <h1 className="text-3xl font-heading font-bold text-heading">Admin Settings</h1>
        <p className="text-body mt-1">Manage your account profile, security controls, system notifications, and platform settings.</p>
      </div>

      {
    /* Settings Card */
  }
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-11rem)] min-h-[550px]">
        {/* Left Side Tab Navigation (Fixed) */}
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-border bg-gray-50/50 dark:bg-neutral-900/50 p-6 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-none h-full">
          <div className="hidden md:block text-[11px] font-semibold tracking-[1px] uppercase text-caption mb-2 px-3">
            Navigation
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

        {/* Tab Content Area with Lazy Loading Suspense (Only Right Side Scrolls) */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto h-full min-w-0">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center p-12">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            }
          >
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "security" && <AccountSecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "preferences" && <PreferencesTab />}
            {activeTab === "general" && <GeneralSettingsTab />}
          </Suspense>
        </div>
      </div>
    </div>;
};
var stdin_default = AdminSettings;
export {
  stdin_default as default
};
