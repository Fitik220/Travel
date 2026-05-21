import Link from "next/link";
import { CurrencyConverter } from "@/components/CurrencyConverter";

export default function CurrencyPage() {
  return (
    <main className="cosmic-bg min-h-screen px-5 py-10 text-[#2D2D2D] sm:px-8 lg:px-10">
      <section className="relative z-10 mx-auto max-w-5xl">
        <nav className="flex items-center justify-between gap-3">
          <Link href="/" className="font-semibold text-[#2D2D2D]">Traveler Atlas</Link>
          <Link href="/compare" className="rounded-full border border-[#DDD] bg-white/60 px-4 py-2 text-sm font-semibold text-[#2D2D2D]">
            Compare
          </Link>
        </nav>
        <div className="mt-16">
          <CurrencyConverter />
        </div>
      </section>
    </main>
  );
}
