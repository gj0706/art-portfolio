"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Milestone {
  age: string;
  desc: string;
}

export default function AdminSettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map: Record<string, any> = {};
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
        .upsert({ key, value: JSON.stringify(value) });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  // Milestones helpers
  const milestones: Milestone[] = Array.isArray(settings.milestones)
    ? settings.milestones
    : [];

  function updateMilestone(
    index: number,
    field: "age" | "desc",
    value: string
  ) {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setSettings((prev) => ({ ...prev, milestones: updated }));
  }

  function addMilestone() {
    setSettings((prev) => ({
      ...prev,
      milestones: [...milestones, { age: "", desc: "" }],
    }));
  }

  function removeMilestone(index: number) {
    setSettings((prev) => ({
      ...prev,
      milestones: milestones.filter((_, i) => i !== index),
    }));
  }

  const fields = [
    { key: "site_title", label: "Site Title", type: "text" },
    { key: "site_description", label: "Site Description", type: "text" },
    {
      key: "artist_name",
      label: "Artist Name (first name only)",
      type: "text",
    },
    { key: "hero_tagline", label: "Hero Tagline", type: "text" },
    { key: "hero_image_url", label: "Hero Image URL", type: "text" },
    { key: "about_bio", label: "About Bio", type: "textarea" },
    {
      key: "contact_email",
      label: "Contact Email (parent email)",
      type: "email",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Site Settings
      </h1>

      <Card className="max-w-2xl">
        <CardContent className="pt-6 space-y-6">
          {fields.map((field) => (
            <div key={field.key}>
              <Label className="mb-1">{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={settings[field.key] || ""}
                  onChange={(e) => updateSetting(field.key, e.target.value)}
                  rows={5}
                />
              ) : (
                <Input
                  type={field.type}
                  value={settings[field.key] || ""}
                  onChange={(e) => updateSetting(field.key, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* Milestones Editor */}
          <div className="border-t pt-6">
            <Label className="mb-1">Art Journey Milestones</Label>
            <p className="text-xs text-muted-foreground/70 mb-3">
              These appear on the About page timeline. Leave empty to show
              defaults.
            </p>

            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={milestone.age}
                    onChange={(e) =>
                      updateMilestone(index, "age", e.target.value)
                    }
                    placeholder="Age / Period"
                    className="w-32"
                  />
                  <Input
                    type="text"
                    value={milestone.desc}
                    onChange={(e) =>
                      updateMilestone(index, "desc", e.target.value)
                    }
                    placeholder="Description"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMilestone(index)}
                    className="text-muted-foreground/70 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="link"
              onClick={addMilestone}
              className="mt-2 px-0"
            >
              + Add milestone
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            {saved && (
              <span className="text-sm text-green-600">Settings saved!</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
