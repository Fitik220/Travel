export type Resort = {
  id: string;
  name: string;
  country: string;
  city: string;
  pricePerPerson: number;
  stars: 3 | 4 | 5;
  mealPlan: "Breakfast" | "Half board" | "Full board" | "All inclusive";
  peopleMin: number;
  peopleMax: number;
  departureDate: string;
  nights: number;
  moods: string[];
  image: string;
  score: number;
};

export const resorts: Resort[] = [
  {
    id: "bali-lagoon",
    name: "Bali Lagoon Serenity",
    country: "Indonesia",
    city: "Ubud + Nusa Dua",
    pricePerPerson: 1480,
    stars: 5,
    mealPlan: "Breakfast",
    peopleMin: 2,
    peopleMax: 6,
    departureDate: "2026-06-12",
    nights: 9,
    moods: ["Relax", "Nature", "Romantic"],
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    score: 94,
  },
  {
    id: "antalya-family",
    name: "Antalya Sun Family Resort",
    country: "Turkey",
    city: "Antalya",
    pricePerPerson: 890,
    stars: 5,
    mealPlan: "All inclusive",
    peopleMin: 2,
    peopleMax: 8,
    departureDate: "2026-07-05",
    nights: 7,
    moods: ["Family", "Relax", "Nightlife"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
    score: 91,
  },
  {
    id: "japan-urban",
    name: "Tokyo Kyoto Neon Route",
    country: "Japan",
    city: "Tokyo + Kyoto",
    pricePerPerson: 2360,
    stars: 4,
    mealPlan: "Breakfast",
    peopleMin: 1,
    peopleMax: 4,
    departureDate: "2026-10-08",
    nights: 10,
    moods: ["Nightlife", "Luxury", "Romantic"],
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    score: 93,
  },
  {
    id: "maldives-overwater",
    name: "Maldives Overwater Calm",
    country: "Maldives",
    city: "South Male Atoll",
    pricePerPerson: 3120,
    stars: 5,
    mealPlan: "Full board",
    peopleMin: 2,
    peopleMax: 4,
    departureDate: "2026-09-18",
    nights: 6,
    moods: ["Luxury", "Relax", "Romantic"],
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
    score: 97,
  },
  {
    id: "uzbek-silk",
    name: "Silk Road Boutique Circuit",
    country: "Uzbekistan",
    city: "Tashkent + Samarkand",
    pricePerPerson: 620,
    stars: 4,
    mealPlan: "Half board",
    peopleMin: 2,
    peopleMax: 10,
    departureDate: "2026-09-25",
    nights: 8,
    moods: ["Adventure", "Family", "Nature"],
    image: "https://images.unsplash.com/photo-1603201236596-eb1a63eb0ede?auto=format&fit=crop&w=900&q=80",
    score: 88,
  },
  {
    id: "france-riviera",
    name: "French Riviera Glow",
    country: "France",
    city: "Nice + Monaco",
    pricePerPerson: 2240,
    stars: 5,
    mealPlan: "Breakfast",
    peopleMin: 2,
    peopleMax: 4,
    departureDate: "2026-08-14",
    nights: 7,
    moods: ["Luxury", "Romantic", "Nightlife"],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    score: 92,
  },
];
