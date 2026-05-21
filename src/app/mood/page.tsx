import { MoodSystem } from "@/components/MoodSystem";
import { countries } from "@/data/countries";
import { toInsightCountries } from "@/lib/clientTravelData";

export default function MoodPage() {
  return <MoodSystem countries={toInsightCountries(countries)} />;
}
