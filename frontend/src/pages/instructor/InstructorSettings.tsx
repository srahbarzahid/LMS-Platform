import { useState } from 'react';
import { 
  Bell, CreditCard, AlertTriangle, 
  Save, CheckCircle, Mail, Smartphone
} from 'lucide-react';

const InstructorSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications'); // notifications, payouts

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-heading">Settings</h1>
        <p className="text-body mt-1">Configure your notifications and payout preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-gray-50/50 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left shrink-0 md:w-full ${activeTab === 'notifications' ? 'bg-white text-primary border border-border shadow-sm' : 'text-caption hover:bg-gray-100 hover:text-heading border border-transparent'}`}
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left shrink-0 md:w-full ${activeTab === 'payouts' ? 'bg-white text-primary border border-border shadow-sm' : 'text-caption hover:bg-gray-100 hover:text-heading border border-transparent'}`}
          >
            <CreditCard className="w-5 h-5" /> Payouts
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="font-bold text-heading text-lg mb-1">Notification Preferences</h3>
                <p className="text-sm text-caption">Choose what updates you want to receive and how.</p>
              </div>

              <div className="space-y-6">
                
                {/* Email Notifications */}
                <div className="bg-gray-50 rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-heading">Email Notifications</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-start">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 mt-0.5 cursor-pointer" defaultChecked />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">New Enrollments</div>
                        <div className="text-xs text-caption mt-0.5">Receive an email when a student buys your course.</div>
                      </div>
                    </label>
                    <div className="w-full h-px bg-border my-2"></div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-start">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 mt-0.5 cursor-pointer" defaultChecked />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">Course Reviews</div>
                        <div className="text-xs text-caption mt-0.5">Get notified when someone leaves a review.</div>
                      </div>
                    </label>
                    <div className="w-full h-px bg-border my-2"></div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-start">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 mt-0.5 cursor-pointer" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">Weekly Analytics Summary</div>
                        <div className="text-xs text-caption mt-0.5">A weekly digest of your performance and earnings.</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Push/App Notifications */}
                <div className="bg-gray-50 rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-heading">In-App Notifications</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-start">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 mt-0.5 cursor-pointer" defaultChecked />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">Student Messages</div>
                        <div className="text-xs text-caption mt-0.5">Pop-ups when a student messages you directly.</div>
                      </div>
                    </label>
                    <div className="w-full h-px bg-border my-2"></div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-start">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 mt-0.5 cursor-pointer" defaultChecked />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-heading group-hover:text-primary transition-colors">Project Submissions</div>
                        <div className="text-xs text-caption mt-0.5">Alerts when a student submits an assignment or project.</div>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              <div className="pt-6 flex justify-end">
                <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors">
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="font-bold text-heading text-lg mb-1">Payout Settings</h3>
                <p className="text-sm text-caption">Connect your accounts to receive earnings from your courses.</p>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-4">
                
                {/* Stripe Mock */}
                <div className="border-2 border-green-500 rounded-2xl p-6 relative overflow-hidden bg-green-50/30">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ACTIVE
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-heading text-lg mb-1">Stripe Connect</h4>
                      <p className="text-sm text-caption">Connected as john.doe@example.com</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100">
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* PayPal Mock */}
                <div className="border border-border rounded-2xl p-6 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-heading text-lg mb-1">PayPal</h4>
                    <p className="text-sm text-caption">Connect your PayPal business account.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    Connect PayPal
                  </button>
                </div>

              </div>

              <div className="w-full h-px bg-border my-8"></div>
              
              <div>
                <h3 className="font-bold text-heading text-lg mb-1">Payout Schedule</h3>
                <p className="text-sm text-caption mb-6">When do you want to receive your earnings?</p>
                
                <div className="space-y-3 max-w-md">
                  <label className="flex items-center justify-between p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                    <div>
                      <div className="font-bold text-heading text-sm">Monthly (Default)</div>
                      <div className="text-xs text-caption">Earnings paid out on the 1st of every month.</div>
                    </div>
                    <input type="radio" name="payout_schedule" className="w-5 h-5 text-primary focus:ring-primary/20 cursor-pointer" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-border hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                    <div>
                      <div className="font-bold text-heading text-sm">Weekly</div>
                      <div className="text-xs text-caption">Earnings paid out every Monday.</div>
                    </div>
                    <input type="radio" name="payout_schedule" className="w-5 h-5 text-primary focus:ring-primary/20 cursor-pointer" />
                  </label>
                </div>
              </div>

              <div className="w-full h-px bg-border my-8"></div>
              
              {/* Danger Zone */}
              <div>
                <h3 className="font-bold text-red-600 text-lg mb-1 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Danger Zone</h3>
                <p className="text-sm text-caption mb-4">Deactivating your instructor account will unpublish all your courses.</p>
                <button className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors text-sm">
                  Deactivate Instructor Account
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InstructorSettings;
