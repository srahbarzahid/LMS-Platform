import React, { useState, useEffect } from 'react';
import { Globe, Sun, Moon, Monitor, Save, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English (US)' },
  { code: 'Spanish', label: 'Español (Spanish)' },
  { code: 'French', label: 'Français (French)' },
  { code: 'German', label: 'Deutsch (German)' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Arabic', label: 'العربية (Arabic)' },
  { code: 'Chinese', label: '中文 (Mandarin Chinese)' },
  { code: 'Japanese', label: '日本語 (Japanese)' },
];

const StudentPreferencesTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'System'>('System');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/settings/preferences', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        if (data.data.preferredLanguage) setPreferredLanguage(data.data.preferredLanguage);
        if (data.data.theme) setTheme(data.data.theme);
      }
    } catch (err) {
      console.error('Failed to load student UI preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/student/settings/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ preferredLanguage, theme }),
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        toast.success('Display preferences saved successfully!');
      } else {
        toast.error(data.message || 'Failed to save preferences.');
      }
    } catch (err) {
      toast.error('Error saving preferences.');
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
        <h3 className="font-bold text-heading text-lg mb-1">Preferences</h3>
        <p className="text-sm text-caption">Customize your student dashboard language and theme mode.</p>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-heading text-base">Interface Language</h4>
            <p className="text-xs text-caption">Select your preferred language for learning navigation and buttons.</p>
          </div>
        </div>

        <div className="max-w-md pt-2">
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
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

      {/* Theme Preference */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
        <div>
          <h4 className="font-bold text-heading text-base mb-1">Theme Preference</h4>
          <p className="text-xs text-caption">Select how the student portal looks to you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Light Mode */}
          <div
            onClick={() => setTheme('Light')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              theme === 'Light'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-gray-300 bg-gray-50/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              {theme === 'Light' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-heading text-sm">Light Mode</div>
              <div className="text-xs text-caption mt-0.5">Bright, clear layout.</div>
            </div>
          </div>

          {/* Dark Mode */}
          <div
            onClick={() => setTheme('Dark')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              theme === 'Dark'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-gray-300 bg-gray-50/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-200">
                <Moon className="w-5 h-5" />
              </div>
              {theme === 'Dark' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-heading text-sm">Dark Mode</div>
              <div className="text-xs text-caption mt-0.5">Easy on the eyes at night.</div>
            </div>
          </div>

          {/* System Mode */}
          <div
            onClick={() => setTheme('System')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              theme === 'System'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-gray-300 bg-gray-50/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Monitor className="w-5 h-5" />
              </div>
              {theme === 'System' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-heading text-sm">System Default</div>
              <div className="text-xs text-caption mt-0.5">Syncs with system settings.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Preferences
        </button>
      </div>
    </form>
  );
};

export default StudentPreferencesTab;
