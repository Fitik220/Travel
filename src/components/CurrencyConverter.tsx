"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

type CurrencyCode = "USD" | "EUR" | "UZS" | "RUB";

type RatesResponse = {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  updatedAt: string;
  nextUpdateAt?: string;
  source: string;
  fallback?: boolean;
};

const currencies: CurrencyCode[] = ["USD", "EUR", "UZS", "RUB"];

const labels: Record<CurrencyCode, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  UZS: "Uzbek Som",
  RUB: "Russian Ruble",
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("UZS");
  const [data, setData] = useState<RatesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/rates", { cache: "no-store" });
      const nextData = (await response.json()) as RatesResponse;
      setData(nextData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRates();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const converted = useMemo(() => {
    if (!data) return 0;
    const fromRate = data.rates[from];
    const toRate = data.rates[to];
    if (!fromRate || !toRate) return 0;
    return (amount / fromRate) * toRate;
  }, [amount, data, from, to]);

  const rateText = useMemo(() => {
    if (!data) return "Loading live rate";
    const value = (data.rates[to] / data.rates[from]).toLocaleString(undefined, {
      maximumFractionDigits: to === "UZS" ? 2 : 4,
    });
    return `1 ${from} = ${value} ${to}`;
  }, [data, from, to]);

  return (
    <section className="rounded-4xl border border-[#DDD] bg-white/80 p-6 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#FF6B6B]">Live currency</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#2D2D2D]">Currency Converter</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666]">
            Online rates for USD, EUR, UZS and RUB. If the provider is unavailable, the widget keeps working with a clearly marked fallback.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRates}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#20C997] px-4 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#20C997]/15"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1.15fr]">
        <label className="grid gap-2 text-sm text-[#666]">
          Amount
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value) || 0)}
            className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 text-lg font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <CurrencySelect label="From" value={from} onChange={setFrom} />
          <CurrencySelect label="To" value={to} onChange={setTo} />
        </div>
        <div className="rounded-3xl border border-[#FFD93D] bg-[#FFD93D]/15 p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-[#999]">{rateText}</p>
          <p className="mt-3 text-3xl font-semibold text-[#2D2D2D]">
            {converted.toLocaleString(undefined, {
              maximumFractionDigits: to === "UZS" ? 0 : 2,
            })}{" "}
            {to}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#666]">
            {data?.fallback ? "Fallback rate active." : "Rates by ExchangeRate-API Open Access."}
            {data?.updatedAt ? ` Updated: ${data.updatedAt}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

function CurrencySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}) {
  return (
    <label className="grid gap-2 text-sm text-[#666]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyCode)}
        className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B]"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency} · {labels[currency]}
          </option>
        ))}
      </select>
    </label>
  );
}
