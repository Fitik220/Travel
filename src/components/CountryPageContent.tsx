"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Clock3, Globe2, MapPin, Sparkles } from "lucide-react";
import { ArticleNav } from "@/components/ArticleNav";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeObject } from "@/lib/locale";
import type { Country } from "@/data/countries";
import type { CountryGuide } from "@/data/countryGuides";

interface CountryPageContentProps {
  country: Country;
  guide: CountryGuide;
}

export function CountryPageContent({ country, guide }: CountryPageContentProps) {
  const { locale, text } = useLanguage();

  const localizedCountry = useMemo(
    () => localizeObject(country, locale, country.translations),
    [country, locale],
  );

  const localizedGuide = useMemo(
    () => localizeObject(guide, locale, guide.translations),
    [guide, locale],
  );

  const navItems = localizedGuide.sections.map((section) => ({
    href: `#${section.id}`,
    label: section.title,
  }));

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#2D2D2D]">
      <div
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 78% 8%, ${localizedCountry.accent}22, transparent 28%), radial-gradient(circle at 12% 16%, rgba(255,107,107,0.08), transparent 24%), linear-gradient(180deg, #FFFBF5 0%, #FFF8F0 48%, #FFF5E6 100%)`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(45,45,45,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,45,45,0.02)_1px,transparent_1px)] bg-size-[54px_54px] mask-[linear-gradient(to_bottom,black,transparent_78%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[230px_1fr] lg:px-10">
        <aside className="hidden lg:block">
          <div className="sticky top-8 grid gap-6 text-sm text-[#666]">
            <Link href="/explore" className="inline-flex items-center gap-2 text-[#FF6B6B] transition hover:text-[#FF8787]">
              <ArrowLeft className="h-4 w-4" />
              {text.countryPage.globe}
            </Link>
            <ArticleNav items={navItems} />
          </div>
        </aside>

        <article className="font-serif">
          <header className="min-h-[78vh] pt-4 sm:pt-10">
            <div className="flex items-center justify-between gap-4 font-sans text-sm text-[#666]">
              <Link href="/explore" className="inline-flex items-center gap-2 text-[#FF6B6B] lg:hidden">
                <ArrowLeft className="h-4 w-4" />
                {text.countryPage.globe}
              </Link>
              <Link href="/" className="ml-auto text-[#2D2D2D]">
                {text.countryPage.travelerAtlas}
              </Link>
            </div>

            <p className="mt-10 text-center text-lg tracking-wide text-[#2D2D2D]">{localizedCountry.name}</p>
            <div className="mt-12 max-w-2xl">
              <h1 className="text-3xl leading-10 sm:text-5xl sm:leading-tight text-[#2D2D2D]">
                <span className="underline decoration-[#FF6B6B] decoration-wavy underline-offset-4">{localizedCountry.name}</span>{" "}
                {text.countryPage.is}
                <br />
                <span className="ml-10 text-[#555]">{text.countryPage.readSlowly}</span>
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-[#555]">{localizedCountry.intro}</p>
            </div>

            <div className="mt-10 flex justify-end">
              <img
                src={localizedGuide.heroImage}
                alt={`${localizedCountry.name} landscape`}
                className="h-65 w-full max-w-180 border-2 border-[#FFD93D] object-cover shadow-lg shadow-[#FF6B6B]/20 sm:h-90"
              />
            </div>

            <div className="mt-12 grid gap-3 font-sans text-sm text-[#555] sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-2 border-[#A8E6CF] bg-[#A8E6CF]/10 p-4 rounded-xl">
                <MapPin className="mb-3 h-5 w-5 text-[#20C997]" />
                <p className="uppercase tracking-[0.18em] text-[#999]">{text.countryPage.capital}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.capital}</p>
              </div>
              <div className="border-2 border-[#FFD93D] bg-[#FFD93D]/10 p-4 rounded-xl">
                <Clock3 className="mb-3 h-5 w-5 text-[#FFA500]" />
                <p className="uppercase tracking-[0.18em] text-[#999]">{text.countryPage.bestSeason}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.bestSeason}</p>
              </div>
              <div className="border-2 border-[#FF6B6B] bg-[#FF6B6B]/10 p-4 rounded-xl">
                <Globe2 className="mb-3 h-5 w-5 text-[#FF6B6B]" />
                <p className="uppercase tracking-[0.18em] text-[#999]">{text.countryPage.region}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.region}</p>
              </div>
              <div className="border-2 border-[#DA70D6] bg-[#DA70D6]/10 p-4 rounded-xl">
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#DA70D6]/20 text-[#DA70D6]">
                  {localizedCountry.travelVibe.split("/")[0]}
                </span>
                <p className="uppercase tracking-[0.18em] text-[#999]">{text.countryPage.travelStyle}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.travelStyle}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border-2 border-[#FFD93D] bg-[#FFD93D]/15 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.countryPage.budgetRange}</p>
                <p className="mt-3 text-2xl font-semibold text-[#2D2D2D]">{localizedCountry.budgetRange}</p>
                <p className="mt-2 text-sm leading-6 text-[#666]">{text.countryPage.estimatedTravel}</p>
              </div>
              <div className="rounded-3xl border-2 border-[#FF6B6B] bg-[#FF6B6B]/15 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.countryPage.flightEstimate}</p>
                <p className="mt-3 text-2xl font-semibold text-[#2D2D2D]">{localizedCountry.flightEstimateRange}</p>
                <p className="mt-2 text-sm leading-6 text-[#666]">{text.countryPage.roundTrip}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border-2 border-[#A8E6CF] bg-[#A8E6CF]/15 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.countryPage.duration}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.recommendedDuration}</p>
              </div>
              <div className="rounded-3xl border-2 border-[#20C997] bg-[#20C997]/15 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.countryPage.hotelRange}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.hotelPriceRange}</p>
              </div>
              <div className="rounded-3xl border-2 border-[#DA70D6] bg-[#DA70D6]/15 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.countryPage.dailyBudget}</p>
                <p className="mt-2 text-lg text-[#2D2D2D]">{localizedCountry.estimatedDailyBudget.currency} {localizedCountry.estimatedDailyBudget.low}-{localizedCountry.estimatedDailyBudget.high}</p>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={`/tours?country=${localizedCountry.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-[#FF6B6B] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#FF8787]"
              >
                {text.common.buildTourForCountry}
              </Link>
              <p className="max-w-xl text-center text-sm text-[#666] sm:text-left">
                {text.countryPage.startPremiumTour.replace("{country}", localizedCountry.name)}
              </p>
            </div>
          </header>

          <section className="border-y border-[#DDD] py-12" id="facts">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#FF6B6B]" />
              <h2 className="text-2xl text-[#2D2D2D]">{text.countryPage.shortFacts}</h2>
            </div>
            <div className="mt-8 grid gap-5 font-sans md:grid-cols-2">
              {localizedGuide.quickFacts.map((fact) => (
                <div key={fact.title} className="border-l-4 border-[#FFD93D] bg-[#FFD93D]/10 p-5 rounded-r-lg">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#999]">{fact.title}</p>
                  <p className="mt-2 leading-7 text-[#555]">{fact.text}</p>
                </div>
              ))}
            </div>
          </section>

          {localizedGuide.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-10 py-14">
              <p className="font-sans text-xs uppercase tracking-[0.28em] text-[#FF6B6B]">{section.eyebrow}</p>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl text-[#2D2D2D]">{section.title}</h2>
              <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
                <div className="grid gap-6 text-lg leading-9 text-[#555]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="font-sans">
                  {section.items ? (
                    <div className="grid gap-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={item.title} className="border-2 border-[#20C997] bg-[#20C997]/10 p-4 rounded-lg shadow-lg shadow-[#20C997]/20">
                          <p className="text-sm text-[#999]">{String(itemIndex + 1).padStart(2, "0")}</p>
                          <h3 className="mt-2 text-lg font-semibold text-[#2D2D2D]">{item.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-[#666]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {section.id === "food" ? (
                <div className="mt-10 grid items-end gap-6 md:grid-cols-[1fr_0.9fr]">
                  <div className="grid gap-4 font-sans text-[#555]">
                    {section.items?.map((food, foodIndex) => (
                      <div key={food.title} className="border-l-4 border-[#FF6B6B] pl-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{foodIndex + 1}) {food.title}</p>
                        <p className="mt-2 text-sm leading-6 text-[#555]">{food.text}</p>
                      </div>
                    ))}
                  </div>
                  <img src={localizedGuide.foodImage} alt={`${localizedCountry.name} food`} className="h-65 w-full object-cover rounded-lg shadow-lg shadow-[#FF6B6B]/20" />
                </div>
              ) : null}

              {section.id === "places" ? (
                <div className="mt-10 grid items-start gap-6 md:grid-cols-[0.86fr_1fr]">
                  <div className="font-sans text-base leading-8 text-[#555]">
                    <p className="mb-3 font-serif text-2xl text-[#2D2D2D]">{text.countryPage.popularPlaces}</p>
                    {section.items?.map((place, placeIndex) => (
                      <div key={place.title} className="mb-4">
                        <p className="font-semibold text-[#2D2D2D]">{placeIndex + 1}) {place.title}</p>
                        <p className="text-sm leading-6 text-[#666]">{place.text}</p>
                      </div>
                    ))}
                  </div>
                  <img src={localizedGuide.placeImage} alt={`${localizedCountry.name} popular place`} className="h-75 w-full object-cover rounded-lg shadow-lg shadow-[#A8E6CF]/20" />
                </div>
              ) : null}

              {index < localizedGuide.sections.length - 1 ? <div className="mt-14 border-b border-[#DDD]" /> : null}
            </section>
          ))}

          <footer className="pb-16 pt-6">
            <div className="border-t border-[#DDD] pt-10">
              <div className="bg-gradient-to-br from-[#FFD93D]/20 to-[#FF6B6B]/20 p-6 rounded-xl shadow-lg shadow-[#FF6B6B]/15 sm:p-8">
                <p className="font-sans text-xs uppercase tracking-[0.24em] text-[#FF6B6B]">{text.countryPage.finishedReading}</p>
                <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl text-[#2D2D2D]">{text.countryPage.wantHelp.replace("{country}", localizedCountry.name)}</h2>
                <p className="mt-4 max-w-2xl font-sans leading-7 text-[#666]">{text.countryPage.footer}</p>
                <a
                  href="https://t.me/yourusername"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center justify-center bg-[#FF6B6B] px-6 py-4 font-sans font-semibold text-white transition hover:bg-[#FF8787] rounded-full"
                >
                  {text.countryPage.contactServices}
                </a>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
