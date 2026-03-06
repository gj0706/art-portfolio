"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ARTWORK_MEDIUMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ArtworkFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMedium = searchParams.get("medium") || "";
  const currentYear = searchParams.get("year") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
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
      <Select
        value={currentMedium || "all"}
        onValueChange={(value) => updateFilter("medium", value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Mediums" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Mediums</SelectItem>
          {ARTWORK_MEDIUMS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentYear || "all"}
        onValueChange={(value) => updateFilter("year", value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All Years" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(currentMedium || currentYear) && (
        <Button
          variant="link"
          onClick={() => router.push("/gallery")}
          className="text-muted-foreground"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
