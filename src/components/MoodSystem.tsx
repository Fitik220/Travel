"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { getMoodMatches, moods, type InsightCountry, type Mood } from "@/lib/travelInsights";

const moodCopy: Record<Mood, string> = {
  Relax: "Slow mornings, soft hotels, beach time, wellness and gentle city walks.",
  Adventure: "Mountains, water, safaris, hikes, deserts and big stories.",
  Luxury: "Premium hotels, private tours, fine dining and cinematic routes.",
  Nature: "Landscapes, coastlines, forests, wildlife and fresh air.",
  Nightlife: "Cities, rooftop evenings, food streets, music and late energy.",
  Romantic: "Beautiful views, boutique stays, dinners and calm shared moments.",
  Family: "Comfortable pace, clear logistics, safe cities and flexible activities.",
};

export function MoodSystem({ countries }: { countries: InsightCountry[] }) {
  const [activeMood, setActiveMood] = useState<Mood>("Relax");
  const matches = useMemo(() => getMoodMatches(countries, activeMood, 9), [activeMood, countries]);
  const top = matches[0]?.country;

  return (
    <main className="cosmic-bg min-h-screen px-5 py-10 text-[#2D2D2D] sm:px-8 lg:px-10">
      <section className="relative z-10 mx-auto max-w-7xl">
        <header className="mt-32 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end\">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FF6B6B] bg-[#FF6B6B]/15 px-4 py-2 text-sm font-semibold text-[#FF6B6B]">
              <Heart className="h-4 w-4" />
              Travel Mood System
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight sm:text-7xl">
              Pick the feeling first. The route follows.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#666]">
              Modern подбор стран по настроению: Relax, Adventure, Luxury, Nature, Nightlife, Romantic and Family. It reads country tags, city vibes, activities and budgets.
            </p>
          </div>

          <div className="rounded-4xl border border-[#20C997] bg-white/80 p-6 shadow-2xl shadow-[#20C997]/20 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-[#999]">Best match now</p>
            <p className="mt-3 text-4xl font-semibold text-[#2D2D2D]">{top?.name}</p>
            <p className="mt-3 text-sm leading-6 text-[#666]">{top?.travelVibe}</p>
          </div>
        </header>

        <div className="mt-10 flex flex-wrap gap-3">
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => setActiveMood(mood)}
              className={[
                "rounded-full border px-5 py-3 text-sm font-semibold transition",
                mood === activeMood
                  ? "border-[#FF6B6B] bg-[#FF6B6B] text-white shadow-xl shadow-[#FF6B6B]/20"
                  : "border-[#DDD] bg-white/70 text-[#2D2D2D] hover:border-[#20C997]",
              ].join(" ")}
            >
              {mood}
            </button>
          ))}
        </div>

        <section className="mt-8 rounded-4xl border border-[#DDD] bg-white/80 p-6 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#FF6B6B]">{activeMood}</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#2D2D2D]">{moodCopy[activeMood]}</h2>
            </div>
            <Sparkles className="h-8 w-8 text-[#FFD93D]" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map(({ country, score }, index) => (
              <article
                key={country.slug}
                className="group rounded-3xl border border-[#DDD] bg-white/70 p-5 transition hover:-translate-y-1 hover:border-[#FF6B6B] hover:shadow-2xl hover:shadow-[#FF6B6B]/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#999]">#{index + 1} match</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#2D2D2D]">{country.name}</h3>
                  </div>
                  <span className="rounded-2xl bg-[#FFD93D]/25 px-3 py-2 text-sm font-semibold text-[#2D2D2D]">
                    {Math.round(score)}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#666]">{country.intro}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {country.styleTags.slice(0, 6).map((tag) => (
                    <span key={tag} className="rounded-full border border-[#20C997] bg-[#20C997]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#2D2D2D]">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/countries/${country.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B6B]">
                  Open guide
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
