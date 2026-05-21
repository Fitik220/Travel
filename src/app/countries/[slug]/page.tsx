import { notFound } from "next/navigation";
import { countries, countryBySlug } from "@/data/countries";
import { getCountryGuide } from "@/data/countryGuides";
import { CountryPageContent } from "@/components/CountryPageContent";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const country = countryBySlug.get(slug);

  return {
    title: country ? `${country.name} | Traveler Atlas` : "Country | Traveler Atlas",
    description: country?.intro,
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = countryBySlug.get(slug);

  if (!country) {
    notFound();
  }

  const guide = getCountryGuide(country.slug, country.name);

  return <CountryPageContent country={country} guide={guide} />;
}
