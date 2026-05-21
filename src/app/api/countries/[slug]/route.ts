import { NextResponse } from "next/server";
import { countryBySlug } from "@/data/countries";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = countryBySlug.get(slug);

  if (!country) {
    return NextResponse.json({ message: "Country not found" }, { status: 404 });
  }

  return NextResponse.json({ country });
}
