import { WORLD_CURRENCIES } from "@/data/currencies";

type CurrencyCode = string;

type ExchangeRateApiResponse = {
  result: "success" | string;
  base_code: CurrencyCode;
  time_last_update_utc?: string;
  time_next_update_utc?: string;
  rates: Record<string, number>;
  provider?: string;
};

// Fallback rates for major currencies when API fails
const fallbackRates: Record<string, number> = {
  USD: 1,
  EUR: 0.86,
  UZS: 12600,
  RUB: 80,
  GBP: 0.79,
  JPY: 110,
  CHF: 0.92,
  CAD: 1.25,
  AUD: 1.35,
  CNY: 6.45,
  INR: 82,
  HKD: 7.85,
  SGD: 1.35,
  KRW: 1200,
  MYR: 4.5,
  THB: 35,
  IDR: 15500,
  PHL: 56,
  VND: 24000,
  AED: 3.67,
  SAR: 3.75,
  TRY: 18,
  KZT: 430,
  ZAR: 18,
  BRL: 5,
  MXN: 17,
  SEK: 10,
  NOK: 10.5,
  DKK: 6.8,
  CZK: 24,
  HUF: 360,
  PLN: 4,
};

export async function GET() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`Rates request failed with ${response.status}`);
    }

    const data = (await response.json()) as ExchangeRateApiResponse;
    if (data.result !== "success") {
      throw new Error("Rates provider returned a non-success result");
    }

    // Filter rates to include only currencies we have names for
    const rates: Record<string, number> = { USD: 1 };
    for (const [code, rate] of Object.entries(data.rates)) {
      if (WORLD_CURRENCIES[code] || fallbackRates[code]) {
        rates[code] = rate;
      }
    }

    return Response.json({
      base: "USD",
      rates,
      updatedAt: data.time_last_update_utc ?? new Date().toUTCString(),
      nextUpdateAt: data.time_next_update_utc,
      source: data.provider ?? "https://www.exchangerate-api.com",
      availableCurrencies: Object.keys(rates),
    });
  } catch {
    return Response.json({
      base: "USD",
      rates: fallbackRates,
      updatedAt: new Date().toUTCString(),
      source: "fallback",
      fallback: true,
      availableCurrencies: Object.keys(fallbackRates),
    });
  }
}
