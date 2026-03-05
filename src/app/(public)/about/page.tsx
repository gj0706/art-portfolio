import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/lib/constants";
import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerChildren } from "@/components/motion/stagger-children";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Anna's Art Adventure",
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

  // Dynamic milestones from settings, with hardcoded defaults as fallback
  const milestonesRaw = getSettingValue("milestones", "[]");
  const milestones: { age: string; desc: string }[] = Array.isArray(
    milestonesRaw
  )
    ? milestonesRaw
    : [];

  const defaultMilestones = [
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
  ];

  const timelineMilestones =
    milestones.length > 0 ? milestones : defaultMilestones;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artistName,
    description: bio || "Young artist and creative mind",
    url: SITE_CONFIG.url,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <FadeIn className="text-center mb-12">
        <div>
          {heroImage ? (
            <Image
              src={heroImage}
              alt={artistName}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="font-serif text-3xl text-muted-foreground/40">
                {artistName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="font-serif text-3xl font-normal text-foreground mb-2">{artistName}</h1>
          <p className="text-muted-foreground">Drawing my world since age 2</p>
        </div>
      </FadeIn>

      {bio ? (
        <FadeIn delay={0.2}>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {bio}
            </p>
          </div>
        </FadeIn>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground/70">
            About page coming soon. Check back later!
          </p>
        </div>
      )}

      {/* Art Journey Timeline */}
      <FadeIn delay={0.3}>
        <div className="mt-12 pt-8">
          <h2 className="font-serif text-xl font-normal text-foreground mb-6">
            Art Journey
          </h2>
          <StaggerChildren className="space-y-6">
            {timelineMilestones.map((milestone) => (
              <div key={milestone.age} className="flex gap-4">
                <div className="shrink-0 w-28 text-sm font-medium text-foreground">
                  {milestone.age}
                </div>
                <div className="text-sm text-muted-foreground">{milestone.desc}</div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </FadeIn>
    </div>
  );
}
