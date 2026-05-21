import { CompareCountries } from "@/components/CompareCountries";
import { countries } from "@/data/countries";
import { toInsightCountries } from "@/lib/clientTravelData";

export default function ComparePage() {
  return <CompareCountries countries={toInsightCountries(countries)} />;
}
