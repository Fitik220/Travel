"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, HeartHandshake, MapPin, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { countries } from "@/data/countries";

const mealPlans = [
  { id: "breakfast", label: "Breakfast only", daily: 22 },
  { id: "lunch", label: "Breakfast + lunch", daily: 45 },
  { id: "dinner", label: "Breakfast + lunch + dinner", daily: 72 },
  { id: "all", label: "All inclusive", daily: 108 },
];

const origins = [
  { id: "new-york", label: "New York" },
  { id: "london", label: "London" },
  { id: "dubai", label: "Dubai" },
  { id: "singapore", label: "Singapore" },
];

const originMultipliers: Record<string, number> = {
  "new-york": 1.18,
  london: 1,
  dubai: 1.06,
  singapore: 1.08,
};

const categoryOptions = [
  "All",
  "Beach",
  "Mountain",
  "Museum",
  "Food",
  "Nightlife",
  "Adventure",
  "Luxury",
  "Culture",
  "Wellness",
  "Water",
  "Wildlife",
  "Historic",
];

const styleOptions = ["All", "Luxury", "Adventure", "Culture", "Beach", "Nature", "City", "Romance", "Family"];

const activityLibrary = [
  { id: "beach-sunrise", title: "Private sunrise beach experience", category: "Beach", description: "Exclusive beach access with sunrise yoga and premium breakfast.", cost: 142, tags: ["beach", "luxury", "relaxation"] },
  { id: "dune-safari", title: "Desert dune safari", category: "Adventure", description: "Guided 4x4 desert route with sunset photography and camp cuisine.", cost: 188, tags: ["adventure", "desert", "culture"] },
  { id: "city-gastro", title: "Gourmet city food walk", category: "Food", description: "A curated tour through markets, hidden restaurants and tasting menus.", cost: 98, tags: ["food", "culture", "city"] },
  { id: "iconic-museum", title: "Iconic museum immersion", category: "Museum", description: "Skip-the-line entry to a top museum with private commentary.", cost: 76, tags: ["museum", "culture", "history"] },
  { id: "mountain-hike", title: "Summit viewpoint hike", category: "Mountain", description: "Moderate alpine trek with scenic lunch and signal-free nature time.", cost: 102, tags: ["mountain", "nature", "adventure"] },
  { id: "wine-tasting", title: "Vineyard wine tasting", category: "Luxury", description: "Reserve a premium tasting at a boutique estate with local cheese pairings.", cost: 132, tags: ["luxury", "food", "culture"] },
  { id: "temple-ritual", title: "Temple and ritual experience", category: "Culture", description: "A calm guided visit to iconic temples with local ceremony context.", cost: 88, tags: ["temple", "culture", "history"] },
  { id: "glass-bottom-boat", title: "Glass-bottom boat snorkel tour", category: "Water", description: "Explore coral reefs and marine life with a protected boat route.", cost: 124, tags: ["diving", "beach", "nature"] },
  { id: "night-market", title: "Night market street tour", category: "Food", description: "A buzzing evening walk through the city’s best food stalls.", cost: 58, tags: ["nightlife", "food", "city"] },
  { id: "river-cruise", title: "Sunset river cruise", category: "Water", description: "Luxury cruise along the river with cocktails and city vistas.", cost: 118, tags: ["cruise", "city", "luxury"] },
  { id: "cookery-class", title: "Local cooking class", category: "Food", description: "Hands-on kitchen session with a chef and market ingredient tour.", cost: 94, tags: ["culture", "food", "experience"] },
  { id: "jungle-safari", title: "Guided wildlife safari", category: "Wildlife", description: "A national park safari with expert trackers and premium lodge transfer.", cost: 212, tags: ["wildlife", "adventure", "nature"] },
  { id: "city-limo", title: "Luxury city limousine tour", category: "Luxury", description: "A smooth private city loop to premium landmarks and rooftop bars.", cost: 198, tags: ["city", "luxury", "nightlife"] },
  { id: "historical-walk", title: "Historic quarter walking tour", category: "Historic", description: "A storytelling walk through the oldest districts and ancient squares.", cost: 68, tags: ["history", "culture", "city"] },
  { id: "spa-retreat", title: "Wellness spa day", category: "Wellness", description: "A day of spa rituals, massages and thermal lounge access.", cost: 176, tags: ["wellness", "luxury", "relaxation"] },
  { id: "kayak-adventure", title: "Coastal kayak and beach picnic", category: "Adventure", description: "Guided coastline paddle with a scenic picnic stop.", cost: 89, tags: ["water", "beach", "adventure"] },
  { id: "ski-slope", title: "Mountain resort ski pass", category: "Mountain", description: "Access to groomed slopes and ski concierge pickup.", cost: 210, tags: ["skiing", "adventure", "luxury"] },
  { id: "urban-art", title: "Urban art and rooftop tour", category: "Culture", description: "Street art, galleries and skyline rooftop moments.", cost: 81, tags: ["city", "culture", "art"] },
  { id: "boat-festival", title: "Harbor boat festival experience", category: "Water", description: "A premium harbor route with local cuisine and festival vibes.", cost: 122, tags: ["cruise", "beach", "culture"] },
  { id: "desert-camp", title: "Luxury desert camp evening", category: "Adventure", description: "A night under the stars with cultural dining and fire-side stories.", cost: 192, tags: ["desert", "nature", "luxury"] },
  { id: "lighthouse-walk", title: "Coastal lighthouse discovery", category: "Beach", description: "A scenic coastal walk with iconic lighthouse viewpoints.", cost: 68, tags: ["beach", "nature", "photography"] },
  { id: "island-hop", title: "Island hopping speed boat tour", category: "Water", description: "A fast boat route between postcard islands and secluded beaches.", cost: 152, tags: ["boat tours", "beach", "adventure"] },
  { id: "food-market", title: "Market tasting crawl", category: "Food", description: "Local vendors, fresh dishes, and street-level food storytelling.", cost: 49, tags: ["food", "culture", "city"] },
  { id: "city-jazz", title: "City jazz and cocktail night", category: "Nightlife", description: "Entry to an intimate jazz venue with drinks.", cost: 88, tags: ["nightlife", "city", "luxury"] },
  { id: "temple-sunrise", title: "Sunrise temple visit", category: "Historic", description: "Early access to an ancient temple to avoid crowds.", cost: 76, tags: ["temple", "culture", "history"] },
  { id: "volcano-trek", title: "Volcano crater hike", category: "Mountain", description: "A dramatic volcano hike with local guide and summit views.", cost: 115, tags: ["mountain", "adventure", "nature"] },
  { id: "glacier-walk", title: "Glacier hiking and ice lounge", category: "Mountain", description: "A guided glacier trek with expert support and lodge warm-up.", cost: 225, tags: ["mountain", "luxury", "adventure"] },
  { id: "night-safari", title: "Night safari spotlight tour", category: "Wildlife", description: "After-dark wildlife watching with specialist guides.", cost: 186, tags: ["wildlife", "adventure", "nature"] },
  { id: "heritage-museum", title: "Heritage museum VIP access", category: "Museum", description: "Fast-track entry to a landmark museum with curated highlights.", cost: 94, tags: ["museum", "culture", "history"] },
  { id: "boat-dinner", title: "Fine dining river cruise", category: "Water", description: "A gourmet river dinner cruise with city lights.", cost: 162, tags: ["cruise", "luxury", "romance"] },
  { id: "wine-trail", title: "Boutique wine trail day", category: "Luxury", description: "A small-group wine estate tour with tastings and cellar access.", cost: 134, tags: ["luxury", "food", "culture"] },
  { id: "cliff-jumping", title: "Coastal cliff adventure", category: "Adventure", description: "Action-packed seaside cliffs with safety-guided jumps.", cost: 108, tags: ["adventure", "water", "nature"] },
  { id: "market-search", title: "Craft and design shopping route", category: "Culture", description: "An insider shopping route through design boutiques and markets.", cost: 58, tags: ["shopping", "culture", "city"] },
  { id: "wild-beach", title: "Private wild beach day", category: "Beach", description: "A secluded beach experience with picnic service.", cost: 128, tags: ["beach", "luxury", "relaxation"] },
  { id: "cafe-crawl", title: "Signature cafe and bakery tour", category: "Food", description: "A morning path of specialty coffee, pastries and local treats.", cost: 54, tags: ["food", "city", "culture"] },
  { id: "historic-train", title: "Historic scenic train route", category: "Historic", description: "A rail journey through scenic countryside and heritage rail stations.", cost: 122, tags: ["history", "luxury", "nature"] },
  { id: "diving-course", title: "Introductory dive experience", category: "Water", description: "A beginner dive session with certified instructors.", cost: 142, tags: ["diving", "adventure", "water"] },
  { id: "river-villa", title: "Private river villa stay", category: "Luxury", description: "Premium riverfront villa evenings with sunset service.", cost: 250, tags: ["luxury", "relaxation", "nature"] },
  { id: "cliff-dinner", title: "Cliffside dinner and stars", category: "Romance", description: "A premium dinner with coastal views and night sky ambiance.", cost: 178, tags: ["romance", "luxury", "nature"] },
  { id: "heritage-bike", title: "Heritage cycling tour", category: "Culture", description: "Easy bike ride through historic neighborhoods and river paths.", cost: 64, tags: ["culture", "active", "city"] },
  { id: "sunset-sup", title: "Sunset stand-up paddle", category: "Water", description: "Guided SUP at golden hour with calm water views.", cost: 88, tags: ["water", "beach", "relaxation"] },
  { id: "forest-retreat", title: "Forest wellness retreat", category: "Wellness", description: "A forest spa experience with meditation and organic meals.", cost: 189, tags: ["wellness", "nature", "luxury"] },
  { id: "vineyard-dinner", title: "Vineyard dining experience", category: "Luxury", description: "A farm-to-table dinner with private vineyard seating.", cost: 168, tags: ["food", "luxury", "romance"] },
  { id: "city-sunset", title: "Skyline sunset lounge", category: "Nightlife", description: "A rooftop lounge evening with city views and signature cocktails.", cost: 96, tags: ["nightlife", "city", "luxury"] },
];

export function TourBuilder() {
  const searchParams = useSearchParams();
  const { text } = useLanguage();
  const initialCountry =
    countries.find((item) => item.slug === searchParams.get("country")) ?? countries[0];
  const [selectedSlug, setSelectedSlug] = useState(initialCountry.slug);
  const [destinationQuery, setDestinationQuery] = useState(initialCountry.name);
  const [hotelStars, setHotelStars] = useState(4);
  const [days, setDays] = useState(9);
  const [people, setPeople] = useState(2);
  const [origin, setOrigin] = useState(origins[1].id);
  const [mealPlan, setMealPlan] = useState(mealPlans[3].id);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [activitySearch, setActivitySearch] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["city-gastro", "boat-dinner"]);

  const destinationMatches = useMemo(() => {
    const query = destinationQuery.trim().toLowerCase();
    if (!query) return countries.slice(0, 6);

    return countries
      .filter((item) => {
        const text = `${item.name} ${item.region} ${item.travelVibe} ${item.travelStyle} ${item.styleTags.join(" ")}`.toLowerCase();
        return text.includes(query);
      })
      .slice(0, 8);
  }, [destinationQuery]);

  const country = useMemo(
    () => countries.find((item) => item.slug === selectedSlug) ?? countries[0],
    [selectedSlug],
  );

  const selectedHotel = useMemo(
    () => country.hotels.find((hotel) => hotel.stars === hotelStars) ?? country.hotels[0],
    [country.hotels, hotelStars],
  );

  const flightBase = useMemo(() => {
    const [min, max] = country.flightEstimateRange.replace(/[^0-9\-]/g, "").split("-").map(Number);
    const average = Math.round((min + (max || min)) / 2);
    return Math.round(average * originMultipliers[origin]);
  }, [country.flightEstimateRange, origin]);

  const hotelCost = useMemo(() => {
    const average = Math.round((selectedHotel.nightly[0] + selectedHotel.nightly[1]) / 2);
    const rooms = Math.max(1, Math.ceil(people / 2));
    return average * days * rooms;
  }, [selectedHotel, days, people]);

  const mealCost = useMemo(() => {
    const plan = mealPlans.find((item) => item.id === mealPlan) ?? mealPlans[0];
    return plan.daily * people * days;
  }, [mealPlan, people, days]);

  const filteredActivities = useMemo(() => {
    const query = activitySearch.trim().toLowerCase();
    return activityLibrary.filter((activity) => {
      const matchesCategory = selectedCategory === "All" || activity.category === selectedCategory;
      const matchesStyle = selectedStyle === "All" || activity.tags.some((tag) => tag.toLowerCase() === selectedStyle.toLowerCase());
      const matchesQuery = !query || activity.title.toLowerCase().includes(query) || activity.description.toLowerCase().includes(query);
      return matchesCategory && matchesStyle && matchesQuery;
    });
  }, [activitySearch, selectedCategory, selectedStyle]);

  const activityCost = useMemo(
    () => selectedActivities.reduce((sum, activityId) => {
      const activity = activityLibrary.find((item) => item.id === activityId);
      return sum + (activity?.cost ?? 0);
    }, 0),
    [selectedActivities],
  );

  const totalCost = useMemo(() => flightBase + hotelCost + mealCost + activityCost, [flightBase, hotelCost, mealCost, activityCost]);

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#2D2D2D]">
      <div className="pointer-events-none fixed inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,107,107,0.15),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(160,230,201,0.12),transparent_20%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <section className="space-y-6 xl:w-[55%]">
            <div className="rounded-4xl border-2 border-[#FF6B6B] bg-[#FFFBF5] p-8 shadow-lg shadow-[#FF6B6B]/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF6B6B]">{text.common.tourBuilder}</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2D2D2D] sm:text-5xl">
                    {text.tours.title}
                  </h1>
                </div>
                <div className="rounded-3xl bg-[#FFD93D] px-4 py-3 text-sm font-semibold text-[#2D2D2D]">{text.tours.mockRealistic}</div>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#666]">
                {text.tours.subtitle}
              </p>
            </div>

            <div className="rounded-4xl border-2 border-[#20C997] bg-[#FFFBF5] p-8 shadow-lg shadow-[#20C997]/20">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <label className="text-sm uppercase tracking-[0.28em] text-[#999]">Destination</label>
                  <input
                    value={destinationQuery}
                    onChange={(event) => setDestinationQuery(event.target.value)}
                    placeholder={text.tours.destinationPlaceholder}
                    className="rounded-3xl border-2 border-[#A8E6CF] bg-[#FFFBF5] px-4 py-4 text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]"
                  />
                  <div className="mt-2 grid gap-2">
                    {destinationMatches.map((option) => (
                      <button
                        key={option.slug}
                        type="button"
                        onClick={() => {
                          setSelectedSlug(option.slug);
                          setDestinationQuery(option.name);
                        }}
                        className="rounded-3xl border-2 border-[#DDD] bg-white px-4 py-3 text-left text-sm text-[#666] transition hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                      >
                        <div className="font-semibold text-[#2D2D2D]">{option.name}</div>
                        <p className="mt-1 text-xs text-[#999]">{option.region} · {option.travelVibe}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm uppercase tracking-[0.28em] text-[#999]">{text.tours.originLabel}</label>
                      <div className="mt-3 grid gap-2">
                      {origins.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setOrigin(option.id)}
                          className={`rounded-3xl border px-4 py-4 text-sm text-left transition ${
                            origin === option.id
                              ? 'border-[#FF6B6B] bg-[#FF6B6B]/15 text-[#2D2D2D]'
                              : 'border-[#DDD] bg-white text-[#666] hover:border-[#FF6B6B]/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-[0.28em] text-[#999]">{text.tours.durationLabel}</label>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      value={days}
                      onChange={(event) => setDays(Math.max(3, Number(event.target.value) || 3))}
                      className="mt-2 w-full rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]/60"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm uppercase tracking-[0.28em] text-[#999]">{text.tours.peopleLabel}</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={people}
                      onChange={(event) => setPeople(Math.max(1, Number(event.target.value) || 1))}
                      className="mt-2 w-full rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-[0.28em] text-[#999]">{text.tours.hotelRatingLabel}</label>
                    <div className="mt-3 grid gap-2">
                      {country.hotels.map((hotel) => (
                        <button
                          key={hotel.stars}
                          type="button"
                          onClick={() => setHotelStars(hotel.stars)}
                          className={`rounded-3xl border px-4 py-4 text-left transition ${
                            hotelStars === hotel.stars
                              ? 'border-[#FF6B6B] bg-[#FF6B6B]/15 text-[#2D2D2D]'
                              : 'border-[#DDD] bg-white text-[#666] hover:border-[#FF6B6B]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span>{hotel.stars}-star — {hotel.label}</span>
                            <span className="text-sm text-[#999]">USD {hotel.nightly[0]}–{hotel.nightly[1]}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm uppercase tracking-[0.28em] text-[#999]">{text.tours.mealPlanLabel}</label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {mealPlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setMealPlan(plan.id)}
                        className={`rounded-3xl border px-4 py-4 text-left text-sm transition ${
                          mealPlan === plan.id
                            ? "border-[#FF6B6B] bg-[#FF6B6B]/15 text-[#2D2D2D]"
                            : "border-[#DDD] bg-white text-[#666] hover:border-[#FF6B6B]/40"
                        }`}
                      >
                        <p className="font-semibold">{text.tours.mealPlanLabels[plan.id as keyof typeof text.tours.mealPlanLabels] ?? plan.label}</p>
                        <p className="mt-2 text-xs text-[#999]">USD {plan.daily}/person/day</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <label className="text-sm uppercase tracking-[0.28em] text-[#999]">{text.tours.activitiesTitle}</label>
                      <p className="mt-2 text-sm text-[#999]">{text.tours.activitiesSubtitle}</p>
                    </div>
                    <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
                      <select
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]/60"
                      >
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>{text.tours.categoryOptions[category as keyof typeof text.tours.categoryOptions] ?? category}</option>
                        ))}
                      </select>
                      <select
                        value={selectedStyle}
                        onChange={(event) => setSelectedStyle(event.target.value)}
                        className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]/60"
                      >
                        {styleOptions.map((style) => (
                          <option key={style} value={style}>{text.tours.styleOptions[style as keyof typeof text.tours.styleOptions] ?? style}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                      value={activitySearch}
                      onChange={(event) => setActivitySearch(event.target.value)}
                      placeholder={text.tours.activitySearchPlaceholder}
                      className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B]/60"
                    />
                    <div className="flex items-center rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-sm text-[#666]">
                      {filteredActivities.length} {text.tours.experiencesFound}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {filteredActivities.slice(0, 12).map((activity) => {
                      const active = selectedActivities.includes(activity.id);
                      return (
                        <button
                          key={activity.id}
                          type="button"
                          onClick={() => {
                            setSelectedActivities((current) =>
                              current.includes(activity.id)
                                ? current.filter((item) => item !== activity.id)
                                : [...current, activity.id],
                            );
                          }}
                          className={`rounded-3xl border px-4 py-4 text-left transition ${
                            active
                              ? "border-[#FF6B6B] bg-[#FF6B6B]/15 text-[#2D2D2D]"
                              : "border-[#DDD] bg-white text-[#666] hover:border-[#FF6B6B]/40"
                          }`}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="font-semibold text-[#2D2D2D]">{activity.title}</div>
                              <p className="mt-2 text-sm text-[#999]">{activity.description}</p>
                            </div>
                            <div className="space-y-1 text-right text-sm">
                              <span className="font-semibold text-[#2D2D2D]">USD {activity.cost}</span>
                              <span className="text-[#AAA]">{activity.category}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-[#DDD] bg-white p-8 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#DDD] bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.tours.destinationPanelTitle}</p>
                  <p className="mt-3 text-xl font-semibold text-[#2D2D2D]">{country.name}</p>
                  <p className="mt-2 text-sm text-[#666]">{country.travelVibe} {text.tours.routeLabel} · {text.tours.bestSeasonLabel} {country.bestSeason}</p>
                </div>
                <div className="rounded-3xl border border-[#DDD] bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.tours.hotelChoiceLabel}</p>
                  <p className="mt-3 text-xl font-semibold text-[#2D2D2D]">{hotelStars}-star {selectedHotel.label}</p>
                  <p className="mt-2 text-sm text-[#666]">{selectedHotel.nightly[0]}–{selectedHotel.nightly[1]} USD / night</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="xl:w-[42%] xl:sticky xl:top-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-4xl border border-[#DDD] bg-white p-8 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF6B6B]">{text.tours.estimateSummaryTitle}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#2D2D2D]">{text.tours.costBreakdownTitle}</h2>
                </div>
                <div className="rounded-3xl bg-[#FFD93D] px-4 py-3 text-sm font-semibold text-[#2D2D2D]">USD {totalCost.toLocaleString()}</div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  { label: text.tours.flightEstimateLabel, value: `USD ${flightBase.toLocaleString()}` },
                  { label: text.tours.hotelCostLabel, value: `USD ${hotelCost.toLocaleString()}` },
                  { label: text.tours.mealCostLabel, value: `USD ${mealCost.toLocaleString()}` },
                  { label: text.tours.activitiesCostLabel, value: `USD ${activityCost.toLocaleString()}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-[#DDD] bg-white p-5">
                    <div className="flex items-center justify-between gap-3 text-sm text-[#999]">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-[#DDD] bg-white p-5">
                <div className="flex items-center gap-3 text-[#666]">
                  <Sparkles className="h-5 w-5 text-[#FF6B6B]" />
                  <span className="text-sm uppercase tracking-[0.24em]">{text.tours.insightLabel}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#666]">
                  {text.tours.insightDescription}
                </p>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl border border-[#DDD] bg-white p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#999]">{text.tours.whyItWorksTitle}</p>
                  <ul className="mt-4 space-y-3 text-sm text-[#666]">
                    <li className="flex items-start gap-2"><Star className="mt-1 h-4 w-4 text-[#FF6B6B]" /> {text.tours.whyItWorksPoint1}</li>
                    <li className="flex items-start gap-2"><MapPin className="mt-1 h-4 w-4 text-[#FF6B6B]" /> {text.tours.whyItWorksPoint2}</li>
                    <li className="flex items-start gap-2"><HeartHandshake className="mt-1 h-4 w-4 text-[#FF6B6B]" /> {text.tours.whyItWorksPoint3}</li>
                  </ul>
                </div>

                <Link
                  href="https://t.me/yourusername"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#FFD93D] px-5 py-4 text-sm font-semibold text-[#2D2D2D] transition hover:bg-white"
                >
                  {text.tours.contactPlanner}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}

