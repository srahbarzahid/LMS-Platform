import { useState, useEffect } from "react";
import { Camera, Trash2, CheckCircle2, AlertCircle, RefreshCw, Save, Mail, Phone, User, Briefcase, Edit3, X } from "lucide-react";
import toast from "react-hot-toast";
import apiClient, { normalizeApiPath, getApiErrorMessage } from "../../../../api/client";
import { useTranslation } from "../../../../context/LanguageContext";

const InstructorProfileTab = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [name, setName] = useState("Sarah Jenkins");
  const [email, setEmail] = useState("sarah.jenkins@example.com");
  const [phone, setPhone] = useState("+1 (555) 987-6543");
  const [designation, setDesignation] = useState("Senior Computer Science Instructor");
  const [bio, setBio] = useState("Over 10 years of experience teaching web technologies, full-stack architecture, and database engineering.");
  const [profileImage, setProfileImage] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [pendingPhone, setPendingPhone] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(normalizeApiPath("/instructor/settings/profile"));
      const data = res.data;
      if (data.status === "success" && data.data) {
        populateFields(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch instructor profile:", err);
    } finally {
      setLoading(false);
    }
  };
  const populateFields = (d) => {
    setInitialData(d);
    setName(d.name || "");
    setEmail(d.email || "");
    setPhone(d.phone || "");
    setDesignation(d.designation || "");
    setBio(d.bio || "");
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
    }
    setIsEditing(false);
    toast.success("Editing cancelled.");
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewPhoto(null);
    setProfileImage(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("designation", designation);
      formData.append("bio", bio);
      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }
      if (!profileImage && !previewPhoto) {
        formData.append("removePhoto", "true");
      }
      const res = await apiClient.patch(normalizeApiPath("/instructor/settings/profile"), formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const data = res.data;
      if (data.status === "success") {
        toast.success(data.message || "Profile saved successfully!");
        setIsEditing(false);
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
            id: data.data.id || "",
            name,
            email: data.data.email,
            phone: data.data.phone,
            designation: data.data.designation,
            bio: data.data.bio,
            profileImage: data.data.profileImage,
            pendingEmail: data.data.pendingEmail,
            pendingPhone: data.data.pendingPhone,
            isEmailVerified: data.data.isEmailVerified,
            isPhoneVerified: data.data.isPhoneVerified
          });

          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...currentUser,
            name: data.data.name || name,
            email: data.data.email || email,
            profileImage: data.data.profileImage
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("profileUpdate"));
        }
      } else {
        toast.error(data.message || "Failed to save profile.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Error saving instructor profile."));
    } finally {
      setSaving(false);
    }
  };
  const handleResend = async (type) => {
    setVerifying(type);
    try {
      const res = await apiClient.post(normalizeApiPath("/instructor/settings/resend-verification"), { type });
      const data = res.data;
      if (data.status === "success") {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to resend verification.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to resend verification link."));
    } finally {
      setVerifying(null);
    }
  };
  const handleConfirmVerification = async (type) => {
    setVerifying(type);
    try {
      const res = await apiClient.post(normalizeApiPath("/instructor/settings/confirm-verification"), { type });
      const data = res.data;
      if (data.status === "success") {
        toast.success(data.message);
        if (type === "email" && pendingEmail) {
          setEmail(pendingEmail);
          setPendingEmail(null);
          setIsEmailVerified(true);
        } else if (type === "mobile" && pendingPhone) {
          setPhone(pendingPhone);
          setPendingPhone(null);
          setIsPhoneVerified(true);
        }
      } else {
        toast.error(data.message || "Failed to confirm verification.");
      }
    } catch (err) {
      toast.error("Failed to confirm verification.");
    } finally {
      setVerifying(null);
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>;
  }
  const currentAvatar = previewPhoto || profileImage;
  return <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h3 className="font-bold text-heading text-lg mb-1">Instructor Profile</h3>
          <p className="text-sm text-caption">Manage your instructor identity, designation, and public biography.</p>
        </div>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-secondary transition-all text-sm shrink-0 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-heading font-bold rounded-xl hover:bg-gray-200 transition-all text-xs shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" /> Cancel Editing
          </button>
        )}
      </div>

      {
    /* Avatar Section */
  }
      <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-border p-6">
        <label className="block text-sm font-bold text-heading mb-4">Profile Photo</label>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              {currentAvatar ? <img src={currentAvatar} alt="Instructor Avatar" className="w-full h-full object-cover" /> : <User className="w-10 h-10" />}
            </div>
            <label className={`absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md transition-colors ${!isEditing ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-secondary cursor-pointer"}`}>
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={!isEditing} />
            </label>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <label className={`px-4 py-2 bg-white border border-border rounded-xl font-semibold text-xs text-heading transition-colors shadow-sm inline-flex items-center gap-2 ${!isEditing ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-gray-100 cursor-pointer"}`}>
                <Camera className="w-3.5 h-3.5" /> Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={!isEditing} />
              </label>
              {currentAvatar && <button
    type="button"
    onClick={handleRemovePhoto}
    disabled={!isEditing}
    className="px-4 py-2 border border-red-200 text-red-600 rounded-xl font-semibold text-xs hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
  >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                </button>}
            </div>
            <p className="text-xs text-caption">Allowed formats: JPG, PNG, WEBP. Recommended 256x256px.</p>
          </div>
        </div>
      </div>

      {
    /* Main Form Fields */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {
    /* Full Name */
  }
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    disabled={!isEditing}
    required
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-75 disabled:bg-gray-50/70 dark:disabled:bg-neutral-900/50 disabled:cursor-not-allowed"
    placeholder="e.g. Dr. Sarah Jenkins"
  />
          </div>
        </div>

        {
    /* Email Address */
  }
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-caption">Email Address</label>
            {isEmailVerified && !pendingEmail && <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>}
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    disabled={!isEditing}
    required
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-75 disabled:bg-gray-50/70 dark:disabled:bg-neutral-900/50 disabled:cursor-not-allowed"
    placeholder="instructor@example.com"
  />
          </div>

          {pendingEmail && <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Verification pending for <strong>{pendingEmail}</strong>. Email will update upon confirmation.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
    type="button"
    onClick={() => handleResend("email")}
    disabled={verifying === "email"}
    className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-700 hover:bg-amber-100 transition-colors"
  >
                  Resend Link
                </button>
                <button
    type="button"
    onClick={() => handleConfirmVerification("email")}
    disabled={verifying === "email"}
    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
  >
                  Verify Now
                </button>
              </div>
            </div>}
        </div>

        {
    /* Mobile Number */
  }
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-caption">Mobile Phone Number</label>
            {isPhoneVerified && !pendingPhone && <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>}
          </div>
          <div className="relative">
            <Phone className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    disabled={!isEditing}
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-75 disabled:bg-gray-50/70 dark:disabled:bg-neutral-900/50 disabled:cursor-not-allowed"
    placeholder="+1 (555) 000-0000"
  />
          </div>

          {pendingPhone && <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Verification pending for <strong>{pendingPhone}</strong>. Phone will update upon confirmation.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
    type="button"
    onClick={() => handleResend("mobile")}
    disabled={verifying === "mobile"}
    className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-700 hover:bg-amber-100 transition-colors"
  >
                  Resend Code
                </button>
                <button
    type="button"
    onClick={() => handleConfirmVerification("mobile")}
    disabled={verifying === "mobile"}
    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
  >
                  Verify Now
                </button>
              </div>
            </div>}
        </div>

        {
    /* Designation / Title */
  }
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Designation / Title</label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={designation}
    onChange={(e) => setDesignation(e.target.value)}
    disabled={!isEditing}
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-75 disabled:bg-gray-50/70 dark:disabled:bg-neutral-900/50 disabled:cursor-not-allowed"
    placeholder="e.g. Senior Computer Science Instructor"
  />
          </div>
          <p className="text-xs text-caption mt-1">Appears next to your name on course landing pages.</p>
        </div>

        {
    /* Short Bio */
  }
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Short Biography</label>
          <div className="relative">
            <textarea
    rows={4}
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    disabled={!isEditing}
    className="w-full p-4 bg-white border border-border rounded-xl text-sm text-heading focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none disabled:opacity-75 disabled:bg-gray-50/70 dark:disabled:bg-neutral-900/50 disabled:cursor-not-allowed"
    placeholder="Tell students about your expertise, background, and teaching experience..."
  />
          </div>
          <div className="flex justify-between items-center text-xs text-caption mt-1">
            <span>Displayed publicly on course pages and instructor profile cards.</span>
            <span>{bio.length} characters</span>
          </div>
        </div>
      </div>

      {
    /* Buttons */
  }
      {isEditing && (
        <div className="pt-4 flex items-center justify-end gap-3 animate-fade-in">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 border border-border text-heading rounded-xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors disabled:opacity-50 text-sm cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
          </button>
        </div>
      )}
    </form>;
};
var stdin_default = InstructorProfileTab;
export {
  stdin_default as default
};
