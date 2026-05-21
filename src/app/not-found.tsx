"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { text } = useLanguage();

  return (
    <main className="cosmic-bg flex min-h-screen items-center justify-center px-5 text-center">
      <div className="rounded-lg p-8 border-2 border-[#FF6B6B] bg-[#FFFBF5]/95">
        <p className="text-sm uppercase tracking-[0.2em] text-[#FF6B6B]">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#2D2D2D]">{text.notFound.title}</h1>
        <p className="mt-4 leading-7 text-[#666]">{text.notFound.description}</p>
        <Link
          href="/explore"
          className="mt-7 inline-flex rounded-full bg-[#FF6B6B] px-5 py-3 font-semibold text-white transition hover:bg-[#FF8787]"
        >
          {text.notFound.action}
        </Link>
      </div>
    </main>
  );
}
