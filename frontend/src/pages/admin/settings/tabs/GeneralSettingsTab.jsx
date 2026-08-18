import { useState, useEffect } from "react";
import { Building2, Upload, Trash2, Mail, Phone, Clock, Globe, Sun, Save, RefreshCw, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
const SUPPORTED_LANGUAGES = [
  { code: "English", label: "English (US)" },
  { code: "Spanish", label: "Espa\xF1ol (Spanish)" },
  { code: "French", label: "Fran\xE7ais (French)" },
  { code: "German", label: "Deutsch (German)" },
  { code: "Hindi", label: "\u0939\u093F\u0928\u094D\u0926\u0940 (Hindi)" },
  { code: "Arabic", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (Arabic)" },
  { code: "Chinese", label: "\u4E2D\u6587 (Mandarin Chinese)" },
  { code: "Japanese", label: "\u65E5\u672C\u8A9E (Japanese)" }
];
const GeneralSettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lmsName, setLmsName] = useState("LMS Platform");
  const [logoUrl, setLogoUrl] = useState(null);
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [defaultTheme, setDefaultTheme] = useState("System");
  const [supportEmail, setSupportEmail] = useState("support@lms.com");
  const [supportPhone, setSupportPhone] = useState("+1-800-555-0199");
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  useEffect(() => {
    fetchPlatformSettings();
  }, []);
  const fetchPlatformSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/platform", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      if (data.status === "success" && data.data) {
        setLmsName(data.data.lmsName || "LMS Platform");
        setLogoUrl(data.data.logoUrl || null);
        setDefaultLanguage(data.data.defaultLanguage || "English");
        setDefaultTheme(data.data.defaultTheme || "System");
        setSupportEmail(data.data.supportEmail || "support@lms.com");
        setSupportPhone(data.data.supportPhone || "+1-800-555-0199");
        setSessionTimeout(data.data.sessionTimeout || 60);
      }
    } catch (err) {
      console.error("Failed to load platform settings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveLogo = () => {
    setSelectedLogoFile(null);
    setPreviewLogo(null);
    setLogoUrl(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("lmsName", lmsName);
      formData.append("defaultLanguage", defaultLanguage);
      formData.append("defaultTheme", defaultTheme);
      formData.append("supportEmail", supportEmail);
      formData.append("supportPhone", supportPhone);
      formData.append("sessionTimeout", sessionTimeout.toString());
      if (selectedLogoFile) {
        formData.append("logo", selectedLogoFile);
      }
      if (!logoUrl && !previewLogo) {
        formData.append("removeLogo", "true");
      }
      const res = await fetch("/api/admin/settings/platform", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success(data.message || "General platform settings updated!");
        if (data.data && data.data.logoUrl) {
          setLogoUrl(data.data.logoUrl);
          setPreviewLogo(null);
        }
      } else {
        toast.error(data.message || "Failed to update platform settings.");
      }
    } catch (err) {
      toast.error("An error occurred while saving platform settings.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>;
  }
  const currentLogo = previewLogo || logoUrl;
  return <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-heading text-lg mb-1 flex items-center gap-2">
            General Platform Settings <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-bold">Admin Only</span>
          </h3>
          <p className="text-sm text-caption">Configure LMS branding, new user defaults, and system session security.</p>
        </div>
      </div>

      {
    /* 1. LMS Branding & Logo */
  }
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-heading text-base">Platform Identity & Branding</h4>
            <p className="text-xs text-caption">Appears across header, login pages, and transactional emails.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">LMS Platform Name</label>
            <input
    type="text"
    value={lmsName}
    onChange={(e) => setLmsName(e.target.value)}
    required
    className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    placeholder="e.g. EduPulse LMS"
  />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Platform Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {currentLogo ? <img src={currentLogo} alt="LMS Logo" className="w-full h-full object-contain p-1" /> : <BookOpen className="w-8 h-8 text-primary" />}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-heading hover:bg-gray-100 cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-sm">
                    <Upload className="w-3.5 h-3.5" /> Upload Logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                  {currentLogo && <button
    type="button"
    onClick={handleRemoveLogo}
    className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors inline-flex items-center gap-1.5"
  >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>}
                </div>
                <p className="text-[11px] text-caption">PNG, SVG, or WEBP. Transparent background recommended.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* 2. New User Defaults */
  }
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
        <div className="pb-4 border-b border-border">
          <h4 className="font-bold text-heading text-base">New User Default Settings</h4>
          <p className="text-xs text-caption">Default environment settings assigned when new students/instructors sign up.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Default Language</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
    value={defaultLanguage}
    onChange={(e) => setDefaultLanguage(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
  >
                {SUPPORTED_LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Default Theme Mode</label>
            <div className="relative">
              <Sun className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
    value={defaultTheme}
    onChange={(e) => setDefaultTheme(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm font-medium text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
  >
                <option value="Light">Light Mode</option>
                <option value="Dark">Dark Mode</option>
                <option value="System">System Default</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {
    /* 3. Support & Session Security */
  }
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
        <div className="pb-4 border-b border-border">
          <h4 className="font-bold text-heading text-base">Support Channels & Session Security</h4>
          <p className="text-xs text-caption">Public help desk contact details and session expiration limits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Support Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type="email"
    value={supportEmail}
    onChange={(e) => setSupportEmail(e.target.value)}
    required
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    placeholder="support@lms.com"
  />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Support Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type="tel"
    value={supportPhone}
    onChange={(e) => setSupportPhone(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
    placeholder="+1-800-555-0199"
  />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-caption mb-2">Session Timeout (Minutes)</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-caption absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type="number"
    min={5}
    max={1440}
    value={sessionTimeout}
    onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 60)}
    required
    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
  />
            </div>
            <p className="text-[11px] text-caption mt-1">Inactivity duration before automatic logout (5 - 1440 mins).</p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
    type="submit"
    disabled={saving}
    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors disabled:opacity-50"
  >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Platform Settings
        </button>
      </div>
    </form>;
};
var stdin_default = GeneralSettingsTab;
export {
  stdin_default as default
};
