"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Globe2, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { countries } from "@/data/countries";
import { TranslationText } from "@/lib/locale";
import { localizeObject } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

type AnswerSection = {
  title: string;
  text: string;
  items?: string[];
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  sections?: AnswerSection[];
};

const moodMap = [
  { type: "Luxury", terms: ["luxury", "premium", "boutique", "high-end", "5-star"] },
  { type: "Budget", terms: ["budget", "cheap", "affordable", "economy", "value"] },
  { type: "Adventure", terms: ["adventure", "trek", "hike", "wild", "outdoor"] },
  { type: "Nature", terms: ["nature", "eco", "green", "sky", "landscape"] },
  { type: "City", terms: ["city", "urban", "culture", "downtown", "metro"] },
];

function getNormalized(text: string) {
  return text.trim().toLowerCase();
}

function findMood(prompt: string) {
  const normalized = getNormalized(prompt);
  const match = moodMap.find((item) => item.terms.some((term) => normalized.includes(term)));
  return match?.type ?? "Balanced";
}

function findBudgetIntent(prompt: string) {
  const normalized = getNormalized(prompt);
  if (/(budget|cheap|affordable|economy|value)/.test(normalized)) return "budget";
  if (/(luxury|premium|boutique|high-end|5-star)/.test(normalized)) return "luxury";
  return undefined;
}

function generateAssistantMessage(prompt: string, text: TranslationText, locale: Locale): ChatMessage {
  const normalized = getNormalized(prompt);
  const localizedCountries = countries.map((country) => localizeObject(country, locale, country.translations));
  const localizedAllCities = localizedCountries.flatMap((country) => country.cities.map((city) => ({ country, city })));
  const cityMatch = localizedAllCities.find((item) => normalized.includes(item.city.name.toLowerCase()));
  const countryMatch = localizedCountries.find((country) => normalized.includes(country.name.toLowerCase()));
  const mood = findMood(prompt);
  const budgetIntent = findBudgetIntent(prompt);

  function scoreCountryLocal(country: typeof localizedCountries[number], promptText: string) {
    const n = getNormalized(promptText);
    let score = 0;
    if (n.includes(country.name.toLowerCase())) score += 30;
    if (country.travelVibe.toLowerCase().includes(n)) score += 18;
    if (country.travelStyle.toLowerCase().includes(n)) score += 14;
    if (country.styleTags.some((tag) => n.includes(tag.toLowerCase()))) score += 12;
    if (n.includes(country.region.toLowerCase())) score += 10;
    return score;
  }

  function findTopDestinationsLocal(promptText: string, limit = 5) {
    const budget = findBudgetIntent(promptText);
    return localizedCountries
      .map((country) => {
        let score = scoreCountryLocal(country, promptText);
        if (budget && country.budgetLevel === budget) score += 14;
        return { country, score };
      })
      .sort((a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name))
      .filter((item) => item.score > 0)
      .slice(0, limit)
      .map((item) => item.country);
  }

  if (cityMatch) {
    const { country, city } = cityMatch;
    return {
      role: "assistant",
      text: text.assistant.cityPlanText.replace("{city}", city.name).replace("{country}", country.name),
      sections: [
        {
          title: text.assistant.cityHighlightTitle,
          text: `${city.name} ${text.assistant.cityHighlightText} ${country.name}.`,
          items: city.topAttractions,
        },
        {
          title: text.assistant.routeWhyTitle,
          text: `${country.name} ${text.assistant.routeWhyText} ${country.travelVibe.toLowerCase()} ${text.assistant.andLabel} ${country.travelStyle.toLowerCase()}.`,
          items: [
            `${text.assistant.bestSeasonLabel}: ${country.bestSeason}`,
            `${text.assistant.budgetRangeLabel}: ${country.budgetRange}`,
            `${text.assistant.recommendedDurationLabel}: ${country.recommendedDuration}`,
          ],
        },
        {
          title: text.assistant.smartNextStepsTitle,
          text: text.assistant.smartNextStepsText.replace("{city}", city.name),
          items: text.assistant.sampleTips.slice(0, 3),
        },
      ],
    };
  }

  if (countryMatch) {
    const primary = countryMatch;
    return {
      role: "assistant",
      text: text.assistant.countryRecommendationText.replace("{country}", primary.name),
      sections: [
        {
          title: text.assistant.destinationSnapshotTitle,
          text: primary.overview,
          items: [
            `${text.assistant.travelVibeLabel}: ${primary.travelVibe}`,
            `${text.assistant.bestSeasonLabel}: ${primary.bestSeason}`,
            `${text.assistant.budgetLabel}: ${primary.budgetRange}`,
          ],
        },
        {
          title: text.assistant.cityHighlightsTitle,
          text: `${text.assistant.topUrbanStopsText} ${primary.name}.`,
          items: primary.cities.slice(0, 3).map((city) => `${city.name} - ${city.vibe}`),
        },
        {
          title: text.assistant.recommendedStartTitle,
          text: text.assistant.recommendedStartText.replace("{city}", primary.popularCities[0]),
          items: text.assistant.sampleTips.slice(0, 3),
        },
      ],
    };
  }

  const recommendations = findTopDestinationsLocal(prompt, 5);
  const fallback = recommendations.length ? recommendations : localizedCountries.slice(0, 5);

  return {
    role: "assistant",
    text: text.assistant.bestTravelMatchesText.replace("{mood}", mood.toLowerCase()),
    sections: [
      {
        title: text.assistant.bestFitDestinationsTitle,
        text: budgetIntent
          ? text.assistant.budgetIntentText.replace("{budgetIntent}", budgetIntent)
          : text.assistant.moodTravelText,
        items: fallback.map((country) => `${country.name} - ${country.travelVibe} · ${country.budgetRange}`),
      },
      {
        title: text.assistant.planningSnapshotTitle,
        text: text.assistant.planningSnapshotText,
      },
      {
        title: text.assistant.actionTipsTitle,
        text: text.assistant.actionTipsText,
        items: text.assistant.sampleTips.slice(0, 3),
      },
    ],
  };
}

export function TravelAssistant() {
  const { text, locale } = useLanguage();
  const [input, setInput] = useState<string>(text.assistant.suggestions[0]?.prompt ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: text.assistant.initialMessage,
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handlePromptSelect = (value: string) => {
    setInput(value);
    handleSubmit(value);
  };

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    const userMessage: ChatMessage = { role: "user", text: value };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      const reply = generateAssistantMessage(value, text, locale);
      setMessages((current) => [...current, reply]);
      setIsThinking(false);
    }, 600);
  };

  
  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#2D2D2D]">
      <div className="pointer-events-none fixed inset-0 opacity-50 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.12),transparent_28%),radial-gradient(circle_at_30%_20%,rgba(255,111,145,0.1),transparent_22%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <section className="lg:w-[58%]">
            <div className="rounded-4xl border border-[#DDD] bg-[#FFFBF5] p-8 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF6B6B]">{text.assistant.aiSection}</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2D2D2D] sm:text-5xl">
                    {text.assistant.heading}
                  </h1>
                </div>
                <div className="rounded-3xl bg-[#FFD93D] px-4 py-3 text-sm font-semibold text-[#2D2D2D]">{text.assistant.noApiNeeded}</div>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#666]">
                {text.assistant.description}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {text.assistant.suggestions.map((option) => (
                  <button
                    key={option.title}
                    onClick={() => handlePromptSelect(option.prompt)}
                    className="group rounded-3xl border border-[#DDD] bg-[#FFFBF5] px-4 py-4 text-left text-sm text-[#333] transition hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/15"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[#2D2D2D]">{option.title}</span>
                      <ArrowRight className="h-4 w-4 text-[#FF6B6B] transition group-hover:translate-x-1" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#999]">{option.prompt}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-4xl border border-[#DDD] bg-[#FFFBF5] p-6 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
              <div className="mb-5 flex items-center gap-3 text-[#666]">
                <MessageSquare className="h-5 w-5 text-[#FF6B6B]" />
                <p className="uppercase tracking-[0.24em]">{text.assistant.liveChat}</p>
              </div>

              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={[
                      "rounded-3xl border p-5 shadow-sm transition",
                      message.role === "assistant"
                        ? "border-[#DDD] bg-white"
                        : "border-white/5 bg-[#FFFBF5] self-end",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#999]">
                      {message.role === "assistant" ? text.assistant.assistantLabel : text.assistant.userLabel}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-[#333]">{message.text}</p>
                    {message.sections?.map((section) => (
                      <div key={section.title} className="mt-5 rounded-3xl border border-[#DDD] bg-white p-4">
                        <h3 className="text-base font-semibold text-[#2D2D2D]">{section.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#666]">{section.text}</p>
                        {section.items ? (
                          <ul className="mt-3 grid gap-2 text-sm text-[#666]">
                            {section.items.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD93D]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))}

                {isThinking ? (
                  <div className="animate-pulse rounded-3xl border border-[#DDD] bg-white p-5">
                    <div className="mb-3 h-4 w-32 rounded-full bg-[#DDD]/30" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded-full bg-[#DDD]/20" />
                      <div className="h-3 w-5/6 rounded-full bg-[#DDD]/20" />
                      <div className="h-3 w-4/6 rounded-full bg-[#DDD]/20" />
                    </div>
                  </div>
                ) : null}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(input.trim());
                }}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={text.assistant.promptPlaceholder}
                  className="min-w-0 flex-1 rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-sm text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]/80 focus:ring-2 focus:ring-[#FF6B6B]/15"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-[#FFD93D] px-6 py-4 font-semibold text-[#2D2D2D] transition hover:bg-[#F0F0F0]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {text.assistant.sendButton}
                </button>
              </form>
            </div>
          </section>

          <aside className="lg:w-[38%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-4xl border border-[#DDD] bg-[#FFFBF5] p-8 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur"
            >
              <div className="flex items-center gap-3 text-[#FF6B6B]">
                <Globe2 className="h-5 w-5" />
                <p className="uppercase tracking-[0.28em] text-sm">{text.assistant.travelIntelligenceLabel}</p>
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-[#2D2D2D]">{text.assistant.buildSmarterItineraries}</h2>
              <p className="mt-4 text-sm leading-7 text-[#666]">
                {text.assistant.travelDataParagraph}
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl border border-[#DDD] bg-white p-4">
                  <div className="flex items-center justify-between text-sm text-[#999]">
                    <span>{text.assistant.aiModeledBudgets}</span>
                    <span>{text.assistant.realisticLabel}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#2D2D2D]">{text.assistant.flightsHotelsFoodTours}</p>
                </div>
                <div className="rounded-3xl border border-[#DDD] bg-white p-4">
                  <div className="flex items-center justify-between text-sm text-[#999]">
                    <span>{text.assistant.localDataset}</span>
                    <span>{text.assistant.mockCreative}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#2D2D2D]">{text.assistant.noExternalApisParagraph}</p>
                </div>
                <div className="rounded-3xl border border-[#DDD] bg-white p-4">
                  <div className="flex items-center justify-between text-sm text-[#999]">
                    <span>{text.assistant.nextStepLabel}</span>
                    <span>{text.assistant.tourBuilderLabel}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#2D2D2D]">{text.assistant.goFromAdviceText}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/tours"
                    className="inline-flex items-center justify-center gap-2 rounded-3xl border border-[#FF6B6B] px-5 py-4 text-sm font-semibold text-[#FF6B6B] transition hover:bg-[#FF6B6B]/15"
                  >
                    {text.assistant.buildTourPlanButton}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://t.me/yourusername"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-3xl bg-white px-5 py-4 text-sm font-semibold text-[#2D2D2D] transition hover:bg-slate-200"
                  >
                    {text.assistant.contactUsTelegram}
                  </a>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}
