import { useState } from 'react';
import { Camera, User, Mail, Phone, MapPin, Globe, Book, Briefcase, GraduationCap, Award, Save, X } from 'lucide-react';

const mockProfileData = {
  profile: {
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: null,
    bio: 'A passionate learner interested in IoT and Robotics.',
    city: 'San Francisco',
    country: 'United States',
    college: 'University of Technology',
    occupation: 'Software Engineer',
    skills: 'Python, React, IoT, C++',
    experienceLevel: 'Intermediate',
    githubUrl: 'https://github.com/johndoe',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    createdAt: new Date('2025-01-15T00:00:00Z'),
  },
  stats: {
    coursesEnrolled: 4,
    coursesCompleted: 1,
    certificatesEarned: 1,
    projectsCompleted: 3,
    learningHours: 42
  }
};

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfileData.profile);
  const { stats } = mockProfileData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Backend saving logic would go here
    setIsEditing(false);
  };

  const StatCard = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-caption text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-heading font-heading">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl pb-8 space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
        <div className="px-6 lg:px-8 pb-6 lg:pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 sm:-mt-16 mb-6">
            <div className="flex items-end gap-6">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading">{profile.name}</h1>
                <p className="text-caption">Student ID: {profile.id} • Member since {new Date(profile.createdAt).getFullYear()}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-gray-100 text-heading font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Book} label="Enrolled" value={stats.coursesEnrolled} colorClass="bg-blue-100 text-blue-600" />
        <StatCard icon={Award} label="Certificates" value={stats.certificatesEarned} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Briefcase} label="Projects" value={stats.projectsCompleted} colorClass="bg-orange-100 text-orange-600" />
        <StatCard icon={GraduationCap} label="Hours" value={stats.learningHours} colorClass="bg-purple-100 text-purple-600" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
            <h2 className="text-xl font-heading font-bold text-heading mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Location</label>
                <div className="relative flex gap-2">
                  <MapPin className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                  <input type="text" name="city" placeholder="City" value={profile.city} onChange={handleChange} disabled={!isEditing} className="w-1/2 pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                  <input type="text" name="country" placeholder="Country" value={profile.country} onChange={handleChange} disabled={!isEditing} className="w-1/2 px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-heading">Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange} disabled={!isEditing} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70 resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
            <h2 className="text-xl font-heading font-bold text-heading mb-6">Professional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">College / University</label>
                <div className="relative">
                  <GraduationCap className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" name="college" value={profile.college} onChange={handleChange} disabled={!isEditing} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Occupation</label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" name="occupation" value={profile.occupation} onChange={handleChange} disabled={!isEditing} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Experience Level</label>
                <select name="experienceLevel" value={profile.experienceLevel} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70 appearance-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Skills (comma separated)</label>
                <input type="text" name="skills" value={profile.skills} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Social Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border shadow-sm">
            <h2 className="text-xl font-heading font-bold text-heading mb-6">Social Links</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">GitHub</label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="url" name="githubUrl" value={profile.githubUrl} onChange={handleChange} disabled={!isEditing} placeholder="https://github.com/..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">LinkedIn</label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="url" name="linkedinUrl" value={profile.linkedinUrl} onChange={handleChange} disabled={!isEditing} placeholder="https://linkedin.com/in/..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-heading">Portfolio Website</label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-caption absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="url" name="portfolioUrl" value={profile.portfolioUrl} onChange={handleChange} disabled={!isEditing} placeholder="https://..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm outline-none focus:border-primary disabled:opacity-70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
