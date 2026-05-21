import type { Country } from "@/data/countries";
import type { InsightCountry } from "@/lib/travelInsights";

export function toInsightCountries(countries: Country[]): InsightCountry[] {
  return countries.filter((country) => country.region !== "Global").map((country) => ({
    slug: country.slug,
    name: country.name,
    region: country.region,
    bestSeason: country.bestSeason,
    intro: country.intro,
    travelVibe: country.travelVibe,
    travelStyle: country.travelStyle,
    budgetRange: country.budgetRange,
    budgetLevel: country.budgetLevel,
    climate: country.climate,
    safetyInfo: country.safetyInfo,
    tourismRating: country.tourismRating,
    styleTags: country.styleTags,
    hotelPriceRange: country.hotelPriceRange,
    estimatedDailyBudget: country.estimatedDailyBudget,
    recommendedActivities: country.recommendedActivities,
    topAttractions: country.topAttractions.slice(0, 5),
    foodRecommendations: country.foodRecommendations.slice(0, 5),
    food: country.food.slice(0, 5),
    hotels: country.hotels,
    citySignals: country.cities.flatMap((city) => [city.vibe, ...city.styleTags]).slice(0, 18),
  }));
}
