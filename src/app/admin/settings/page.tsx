"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const map: Record<string, string> = {};
        for (const s of data) {
          try {
            map[s.key] = JSON.parse(s.value as string);
          } catch {
            map[s.key] = s.value as string;
          }
        }
        setSettings(map);
      }
    }
    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();

    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("site_settings")
        .update({ value: JSON.stringify(value) })
        .eq("key", key);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const fields = [
    { key: "site_title", label: "Site Title", type: "text" },
    { key: "site_description", label: "Site Description", type: "text" },
    { key: "artist_name", label: "Artist Name (first name only)", type: "text" },
    { key: "hero_tagline", label: "Hero Tagline", type: "text" },
    { key: "hero_image_url", label: "Hero Image URL", type: "text" },
    { key: "about_bio", label: "About Bio", type: "textarea" },
    { key: "contact_email", label: "Contact Email (parent email)", type: "email" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      <div className="bg-white rounded-xl border p-6 max-w-2xl space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={settings[field.key] || ""}
                onChange={(e) => updateSetting(field.key, e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type={field.type}
                value={settings[field.key] || ""}
                onChange={(e) => updateSetting(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-sm text-green-600">Settings saved!</span>
          )}
        </div>
      </div>
    </div>
  );
}
