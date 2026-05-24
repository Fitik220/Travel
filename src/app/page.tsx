"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import { infoCards } from "@/data/countries";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { text } = useLanguage();

  const meteors = [
    { x: "82%", y: "6%", w: "160px", d: "7.5s", delay: "-1s" },
    { x: "64%", y: "14%", w: "110px", d: "9s", delay: "-6s" },
    { x: "96%", y: "24%", w: "190px", d: "8.4s", delay: "-3.2s" },
    { x: "42%", y: "4%", w: "130px", d: "11s", delay: "-8s" },
    { x: "72%", y: "46%", w: "150px", d: "10s", delay: "-4.8s" },
    { x: "90%", y: "62%", w: "125px", d: "12s", delay: "-9.5s" },
    { x: "54%", y: "76%", w: "170px", d: "8.8s", delay: "-2.4s" },
    { x: "28%", y: "18%", w: "105px", d: "13s", delay: "-11s" },
    { x: "78%", y: "84%", w: "140px", d: "9.6s", delay: "-7.2s" },
  ];

  return (
    <main className="cosmic-bg relative min-h-screen overflow-hidden">
      <div className="starfall-field" />
      <div className="meteor-shower">
        {meteors.map((meteor, index) => (
          <span
            key={index}
            style={{
              "--x": meteor.x,
              "--y": meteor.y,
              "--w": meteor.w,
              "--d": meteor.d,
              "--delay": meteor.delay,
            } as CSSProperties}
          />
        ))}
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-12">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FF6B6B] bg-[#FF6B6B]/20">
              <Globe2 className="h-5 w-5 text-[#FF6B6B]" />
            </span>
            <span className="font-semibold tracking-wide text-[#2D2D2D]">Traveler Atlas</span>
          </Link>
        </nav>

        <div className="grid items-end gap-10 py-16 lg:grid-cols-[1fr_0.82fr] lg:py-20">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-[#FF6B6B] bg-[#FF6B6B]/20 px-4 py-2 text-sm text-[#FF6B6B]">
              <ShieldCheck className="h-4 w-4" />
              {text.home.premiumTravelIntelligence}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-[#2D2D2D] sm:text-7xl lg:text-8xl">
              Traveler Atlas
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#666] sm:text-lg">
              {text.home.heroDescription}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/assistant"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#FF6B6B] px-6 py-4 font-semibold text-white transition hover:bg-[#FF8787]"
              >
                {text.home.startPlanning}
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tours"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#20C997] px-6 py-4 font-semibold text-[#2D2D2D] transition hover:border-[#FFD93D] hover:bg-[#FFD93D]/20"
              >
                {text.home.buildATour}
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#FFD93D] px-6 py-4 font-semibold text-[#2D2D2D] transition hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/10"
              >
                Compare countries
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-4xl border-2 border-[#A8E6CF] bg-white/50 p-3 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1100&q=80"
                alt="Sunny tropical coast for travel planning"
                loading="eager"
                decoding="async"
                className="h-72 w-full object-cover sm:h-96"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.52)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-white/80">Bright travel desk</p>
                <p className="mt-2 text-2xl font-semibold">Tours, countries, routes, joy.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {infoCards.map((item, index) => {
              const Icon = item.icon;
              const card = text.home.infoCards[index] ?? item;
              return (
                <div
                  key={String(index)}
                  className="flex items-center justify-between gap-4 rounded-md border-2 border-[#20C997] bg-[#20C997]/10 px-4 py-3"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#999]">{card.label}</p>
                    <p className="mt-1 font-medium text-[#2D2D2D]">{card.value}</p>
                  </div>
                  <Icon className="h-5 w-5 text-[#FF6B6B]" />
                </div>
              );
            })}
            </div>
          </div>
        </div>

        <div className="pb-2 text-sm text-[#999]">
          {text.home.footer}
        </div>
      </section>
    </main>
  );
}
