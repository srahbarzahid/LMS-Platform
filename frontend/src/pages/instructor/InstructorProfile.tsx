import { useState } from 'react';
import { 
  User, Camera, Link as LinkIcon, 
  Globe, Lock, Save, Shield
} from 'lucide-react';

const InstructorProfile = () => {
  const [activeTab, setActiveTab] = useState('personal'); // personal, security

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-heading">Profile Settings</h1>
        <p className="text-body mt-1">Manage your public profile and security preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-gray-50/50 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left shrink-0 md:w-full ${activeTab === 'personal' ? 'bg-white text-primary border border-border shadow-sm' : 'text-caption hover:bg-gray-100 hover:text-heading border border-transparent'}`}
          >
            <User className="w-5 h-5" /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left shrink-0 md:w-full ${activeTab === 'security' ? 'bg-white text-primary border border-border shadow-sm' : 'text-caption hover:bg-gray-100 hover:text-heading border border-transparent'}`}
          >
            <Shield className="w-5 h-5" /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          
          {activeTab === 'personal' && (
            <div className="space-y-8 animate-fade-in">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-border shadow-sm text-caption hover:text-primary transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-heading text-lg">Profile Picture</h3>
                  <p className="text-sm text-caption mb-3">PNG, JPG up to 5MB. 256x256px recommended.</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-heading text-sm font-bold rounded-lg transition-colors border border-border">
                      Upload New
                    </button>
                    <button className="px-4 py-2 text-red-500 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-border my-6"></div>

              {/* Basic Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-heading mb-2">Email Address</label>
                  <input type="email" defaultValue="john.doe@example.com" disabled className="w-full px-4 py-3 bg-gray-100 border border-border rounded-xl text-caption cursor-not-allowed text-sm font-medium" />
                  <p className="text-xs text-caption mt-1">To change your email, please contact support.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-heading mb-2">Professional Headline</label>
                  <input type="text" defaultValue="Senior UX Designer & Instructor" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-heading mb-2">Biography</label>
                  <textarea rows={4} defaultValue="I have over 10 years of experience in digital product design..." className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none font-medium"></textarea>
                  <p className="text-xs text-caption mt-1 text-right">0/500 characters</p>
                </div>
              </div>

              <div className="w-full h-px bg-border my-6"></div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="font-bold text-heading text-lg">Social Links</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <input type="text" placeholder="https://linkedin.com/in/username" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-sky-500" />
                    </div>
                    <input type="text" placeholder="https://twitter.com/username" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <input type="text" placeholder="https://yourwebsite.com" className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="font-bold text-heading text-lg mb-1">Change Password</h3>
                <p className="text-sm text-caption">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-heading mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-heading mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-heading mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                  </div>
                </div>

                <div className="pt-2">
                  <button className="bg-heading text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-black transition-colors w-full sm:w-auto">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="w-full h-px bg-border my-8"></div>
              
              <div>
                <h3 className="font-bold text-red-600 text-lg mb-1">Danger Zone</h3>
                <p className="text-sm text-caption mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
