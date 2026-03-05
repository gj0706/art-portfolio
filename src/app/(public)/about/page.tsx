import { createClient } from "@/lib/supabase/server";
import { Palette } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Art Portfolio",
  description: "Learn about the artist and the creative journey from age 2 to today.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  // Get site settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*");

  const getSettingValue = (key: string, fallback: string = "") => {
    const setting = settings?.find((s) => s.key === key);
    if (!setting) return fallback;
    try {
      return JSON.parse(setting.value as string);
    } catch {
      return setting.value || fallback;
    }
  };

  const artistName = getSettingValue("artist_name", "Artist");
  const bio = getSettingValue("about_bio", "");
  const heroImage = getSettingValue("hero_image_url", "");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        {heroImage ? (
          <img
            src={heroImage}
            alt={artistName}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <Palette className="h-12 w-12 text-secondary" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-foreground mb-2">{artistName}</h1>
        <p className="text-muted-foreground">Drawing my world since age 2</p>
      </div>

      {bio ? (
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {bio}
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground/70">
            About page coming soon. Check back later!
          </p>
        </div>
      )}

      {/* Timeline placeholder */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Art Journey
        </h2>
        <div className="space-y-6">
          {[
            {
              age: "Age 2-4",
              desc: "First drawings and scribbles. Discovering colors and shapes.",
            },
            {
              age: "Age 5-7",
              desc: "Growing confidence. Drawing animals, people, and scenes from imagination.",
            },
            {
              age: "Age 8-10",
              desc: "Developing technique. Exploring different mediums and styles.",
            },
            {
              age: "Middle School",
              desc: "Refining skills. Yearbook cover winner. Published poem.",
            },
          ].map((milestone) => (
            <div key={milestone.age} className="flex gap-4">
              <div className="shrink-0 w-28 text-sm font-medium text-foreground">
                {milestone.age}
              </div>
              <div className="text-sm text-muted-foreground">{milestone.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
