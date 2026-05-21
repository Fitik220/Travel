"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties, KeyboardEvent, PointerEvent, MutableRefObject, ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { Country } from "@/data/countries";
import type { GlobeMethods, GlobeProps } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false }) as unknown as ComponentType<GlobeProps & { ref?: MutableRefObject<GlobeMethods | undefined> }>;

type GeometryFeature = {
  type: "Feature";
  properties: {
    name: string;
  };
  geometry: unknown;
};

type SearchResult = {
  label: string;
  sublabel: string;
  type: "country" | "city";
  country: Country;
  city?: Country["cities"][number];
  score: number;
};

export function GlobeExperience({ countries }: { countries: Country[] }) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [hovered, setHovered] = useState<GeometryFeature | null>(null);
  const [selectedName, setSelectedName] = useState("Choose a country");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<Country["cities"][number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [spaceOffset, setSpaceOffset] = useState({ x: 0, y: 0 });
  const countryMap = useMemo(
    () => new Map(countries.map((country) => [country.name.toLowerCase(), country])),
    [countries],
  );

  const polygons = useMemo(() => {
    const collection = feature(
      world as never,
      (world as { objects: { countries: never } }).objects.countries,
    ) as unknown as { features: GeometryFeature[] };

    return collection.features.filter((item) => item.properties?.name !== "Antarctica");
  }, []);

  const arcs = useMemo(
    () =>
      countries.slice(0, 6).map((country, index) => ({
        startLat: 41.2995,
        startLng: 69.2401,
        endLat: country.coordinates.lat,
        endLng: country.coordinates.lng,
        color: country.accent,
        order: index,
      })),
    [countries],
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return countries
      .flatMap((country) => {
        const countryText = `${country.travelVibe} ${country.travelStyle} ${country.styleTags.join(" ")}`.toLowerCase();
        const countryScore = country.name.toLowerCase().includes(query)
          ? 50
          : countryText.includes(query)
          ? 16
          : 0;

        const countryResult: SearchResult = {
          label: country.name,
          sublabel: `${country.region} · ${country.travelVibe}`,
          type: "country",
          country,
          score: countryScore,
        };

        const cityResults = country.cities.map((city) => {
          const cityText = `${city.name} ${city.vibe} ${city.styleTags.join(" ")}`.toLowerCase();
          const score = city.name.toLowerCase().includes(query)
            ? 62
            : cityText.includes(query)
            ? 18
            : 0;
          return {
            label: city.name,
            sublabel: `${country.name} · ${city.vibe}`,
            type: "city" as const,
            country,
            city,
            score,
          };
        });

        return [countryResult, ...cityResults];
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, 8);
  }, [searchQuery, countries]);

  const { text } = useLanguage();

  const focusCountry = (country: Country, city?: Country["cities"][number]) => {
    setSelectedCountry(country);
    setSelectedCity(city ?? null);
    setSelectedName(country.name);
    const target = city?.coordinates ?? country.coordinates;
    const globe = globeRef.current;
    if (globe) {
      globe.pointOfView({ lat: target.lat, lng: target.lng, altitude: 1.2 }, 1200);
    }
  };

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery(result.label);
    setActiveSuggestion(0);
    focusCountry(result.country, result.city);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % searchResults.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) => (current - 1 + searchResults.length) % searchResults.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchSelect(searchResults[activeSuggestion]);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const globe = globeRef.current;
      if (!globe) return;

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.72;
      controls.enableDamping = true;
      globe.pointOfView({ lat: 24, lng: 58, altitude: 2.25 }, 1400);

      window.setTimeout(() => {
        controls.autoRotateSpeed = 0.18;
      }, 3200);
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 42;
    const y = (event.clientY / window.innerHeight - 0.5) * 42;
    setSpaceOffset({ x, y });
  };

  return (
    <main
      className="deep-space-bg relative min-h-screen overflow-hidden"
      onPointerMove={handlePointerMove}
      style={
        {
          "--space-x": `${spaceOffset.x}px`,
          "--space-y": `${spaceOffset.y}px`,
        } as CSSProperties
      }
    >
      <div className="deep-star-field" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.72)_88%)]" />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border-2 border-[#FF6B6B] bg-white/80 px-4 py-2 text-sm text-[#2D2D2D] backdrop-blur transition hover:border-[#20C997] hover:text-[#20C997]"
          >
            <ArrowLeft className="h-4 w-4" />
            {text.common.backToGlobe}
          </Link>
          <div className="rounded-lg px-5 py-3 text-center border-2 border-[#20C997] bg-[#20C997]/30">
            <p className="text-xs uppercase tracking-[0.22em] text-[#FF6B6B]">{text.explore.hoverTarget}</p>
            <h1 className="mt-1 truncate text-xl font-semibold text-[#2D2D2D] sm:text-3xl">{selectedName}</h1>
          </div>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-24 z-20 px-5 sm:px-8">
        <div className="pointer-events-auto mx-auto max-w-3xl rounded-3xl border-2 border-[#FFD93D] bg-[#FFFBF5]/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#FF6B6B]">{text.explore.smartSearch}</p>
                <h2 className="mt-2 text-lg font-semibold text-[#2D2D2D]">{text.explore.searchSubtitle}</h2>
              </div>
              <div className="rounded-full bg-[#FFD93D]/20 px-4 py-2 text-sm text-[#2D2D2D]">{text.explore.realTimeNavigation}</div>
            </div>

            <div className="mt-4">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={text.explore.placeholder}
                className="w-full rounded-3xl border-2 border-[#A8E6CF] bg-[#FFFBF5] px-4 py-4 text-sm text-[#2D2D2D] outline-none transition focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/30"
              />
            </div>

          {searchResults.length ? (
            <div className="mt-3 grid gap-2">
              {searchResults.map((item, index) => (
                <button
                  key={`${item.type}-${item.label}-${index}`}
                  type="button"
                  onClick={() => handleSearchSelect(item)}
                  className={`rounded-3xl border-2 px-4 py-3 text-left transition ${
                    index === activeSuggestion
                      ? 'border-[#FF6B6B] bg-[#FF6B6B]/20 text-[#2D2D2D]'
                      : 'border-[#DDD] bg-[#FFFBF5] text-[#666] hover:border-[#20C997]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-[#999]">{item.type}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#999]">{item.sublabel}</p>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <section className="relative z-10 h-screen w-screen">
        <Globe
          ref={globeRef}
          width={typeof window === "undefined" ? 1200 : window.innerWidth}
          height={typeof window === "undefined" ? 760 : window.innerHeight}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="rgba(72, 209, 204, 0.55)"
          atmosphereAltitude={0.26}
          polygonsData={polygons}
          polygonAltitude={(polygon: object) => {
            const item = polygon as GeometryFeature;
            if (item === hovered) return 0.08;
            if (selectedCountry?.name.toLowerCase() === item.properties.name.toLowerCase()) return 0.05;
            return 0.012;
          }}
          polygonCapColor={(polygon: object) => {
            const item = polygon as GeometryFeature;
            const match = countryMap.get(item.properties.name.toLowerCase());
            if (item === hovered) return match?.accent ?? "#ffffff";
            if (selectedCountry?.name.toLowerCase() === item.properties.name.toLowerCase()) return "rgba(56, 189, 248, 0.45)";
            return match ? "rgba(41, 211, 197, 0.38)" : "rgba(255,255,255,0.11)";
          }}
          polygonSideColor={() => "rgba(0, 160, 180, 0.28)"}
          polygonStrokeColor={(polygon: object) => {
            const item = polygon as GeometryFeature;
            return item === hovered || selectedCountry?.name.toLowerCase() === item.properties.name.toLowerCase()
              ? "#ffffff"
              : "rgba(255,255,255,0.18)";
          }}
          polygonLabel={(polygon: object) => {
            const item = polygon as GeometryFeature;
            const match = countryMap.get(item.properties.name.toLowerCase());
            return match ? `<div style="padding:8px 12px; border-radius:12px; background:rgba(15,23,42,0.95); color:#fff; font-size:13px; line-height:1.4;"><strong>${item.properties.name}</strong><div style="margin-top:4px; color:#94a3b8;">${match.travelVibe}</div></div>` : item.properties.name;
          }}
          onPolygonHover={(polygon: object | null) => {
            const next = (polygon as GeometryFeature | null) ?? null;
            setHovered(next);
            setSelectedName(next?.properties.name ?? "Choose a country");
          }}
          onPolygonClick={(polygon: object) => {
            const item = polygon as GeometryFeature;
            const country = countryMap.get(item.properties.name.toLowerCase());
            if (country) {
              focusCountry(country);
            }
          }}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={(arc: object) => [(arc as { color: string }).color, "rgba(255,255,255,0.85)"]}
          arcDashLength={0.38}
          arcDashGap={1.3}
          arcDashAnimateTime={2600}
          arcStroke={0.45}
          pointsData={countries}
          pointLat={(item: object) => (item as Country).coordinates.lat}
          pointLng={(item: object) => (item as Country).coordinates.lng}
          pointColor={(item: object) => (item as Country).accent}
          pointAltitude={0.04}
          pointRadius={0.28}
        />
      </section>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent_40%)]" />
      <AnimatePresence>
        {selectedCountry ? (
          <motion.aside
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="absolute right-5 top-24 z-20 hidden h-[calc(100vh-6rem)] w-[23.75rem] flex-col overflow-hidden rounded-4xl border-2 border-[#FF6B6B] bg-[#FFFBF5] p-5 shadow-2xl md:flex"
          >
            <div className="flex items-center justify-between gap-3 border-b-2 border-[#FFD93D] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#FF6B6B]">{text.explore.countryDetails}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#2D2D2D]">{selectedCountry.name}</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setSelectedCity(null);
                }}
                className="rounded-full border-2 border-[#A8E6CF] bg-[#A8E6CF]/20 p-2 text-[#2D2D2D] transition hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-4 overflow-auto pr-2">
              <div className="rounded-3xl border-2 border-[#20C997] bg-[#20C997]/15 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-[#999]">{text.explore.vibe}</p>
                <p className="mt-2 text-lg font-semibold text-[#2D2D2D]">{selectedCountry.travelVibe}</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl border-2 border-[#FFD93D] bg-[#FFD93D]/15 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.explore.bestSeason}</p>
                  <p className="mt-2 text-[#2D2D2D]">{selectedCountry.bestSeason}</p>
                </div>
                <div className="rounded-3xl border-2 border-[#FF6B6B] bg-[#FF6B6B]/15 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.explore.estimatedBudget}</p>
                  <p className="mt-2 text-[#2D2D2D]">{selectedCountry.budgetRange}</p>
                </div>
                <div className="rounded-3xl border-2 border-[#20C997] bg-[#20C997]/15 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.explore.flights}</p>
                  <p className="mt-2 text-[#2D2D2D]">{selectedCountry.flightEstimateRange}</p>
                </div>
              </div>
              <div className="rounded-3xl border-2 border-[#A8E6CF] bg-[#A8E6CF]/15 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.explore.quickGuide}</p>
                <p className="mt-3 text-sm leading-6 text-[#666]">{selectedCountry.intro}</p>
              </div>
              {selectedCity ? (
                <div className="rounded-3xl border-2 border-[#DA70D6] bg-[#DA70D6]/15 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.explore.citySpotlight}</p>
                  <p className="mt-2 text-lg font-semibold text-[#2D2D2D]">{selectedCity.name}</p>
                  <p className="mt-3 text-sm leading-6 text-[#666]">{selectedCity.vibe}</p>
                  <div className="mt-4 grid gap-2">
                    {selectedCity.topAttractions.map((item) => (
                      <p key={item} className="rounded-3xl border-2 border-[#FFD93D] bg-[#FFD93D]/15 p-3 text-sm text-[#555]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="rounded-3xl border-2 border-[#FF6B6B] bg-[#FF6B6B]/15 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#999]">{text.explore.routeTags}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCountry.styleTags.map((tag) => (
                    <span key={tag} className="rounded-full border-2 border-[#20C997] bg-[#20C997]/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#2D2D2D]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.explore.routeTags}</p>
                  <div className="mt-3 grid gap-3">
                    {selectedCountry.topAttractions.map((item) => (
                      <p key={item} className="rounded-3xl border-2 border-[#A8E6CF] bg-[#A8E6CF]/15 p-3 text-sm text-[#555]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#999]">{text.explore.routeTags}</p>
                  <div className="mt-3 grid gap-3">
                    {selectedCountry.popularCities.map((city) => (
                      <p key={city} className="rounded-3xl border-2 border-[#DA70D6] bg-[#DA70D6]/15 p-3 text-sm text-[#555]">
                        {city}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                <Link
                  href={`/countries/${selectedCountry.slug}`}
                  className="inline-flex items-center justify-center rounded-3xl bg-[#FF6B6B] px-4 py-3 font-semibold text-white transition hover:bg-[#FF8787]"
                >
                  {text.explore.countryDetailsButton}
                </Link>
                <a
                  href="https://t.me/yourusername"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-3xl border-2 border-[#20C997] bg-white px-4 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:border-[#FF6B6B] hover:bg-[#FFD93D]/30"
                >
                  {text.explore.countryDetailsButton}
                </a>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
