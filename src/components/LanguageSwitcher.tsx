"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="rounded-full border border-[#FF6B6B] bg-white px-3 py-2 text-sm text-[#2D2D2D] shadow-lg shadow-[#FF6B6B]/20 backdrop-blur">
      <button
        type="button"
        onClick={() => setLocale(locale === "en" ? "ru" : "en")}
        className="inline-flex items-center gap-2 font-semibold text-[#333] transition hover:text-[#2D2D2D]"
      >
        {locale === "en" ? "EN" : "RU"}
        <span className="rounded-full bg-[#FF6B6B]/20 px-2 py-0.5 text-xs uppercase text-[#999]">{locale === "en" ? "Русский" : "English"}</span>
      </button>
    </div>
  );
}
