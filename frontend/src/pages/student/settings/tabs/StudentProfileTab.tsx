import React, { useState, useEffect } from 'react';
import { Camera, Trash2, CheckCircle2, AlertCircle, RefreshCw, Save, Mail, Phone, User, Calendar, UserCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  gender: string | null;
  profileImage: string | null;
  pendingEmail: string | null;
  pendingPhone: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

const StudentProfileTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);

  // Original state backup for Cancel action
  const [initialData, setInitialData] = useState<StudentProfileData | null>(null);

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [dateOfBirth, setDateOfBirth] = useState('2000-05-15');
  const [gender, setGender] = useState('Male');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/settings/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        populateFields(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateFields = (d: StudentProfileData) => {
    setInitialData(d);
    setName(d.name || '');
    setEmail(d.email || '');
    setPhone(d.phone || '');
    setDateOfBirth(d.dateOfBirth || '');
    setGender(d.gender || 'Male');
    setProfileImage(d.profileImage || null);
    setPendingEmail(d.pendingEmail || null);
    setPendingPhone(d.pendingPhone || null);
    setIsEmailVerified(d.isEmailVerified ?? true);
    setIsPhoneVerified(d.isPhoneVerified ?? true);
  };

  const handleReset = () => {
    if (initialData) {
      populateFields(initialData);
      setPreviewPhoto(null);
      setSelectedFile(null);
      toast.success('Changes reset.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewPhoto(null);
    setProfileImage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('gender', gender);

      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }
      if (!profileImage && !previewPhoto) {
        formData.append('removePhoto', 'true');
      }

      const res = await fetch('/api/student/settings/profile', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success(data.message || 'Profile saved successfully!');
        if (data.data) {
          setPendingEmail(data.data.pendingEmail);
          setPendingPhone(data.data.pendingPhone);
          setIsEmailVerified(data.data.isEmailVerified);
          setIsPhoneVerified(data.data.isPhoneVerified);
          if (data.data.profileImage) {
            setProfileImage(data.data.profileImage);
            setPreviewPhoto(null);
          }
          setInitialData({
            id: data.data.id || '',
            name,
            email: data.data.email,
            phone: data.data.phone,
            dateOfBirth,
            gender,
            profileImage: data.data.profileImage,
            pendingEmail: data.data.pendingEmail,
            pendingPhone: data.data.pendingPhone,
            isEmailVerified: data.data.isEmailVerified,
            isPhoneVerified: data.data.isPhoneVerified,
          });
        }
      } else {
        toast.error(data.message || 'Failed to save profile.');
      }
    } catch (err) {
      toast.error('Error saving student profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResend = async (type: 'email' | 'mobile') => {
    setVerifying(type);
    try {
      const res = await fetch('/api/student/settings/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to resend verification.');
      }
    } catch (err) {
      toast.error('Failed to resend verification link.');
    } finally {
      setVerifying(null);
    }
  };

  const handleConfirmVerification = async (type: 'email' | 'mobile') => {
    setVerifying(type);
    try {
      const res = await fetch('/api/student/settings/confirm-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success(data.message);
        if (type === 'email' && pendingEmail) {
          setEmail(pendingEmail);
          setPendingEmail(null);
          setIsEmailVerified(true);
        } else if (type === 'mobile' && pendingPhone) {
          setPhone(pendingPhone);
          setPendingPhone(null);
          setIsPhoneVerified(true);
        }
      } else {
        toast.error(data.message || 'Failed to confirm verification.');
      }
    } catch (err) {
      toast.error('Failed to confirm verification.');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const currentAvatar = previewPhoto || profileImage;

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
      <div>
        <h3 className="font-bold text-heading text-lg mb-1">Student Profile</h3>
        <p className="text-sm text-caption">Manage your personal information, avatar, and contact channels.</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-gray-50 rounded-2xl border border-border p-6">
        <label className="block text-sm font-bold text-heading mb-4">Profile Photo</label>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Student Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-secondary cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <label className="px-4 py-2 bg-white border border-border rounded-xl font-semibold text-xs text-heading hover:bg-gray-100 cursor-pointer transition-colors shadow-sm inline-flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" /> Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              {currentAvatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-xl font-semibold text-xs hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                </button>
              )}
            </div>
            <p className="text-xs text-caption">Allowed formats: JPG, PNG, WEBP. Max size: 5MB.</p>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Jane Student"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-caption">Email Address</label>
            {isEmailVerified && !pendingEmail && (
              <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="student@example.com"
            />
          </div>

          {pendingEmail && (
            <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Verification pending for <strong>{pendingEmail}</strong>. Email will update upon confirmation.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleResend('email')}
                  disabled={verifying === 'email'}
                  className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  Resend Link
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmVerification('email')}
                  disabled={verifying === 'email'}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  Verify Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Number */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-caption">Mobile Phone Number</label>
            {isPhoneVerified && !pendingPhone && (
              <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
          <div className="relative">
            <Phone className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {pendingPhone && (
            <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Verification pending for <strong>{pendingPhone}</strong>. Phone will update upon confirmation.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleResend('mobile')}
                  disabled={verifying === 'mobile'}
                  className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmVerification('mobile')}
                  disabled={verifying === 'mobile'}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  Verify Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Basic Personal Info: Date of Birth */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Date of Birth</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Basic Personal Info: Gender */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Gender</label>
          <div className="relative">
            <UserCheck className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2.5 border border-border text-heading rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
        </button>
      </div>
    </form>
  );
};

export default StudentProfileTab;
