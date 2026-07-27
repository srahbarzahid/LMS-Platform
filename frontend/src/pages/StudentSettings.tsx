import { useState } from 'react';
import { User, Bell, Book, Monitor, Lock, Shield, HelpCircle, Save, Smartphone, MapPin, Activity, LogOut, Download, Trash2, ChevronRight } from 'lucide-react';

const mockSettings = {
  account: { email: 'john.doe@example.com', phone: '+1 (555) 123-4567' },
  learning: { preferredLanguage: 'English', defaultPlaybackSpeed: '1.25', autoPlayNextLesson: true, resumePlayback: true, theme: 'System', accountVisibility: 'Public' },
  notifications: { courseUpdates: true, assignmentNotifications: true, quizNotifications: true, projectNotifications: true, certificateNotifications: true, paymentNotifications: false, marketingEmails: false },
  securitySessions: [
    { id: 's1', device: 'Chrome on Windows', location: 'San Francisco, US', ipAddress: '192.168.1.1', lastActiveAt: new Date(), isCurrent: true },
    { id: 's2', device: 'Safari on iPhone', location: 'San Francisco, US', ipAddress: '192.168.1.4', lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24), isCurrent: false }
  ]
};

const StudentSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(mockSettings);

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'learning', name: 'Learning', icon: Book },
    { id: 'appearance', name: 'Appearance', icon: Monitor },
    { id: 'privacy', name: 'Privacy', icon: Lock },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];

  const handleToggle = (category: 'learning' | 'notifications', field: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: !(prev[category] as any)[field] }
    }));
  };

  const handleChange = (category: 'account' | 'learning', field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${checked ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform transform absolute ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-7xl pb-8 flex flex-col md:flex-row gap-8 lg:gap-12">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-56 shrink-0 space-y-1">
        <h1 className="text-2xl font-heading font-bold text-heading mb-6 px-3">Settings</h1>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-body font-medium hover:bg-gray-100 hover:text-heading'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-[18px] h-[18px]" />
                {tab.name}
              </div>
              <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0 text-caption'}`} />
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-3xl p-6 lg:p-10 border border-border shadow-sm min-h-[600px]">
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <h2 className="text-2xl font-heading font-bold text-heading">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
            {['account', 'notifications', 'learning', 'appearance', 'privacy'].includes(activeTab) && (
              <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </div>

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-8 max-w-lg">
              <div className="space-y-4">
                <h3 className="font-bold text-heading">Change Email Address</h3>
                <input type="email" value={settings.account.email} onChange={(e) => handleChange('account', 'email', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-heading">Change Phone Number</h3>
                <input type="text" value={settings.account.phone} onChange={(e) => handleChange('account', 'phone', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary" />
              </div>
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold text-heading">Change Password</h3>
                <input type="password" placeholder="Current Password" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary" />
                <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary" />
                <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary" />
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              {[
                { id: 'courseUpdates', label: 'Course Updates', desc: 'Announcements from instructors and course material updates.' },
                { id: 'assignmentNotifications', label: 'Assignment Notifications', desc: 'Reminders for due dates and grades.' },
                { id: 'quizNotifications', label: 'Quiz Notifications', desc: 'Quiz results and new quiz availability.' },
                { id: 'projectNotifications', label: 'Project Notifications', desc: 'Project feedback and grade updates.' },
                { id: 'certificateNotifications', label: 'Certificate Notifications', desc: 'When you earn a new certificate.' },
                { id: 'paymentNotifications', label: 'Payment Notifications', desc: 'Receipts and billing updates.' },
                { id: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotions and personalized course recommendations.' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-heading text-sm">{item.label}</h4>
                    <p className="text-xs text-caption mt-1">{item.desc}</p>
                  </div>
                  <Toggle checked={(settings.notifications as any)[item.id]} onChange={() => handleToggle('notifications', item.id)} />
                </div>
              ))}
            </div>
          )}

          {/* Learning Preferences */}
          {activeTab === 'learning' && (
            <div className="space-y-8 max-w-lg">
              <div className="space-y-4">
                <h3 className="font-bold text-heading text-sm">Preferred Language</h3>
                <select value={settings.learning.preferredLanguage} onChange={(e) => handleChange('learning', 'preferredLanguage', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary appearance-none">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-heading text-sm">Default Video Playback Speed</h3>
                <select value={settings.learning.defaultPlaybackSpeed} onChange={(e) => handleChange('learning', 'defaultPlaybackSpeed', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary appearance-none">
                  <option value="0.75">0.75x</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2.0">2.0x</option>
                </select>
              </div>
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-heading text-sm">Auto-Play Next Lesson</h4>
                    <p className="text-xs text-caption mt-1">Automatically start the next video when a lesson ends.</p>
                  </div>
                  <Toggle checked={settings.learning.autoPlayNextLesson} onChange={() => handleToggle('learning', 'autoPlayNextLesson')} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-heading text-sm">Resume Playback Automatically</h4>
                    <p className="text-xs text-caption mt-1">Remember where you left off in a video.</p>
                  </div>
                  <Toggle checked={settings.learning.resumePlayback} onChange={() => handleToggle('learning', 'resumePlayback')} />
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-lg">
              <h3 className="font-bold text-heading text-sm mb-4">Theme Preference</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map(theme => (
                  <button 
                    key={theme}
                    onClick={() => handleChange('learning', 'theme', theme)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${settings.learning.theme === theme ? 'border-primary bg-primary/5' : 'border-border bg-gray-50 hover:border-primary/50'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Monitor className={`w-5 h-5 ${settings.learning.theme === theme ? 'text-primary' : 'text-caption'}`} />
                    </div>
                    <span className={`text-sm font-bold ${settings.learning.theme === theme ? 'text-primary' : 'text-heading'}`}>{theme}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 max-w-lg">
              <div className="space-y-4">
                <h3 className="font-bold text-heading text-sm">Account Visibility</h3>
                <p className="text-xs text-caption">When public, other students can view your profile and achievements.</p>
                <select value={settings.learning.accountVisibility} onChange={(e) => handleChange('learning', 'accountVisibility', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl outline-none focus:border-primary appearance-none">
                  <option value="Public">Public (Visible to everyone)</option>
                  <option value="Private">Private (Only visible to you)</option>
                </select>
              </div>

              <div className="space-y-6 pt-8 border-t border-border">
                <div>
                  <h3 className="font-bold text-heading text-sm text-red-600 mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-heading text-sm">Request Data Export</h4>
                          <p className="text-xs text-caption">Download a copy of your personal data.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-caption" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 border border-red-200 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-200 text-red-600 flex items-center justify-center">
                          <Trash2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-red-600 text-sm">Delete Account Request</h4>
                          <p className="text-xs text-red-500">Permanently delete your account and data.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="font-bold text-heading text-sm mb-4">Active Sessions</h3>
                <div className="space-y-4">
                  {settings.securitySessions.map(session => (
                    <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl">
                      <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${session.isCurrent ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {session.device.includes('iPhone') || session.device.includes('Mobile') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-heading text-sm">{session.device}</h4>
                            {session.isCurrent && <span className="bg-emerald-500 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold">Current</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-caption">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.location}</span>
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {session.ipAddress}</span>
                          </div>
                          <p className="text-xs text-caption mt-1">Last active: {new Date(session.lastActiveAt).toLocaleString()}</p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button className="px-4 py-2 bg-gray-50 border border-border rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors shrink-0">
                          Revoke Access
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <button className="px-5 py-2.5 bg-gray-50 border border-border text-heading font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout from All Devices
                </button>
              </div>
            </div>
          )}

          {/* Help & Support */}
          {activeTab === 'help' && (
            <div className="space-y-4 max-w-lg">
              {[
                { name: 'Help Center', desc: 'Browse our comprehensive guides and tutorials.' },
                { name: 'Contact Support', desc: 'Get in touch with our student success team.' },
                { name: 'FAQs', desc: 'Find answers to commonly asked questions.' },
                { name: 'Report a Problem', desc: 'Found a bug? Let us know.' }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-5 bg-gray-50 border border-border rounded-2xl hover:bg-gray-100 hover:border-primary/30 transition-all group">
                  <div className="text-left">
                    <h4 className="font-bold text-heading text-sm group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="text-xs text-caption mt-1">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-caption group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default StudentSettings;
