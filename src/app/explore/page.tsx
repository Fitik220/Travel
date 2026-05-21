import { GlobeExperience } from "@/components/GlobeExperience";
import { countries } from "@/data/countries";

export default function ExplorePage() {
  return <GlobeExperience countries={countries} />;
}
