"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ARTWORK_MEDIUMS } from "@/lib/constants";

export function ArtworkFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMedium = searchParams.get("medium") || "";
  const currentYear = searchParams.get("year") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/gallery?${params.toString()}`);
  }

  // Generate year options from 2014 to current year
  const currentYearNum = new Date().getFullYear();
  const years = Array.from(
    { length: currentYearNum - 2013 },
    (_, i) => currentYearNum - i
  );

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={currentMedium}
        onChange={(e) => updateFilter("medium", e.target.value)}
        className="px-3 py-2 border border-input rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Mediums</option>
        {ARTWORK_MEDIUMS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <select
        value={currentYear}
        onChange={(e) => updateFilter("year", e.target.value)}
        className="px-3 py-2 border border-input rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {(currentMedium || currentYear) && (
        <button
          onClick={() => router.push("/gallery")}
          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
