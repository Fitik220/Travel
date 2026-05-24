"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { WORLD_CURRENCIES, POPULAR_CURRENCIES, CURRENCY_SYMBOLS } from "@/data/currencies";

type CurrencyCode = string;

type RatesResponse = {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  updatedAt: string;
  nextUpdateAt?: string;
  source: string;
  fallback?: boolean;
  availableCurrencies?: string[];
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("UZS");
  const [data, setData] = useState<RatesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

  const availableCurrencies = useMemo(() => {
    if (!data) return POPULAR_CURRENCIES;
    return data.availableCurrencies || Object.keys(data.rates);
  }, [data]);

  const displayCurrencies = useMemo(() => {
    if (showAll) {
      return availableCurrencies.sort();
    }
    return POPULAR_CURRENCIES.filter((c) => availableCurrencies.includes(c));
  }, [availableCurrencies, showAll]);

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
      maximumFractionDigits: to === "UZS" || to === "JPY" || to === "KRW" ? 0 : 4,
    });
    return `1 ${from} = ${value} ${to}`;
  }, [data, from, to]);

  const getDecimalPlaces = (currency: string): number => {
    if (["UZS", "JPY", "KRW", "IDR", "VND", "PHL", "THB", "XOF", "XAF"].includes(currency)) return 0;
    if (["BHD", "KWD", "JOD", "OMR"].includes(currency)) return 3;
    return 2;
  };

  return (
    <section className="rounded-4xl border border-[#DDD] bg-white/80 p-6 shadow-2xl shadow-[#FF6B6B]/20 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#FF6B6B]">Live currency</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#2D2D2D]">Currency Converter</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666]">
            Real-time exchange rates for {availableCurrencies.length} world currencies. If the provider is unavailable, the widget keeps working with a clearly marked fallback.
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
          <CurrencySelect
            label="From"
            value={from}
            onChange={setFrom}
            currencies={displayCurrencies}
            allCount={availableCurrencies.length}
          />
          <CurrencySelect
            label="To"
            value={to}
            onChange={setTo}
            currencies={displayCurrencies}
            allCount={availableCurrencies.length}
          />
        </div>
        <div className="rounded-3xl border border-[#FFD93D] bg-[#FFD93D]/15 p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-[#999]">{rateText}</p>
          <p className="mt-3 text-3xl font-semibold text-[#2D2D2D]">
            {converted.toLocaleString(undefined, {
              maximumFractionDigits: getDecimalPlaces(to),
            })}{" "}
            {to}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#666]">
            {data?.fallback ? "Fallback rate active." : "Rates by ExchangeRate-API."}
            {data?.updatedAt ? ` Updated: ${data.updatedAt}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-semibold text-[#FF6B6B] transition hover:text-[#FF8787]"
        >
          {showAll ? "Show Popular Only" : `Show All ${availableCurrencies.length} Currencies`}
        </button>
        <p className="text-xs text-[#999]">
          {displayCurrencies.length} of {availableCurrencies.length} currencies
        </p>
      </div>
    </section>
  );
}

function CurrencySelect({
  label,
  value,
  onChange,
  currencies,
  allCount,
}: {
  label: string;
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  currencies: string[];
  allCount: number;
}) {
  const [search, setSearch] = useState("");

  const filteredCurrencies = useMemo(() => {
    if (!search) return currencies;
    const query = search.toLowerCase();
    return currencies.filter(
      (currency) =>
        currency.toLowerCase().includes(query) ||
        WORLD_CURRENCIES[currency]?.toLowerCase().includes(query)
    );
  }, [search, currencies]);

  return (
    <label className="grid gap-2 text-sm text-[#666]">
      {label}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => {
            onChange(event.target.value as CurrencyCode);
            setSearch("");
          }}
          className="rounded-3xl border border-[#DDD] bg-white px-4 py-4 font-semibold text-[#2D2D2D] outline-none focus:border-[#FF6B6B] w-full"
        >
          <optgroup label="Popular">
            {POPULAR_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency} · {WORLD_CURRENCIES[currency] || currency}
              </option>
            ))}
          </optgroup>
          <optgroup label="All Currencies">
            {currencies
              .filter((c) => !POPULAR_CURRENCIES.includes(c))
              .map((currency) => (
                <option key={currency} value={currency}>
                  {currency} · {WORLD_CURRENCIES[currency] || currency}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
    </label>
  );
}
