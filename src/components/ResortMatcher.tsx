"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Filter, Star } from "lucide-react";
import { resorts } from "@/data/resorts";
import { moods, type Mood } from "@/lib/travelInsights";

export function ResortMatcher() {
  const [country, setCountry] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3500);
  const [people, setPeople] = useState(2);
  const [stars, setStars] = useState("All");
  const [mealPlan, setMealPlan] = useState("All");
  const [mood, setMood] = useState<Mood>("Relax");
  const [date, setDate] = useState("2026-09-01");

  const countries = useMemo(() => ["All", ...Array.from(new Set(resorts.map((resort) => resort.country)))], []);
  const mealPlans = useMemo(() => ["All", ...Array.from(new Set(resorts.map((resort) => resort.mealPlan)))], []);

  const filtered = useMemo(() => {
    const targetDate = new Date(date).getTime();
    return resorts
      .filter((resort) => country === "All" || resort.country === country)
      .filter((resort) => resort.pricePerPerson <= maxPrice)
      .filter((resort) => people >= resort.peopleMin && people <= resort.peopleMax)
      .filter((resort) => stars === "All" || resort.stars === Number(stars))
      .filter((resort) => mealPlan === "All" || resort.mealPlan === mealPlan)
      .filter((resort) => resort.moods.includes(mood))
      .map((resort) => {
        const dateDistance = Math.abs(new Date(resort.departureDate).getTime() - targetDate) / 86400000;
        return { resort, fit: Math.max(0, Math.round(resort.score - dateDistance * 0.45)) };
      })
      .sort((a, b) => b.fit - a.fit || a.resort.pricePerPerson - b.resort.pricePerPerson);
  }, [country, date, maxPrice, mealPlan, mood, people, stars]);

  return (
    <main className="cosmic-bg min-h-screen px-5 py-10 text-[#2D2D2D] sm:px-8 lg:px-10">
      <section className="relative z-10 mx-auto max-w-7xl">
        <header className="mt-32">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FF6B6B] bg-[#FF6B6B]/15 px-4 py-2 text-sm font-semibold text-[#FF6B6B]">
            <Filter className="h-4 w-4" />
            Resort Matcher
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-tight sm:text-7xl">
            Client resort selection, filtered like a premium agency desk.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#666]">
            Add client resort data later; this page is ready for filters by price, people, country, hotel stars, meal plan, departure date and travel mood.
          </p>
        </header>

        <section className="mt-8 rounded-4xl border border-[#DDD] bg-white/80 p-6 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
          <div className="grid gap-4 lg:grid-cols-6">
            <SelectFilter label="Country" value={country} values={countries} onChange={setCountry} />
            <SelectFilter label="Stars" value={stars} values={["All", "3", "4", "5"]} onChange={setStars} />
            <SelectFilter label="Meal" value={mealPlan} values={mealPlans} onChange={setMealPlan} />
            <label className="grid gap-2 text-sm text-[#666]">
              People
              <input
                type="number"
                min={1}
                max={12}
                value={people}
                onChange={(event) => setPeople(Math.max(1, Number(event.target.value) || 1))}
                className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#666]">
              Max price
              <input
                type="number"
                min={300}
                step={50}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Math.max(300, Number(event.target.value) || 300))}
                className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#666]">
              Departure
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {moods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMood(item)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  item === mood ? "border-[#20C997] bg-[#20C997]/20 text-[#2D2D2D]" : "border-[#DDD] bg-white/70 text-[#666]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {filtered.map(({ resort, fit }) => (
            <article key={resort.id} className="overflow-hidden rounded-4xl border border-[#DDD] bg-white/80 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={resort.image}
                  alt={resort.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_10%,rgba(0,0,0,0.65)_100%)]" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm uppercase tracking-[0.22em] text-white/75">{resort.country}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{resort.name}</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge>{resort.stars} stars</Badge>
                  <Badge>{resort.mealPlan}</Badge>
                  <Badge>{resort.nights} nights</Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Info label="Price / person" value={`USD ${resort.pricePerPerson}`} />
                  <Info label="Fit score" value={`${fit}/100`} />
                  <Info label="People" value={`${resort.peopleMin}-${resort.peopleMax}`} />
                  <Info label="Date" value={resort.departureDate} />
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-[#666]">
                  <CalendarDays className="h-4 w-4 text-[#FF6B6B]" />
                  {resort.city}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resort.moods.map((item) => (
                    <span key={item} className="rounded-full bg-[#FFD93D]/20 px-3 py-1 text-xs font-semibold text-[#2D2D2D]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {!filtered.length ? (
          <div className="mt-8 rounded-4xl border border-[#DDD] bg-white/80 p-8 text-center shadow-2xl shadow-[#FF6B6B]/20">
            <Star className="mx-auto h-8 w-8 text-[#FFD93D]" />
            <h2 className="mt-3 text-2xl font-semibold text-[#2D2D2D]">No resorts match yet</h2>
            <p className="mt-2 text-[#666]">Loosen price, date, people count or mood filters.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function SelectFilter({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm text-[#666]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#20C997] bg-[#20C997]/10 px-3 py-1 text-xs font-semibold text-[#2D2D2D]">
      {children}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#DDD] bg-white/70 p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[#999]">{label}</p>
      <p className="mt-1 font-semibold text-[#2D2D2D]">{value}</p>
    </div>
  );
}
