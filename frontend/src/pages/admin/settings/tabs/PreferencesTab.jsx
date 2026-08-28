import { useState, useEffect } from "react";
import { Globe, Sun, Moon, Monitor, Save, RefreshCw, Check } from "lucide-react";
import toast from "react-hot-toast";
import apiClient, { normalizeApiPath } from "../../../../api/client";

const SUPPORTED_LANGUAGES = [
  { code: "English", label: "English (US)" },
  { code: "Spanish", label: "Español (Spanish)" },
  { code: "French", label: "Français (French)" },
  { code: "German", label: "Deutsch (German)" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "Arabic", label: "العربية (Arabic)" },
  { code: "Chinese", label: "中文 (Mandarin Chinese)" },
  { code: "Japanese", label: "日本語 (Japanese)" }
];

const applyThemeToDOM = (selectedTheme) => {
  localStorage.setItem("app_theme", selectedTheme);
  const isDark = selectedTheme === "Dark" || (selectedTheme === "System" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  window.dispatchEvent(new Event("themeChange"));
};

const applyLanguageToDOM = (selectedLanguage) => {
  localStorage.setItem("app_language", selectedLanguage);
  document.documentElement.setAttribute("lang", (selectedLanguage || "en").toLowerCase());
  window.dispatchEvent(new Event("languageChange"));
};

const PreferencesTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [theme, setTheme] = useState("System");

  useEffect(() => {
    fetchPreferences();

    const handleGlobalThemeChange = () => {
      const savedTheme = localStorage.getItem("app_theme") || "System";
      setTheme(savedTheme);
    };

    window.addEventListener("themeChange", handleGlobalThemeChange);
    return () => window.removeEventListener("themeChange", handleGlobalThemeChange);
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(normalizeApiPath("/admin/settings/preferences"));
      const data = res.data;
      if (data.status === "success" && data.data) {
        if (data.data.preferredLanguage) {
          setPreferredLanguage(data.data.preferredLanguage);
          applyLanguageToDOM(data.data.preferredLanguage);
        }
        if (data.data.theme) {
          setTheme(data.data.theme);
          applyThemeToDOM(data.data.theme);
        }
      }
    } catch (err) {
      console.error("Failed to load user preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (lang) => {
    setPreferredLanguage(lang);
    applyLanguageToDOM(lang);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    applyThemeToDOM(selectedTheme);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiClient.patch(normalizeApiPath("/admin/settings/preferences"), {
        preferredLanguage,
        theme
      });
      const data = res.data;
      if (data.status === "success") {
        applyThemeToDOM(theme);
        applyLanguageToDOM(preferredLanguage);
        toast.success("UI Preferences saved successfully!");
      } else {
        toast.error(data.message || "Failed to save preferences.");
      }
    } catch (err) {
      toast.error("Error saving preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
      <div>
        <h3 className="font-bold text-heading text-lg mb-1">Display & Regional Preferences</h3>
        <p className="text-sm text-caption">Customize your admin workspace language and visual theme.</p>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-heading text-base">Language Preference</h4>
            <p className="text-xs text-caption">Select the default interface language for your admin account.</p>
          </div>
        </div>

        <div className="max-w-md pt-2">
          <select
            value={preferredLanguage}
            onChange={(e) => handleLanguageSelect(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm font-medium text-heading focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
        <div>
          <h4 className="font-bold text-heading text-base mb-1">Visual Theme</h4>
          <p className="text-xs text-caption">Choose your preferred color theme mode for the admin dashboard.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Light Theme Option */}
          <div
            onClick={() => handleThemeSelect("Light")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              theme === "Light" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-gray-300 bg-gray-50/50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              {theme === "Light" && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-heading text-sm">Light Mode</div>
              <div className="text-xs text-caption mt-0.5">Clean high-contrast background.</div>
            </div>
          </div>

          {/* Dark Theme Option */}
          <div
            onClick={() => handleThemeSelect("Dark")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              theme === "Dark" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-gray-300 bg-gray-50/50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-200">
                <Moon className="w-5 h-5" />
              </div>
              {theme === "Dark" && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-heading text-sm">Dark Mode</div>
              <div className="text-xs text-caption mt-0.5">Sleek, low-light environment.</div>
            </div>
          </div>

          {/* System Theme Option */}
          <div
            onClick={() => handleThemeSelect("System")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              theme === "System" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-gray-300 bg-gray-50/50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Monitor className="w-5 h-5" />
              </div>
              {theme === "System" && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-heading text-sm">System Default</div>
              <div className="text-xs text-caption mt-0.5">Match operating system setting.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Preferences
        </button>
      </div>
    </form>
  );
};

export default PreferencesTab;
