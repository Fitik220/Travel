export const moods = ["Relax", "Adventure", "Luxury", "Nature", "Nightlife", "Romantic", "Family"] as const;

export type Mood = (typeof moods)[number];

export type InsightCountry = {
  slug: string;
  name: string;
  region: string;
  bestSeason: string;
  intro: string;
  travelVibe: string;
  travelStyle: string;
  budgetRange: string;
  budgetLevel: "budget" | "mid-range" | "luxury";
  climate: string;
  safetyInfo: string;
  tourismRating: number;
  styleTags: string[];
  hotelPriceRange: string;
  estimatedDailyBudget: {
    low: number;
    high: number;
    currency: string;
  };
  recommendedActivities: string[];
  topAttractions: string[];
  foodRecommendations: string[];
  food: string[];
  hotels: {
    stars: number;
    label: string;
    nightly: [number, number];
  }[];
  citySignals: string[];
};

const moodTerms: Record<Mood, string[]> = {
  Relax: ["relax", "comfort", "wellness", "beach", "slow", "spa", "calm"],
  Adventure: ["adventure", "mountain", "wildlife", "hike", "desert", "water", "nature"],
  Luxury: ["luxury", "premium", "boutique", "romance", "comfort"],
  Nature: ["nature", "mountain", "wildlife", "beach", "water", "eco"],
  Nightlife: ["nightlife", "city", "food", "urban", "lounge"],
  Romantic: ["romance", "luxury", "beach", "nature", "slow", "city"],
  Family: ["family", "comfort", "beach", "culture", "city", "safe"],
};

export function countryMoodScore(country: InsightCountry, mood: Mood) {
  const haystack = [
    country.travelVibe,
    country.travelStyle,
    country.climate,
    country.region,
    country.budgetLevel,
    ...country.styleTags,
    ...country.recommendedActivities,
    ...country.topAttractions,
    ...country.foodRecommendations,
    ...country.citySignals,
  ]
    .join(" ")
    .toLowerCase();

  const terms = moodTerms[mood];
  const tagHits = terms.filter((term) => haystack.includes(term)).length;
  const luxuryBoost = mood === "Luxury" && country.budgetLevel === "luxury" ? 3 : 0;
  const familyBoost = mood === "Family" && country.tourismRating >= 4 ? 2 : 0;
  return tagHits * 14 + luxuryBoost + familyBoost + country.tourismRating;
}

export function getMoodMatches(countries: InsightCountry[], mood: Mood, limit = 8) {
  return countries
    .map((country) => ({ country, score: countryMoodScore(country, mood) }))
    .sort((a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name))
    .slice(0, limit);
}

export function getBudgetScore(country: InsightCountry) {
  const mid = (country.estimatedDailyBudget.low + country.estimatedDailyBudget.high) / 2;
  return Math.max(0, Math.min(100, Math.round(110 - mid / 4)));
}

export function getSafetyScore(country: InsightCountry) {
  const text = country.safetyInfo.toLowerCase();
  const cautionPenalty = /(crowd|crowded|aware|backup|registered|caution|avoid)/.test(text) ? 7 : 0;
  return Math.max(45, Math.min(98, Math.round(country.tourismRating * 18 + 12 - cautionPenalty)));
}

export function getFoodScore(country: InsightCountry) {
  return Math.min(99, 58 + country.foodRecommendations.length * 8 + country.food.length * 5);
}

export function getPriceScore(country: InsightCountry) {
  const hotelAverage =
    country.hotels.reduce((sum, hotel) => sum + (hotel.nightly[0] + hotel.nightly[1]) / 2, 0) /
    Math.max(1, country.hotels.length);
  return Math.max(0, Math.min(100, Math.round(105 - hotelAverage / 7)));
}

export function getClimateScore(country: InsightCountry) {
  const climate = `${country.climate} ${country.bestSeason}`.toLowerCase();
  if (/(tropical|mediterranean|temperate|coastal|april|may|september|october)/.test(climate)) return 88;
  if (/(continental|desert|monsoon)/.test(climate)) return 72;
  return 80;
}

export function getCountryComparison(country: InsightCountry) {
  return {
    budget: getBudgetScore(country),
    climate: getClimateScore(country),
    food: getFoodScore(country),
    safety: getSafetyScore(country),
    prices: getPriceScore(country),
  };
}

export function averageScore(scores: Record<string, number>) {
  const values = Object.values(scores);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length));
}
