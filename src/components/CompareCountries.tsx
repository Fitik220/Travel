"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Gauge, Scale, Sparkles } from "lucide-react";
import { averageScore, getCountryComparison, type InsightCountry } from "@/lib/travelInsights";

const metrics = [
  { id: "budget", label: "Budget", description: "Daily travel value" },
  { id: "climate", label: "Climate", description: "Season comfort" },
  { id: "food", label: "Food", description: "Food depth" },
  { id: "safety", label: "Safety", description: "Planning confidence" },
  { id: "prices", label: "Prices", description: "Hotel and daily costs" },
] as const;

export function CompareCountries({ countries }: { countries: InsightCountry[] }) {
  const [leftSlug, setLeftSlug] = useState("japan");
  const [rightSlug, setRightSlug] = useState("turkey");

  const left = countries.find((country) => country.slug === leftSlug) ?? countries[1];
  const right = countries.find((country) => country.slug === rightSlug) ?? countries[5];

  const leftScores = useMemo(() => getCountryComparison(left), [left]);
  const rightScores = useMemo(() => getCountryComparison(right), [right]);
  const leftAverage = averageScore(leftScores);
  const rightAverage = averageScore(rightScores);
  const winner = leftAverage === rightAverage ? "Balanced match" : leftAverage > rightAverage ? left.name : right.name;

  return (
    <main className="cosmic-bg min-h-screen overflow-hidden px-5 py-10 text-[#2D2D2D] sm:px-8 lg:px-10">
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="mt-32 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end\">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FF6B6B] bg-[#FF6B6B]/15 px-4 py-2 text-sm font-semibold text-[#FF6B6B]">
              <Scale className="h-4 w-4" />
              Compare Countries
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight sm:text-7xl">
              Japan vs Turkey, Maldives vs France, any route.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#666]">
              A polished decision board for clients: budget, climate, food, safety and prices in one cinematic comparison.
            </p>
          </div>
          <div className="rounded-4xl border border-[#20C997] bg-white/80 p-6 shadow-2xl shadow-[#20C997]/20 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.26em] text-[#999]">Best current fit</p>
            <p className="mt-3 text-4xl font-semibold text-[#2D2D2D]">{winner}</p>
            <p className="mt-3 text-sm leading-6 text-[#666]">
              Overall score: {left.name} {leftAverage}/100 · {right.name} {rightAverage}/100
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <CountryPicker countries={countries} label="First country" value={leftSlug} onChange={setLeftSlug} />
          <CountryPicker countries={countries} label="Second country" value={rightSlug} onChange={setRightSlug} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CountryPanel country={left} score={leftAverage} />
          <CountryPanel country={right} score={rightAverage} />
        </div>

        <section className="mt-8 rounded-4xl border border-[#DDD] bg-white/80 p-6 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#FF6B6B]">Metric matrix</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#2D2D2D]">Side-by-side decision grid</h2>
            </div>
            <Gauge className="h-8 w-8 text-[#20C997]" />
          </div>
          <div className="mt-6 grid gap-4">
            {metrics.map((metric) => (
              <MetricRow
                key={metric.id}
                label={metric.label}
                description={metric.description}
                leftName={left.name}
                rightName={right.name}
                leftValue={leftScores[metric.id]}
                rightValue={rightScores[metric.id]}
              />
            ))}
          </div>
        </section>

        <Link
          href="/currency"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#20C997] bg-white/70 px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:border-[#FF6B6B]"
        >
          Open fast currency converter
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}

function CountryPicker({
  countries,
  label,
  value,
  onChange,
}: {
  countries: InsightCountry[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 rounded-4xl border border-[#DDD] bg-white/80 p-5 text-sm text-[#666] shadow-xl shadow-[#FF6B6B]/10 backdrop-blur">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-lg font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
      >
        {countries.map((country) => (
          <option key={country.slug} value={country.slug}>
            {country.name} · {country.region}
          </option>
        ))}
      </select>
    </label>
  );
}

function CountryPanel({ country, score }: { country: InsightCountry; score: number }) {
  return (
    <article className="overflow-hidden rounded-4xl border border-[#DDD] bg-white/80 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#999]">{country.region}</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#2D2D2D]">{country.name}</h2>
          </div>
          <div className="rounded-3xl bg-[#FFD93D] px-4 py-3 text-sm font-semibold text-[#2D2D2D]">{score}/100</div>
        </div>
        <p className="mt-5 text-sm leading-7 text-[#666]">{country.intro}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {country.styleTags.slice(0, 7).map((tag) => (
            <span key={tag} className="rounded-full border border-[#20C997] bg-[#20C997]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#2D2D2D]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <InfoCard label="Budget" value={country.budgetRange} />
          <InfoCard label="Hotels" value={country.hotelPriceRange} />
          <InfoCard label="Climate" value={country.climate} />
          <InfoCard label="Best season" value={country.bestSeason} />
        </div>
        <Link href={`/countries/${country.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF6B6B] px-5 py-3 text-sm font-semibold text-white">
          Open country page
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#DDD] bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#999]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#2D2D2D]">{value}</p>
    </div>
  );
}

function MetricRow({
  label,
  description,
  leftName,
  rightName,
  leftValue,
  rightValue,
}: {
  label: string;
  description: string;
  leftName: string;
  rightName: string;
  leftValue: number;
  rightValue: number;
}) {
  const winner = leftValue === rightValue ? "Tie" : leftValue > rightValue ? leftName : rightName;
  return (
    <div className="rounded-3xl border border-[#DDD] bg-white/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[#2D2D2D]">{label}</p>
          <p className="text-sm text-[#666]">{description}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B6B]">
          <Sparkles className="h-4 w-4" />
          {winner}
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <ScoreBar name={leftName} value={leftValue} />
        <ScoreBar name={rightName} value={rightValue} />
      </div>
    </div>
  );
}

function ScoreBar({ name, value }: { name: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-[#666]">
        <span>{name}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#DDD]/40">
        <div className="h-full rounded-full bg-[#20C997]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
