import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Shield, Bell, Sliders, RefreshCw } from 'lucide-react';

const StudentProfileTab = lazy(() => import('./student/settings/tabs/StudentProfileTab'));
const StudentAccountSecurityTab = lazy(() => import('./student/settings/tabs/StudentAccountSecurityTab'));
const StudentNotificationsTab = lazy(() => import('./student/settings/tabs/StudentNotificationsTab'));
const StudentPreferencesTab = lazy(() => import('./student/settings/tabs/StudentPreferencesTab'));

type TabKey = 'profile' | 'security' | 'notifications' | 'preferences';

const StudentSettings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'profile';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabKey;
    if (tabParam && ['profile', 'security', 'notifications', 'preferences'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, description: 'Personal info & avatar' },
    { key: 'security', label: 'Account & Security', icon: <Shield className="w-5 h-5" />, description: 'Password & active sessions' },
    { key: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, description: 'Email & course alerts' },
    { key: 'preferences', label: 'Preferences', icon: <Sliders className="w-5 h-5" />, description: 'Language & theme mode' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-heading">Student Settings</h1>
        <p className="text-body mt-1">Manage your student profile, account security, notification alerts, and UI preferences.</p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Left Side Tab Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-gray-50/50 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0">
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
                    ? 'bg-white text-primary border border-border shadow-md'
                    : 'text-caption hover:bg-gray-100 hover:text-heading border border-transparent'
                }`}
              >
                <div className={`shrink-0 ${isActive ? 'text-primary' : 'text-caption'}`}>{tab.icon}</div>
                <div className="overflow-hidden">
                  <div className="truncate text-sm leading-snug">{tab.label}</div>
                  <div className="hidden md:block text-[11px] font-normal text-caption truncate mt-0.5">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center p-12">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            }
          >
            {activeTab === 'profile' && <StudentProfileTab />}
            {activeTab === 'security' && <StudentAccountSecurityTab />}
            {activeTab === 'notifications' && <StudentNotificationsTab />}
            {activeTab === 'preferences' && <StudentPreferencesTab />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
