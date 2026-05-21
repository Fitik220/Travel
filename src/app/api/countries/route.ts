import { NextResponse } from "next/server";
import { countries } from "@/data/countries";

export function GET() {
  return NextResponse.json({ countries });
}
