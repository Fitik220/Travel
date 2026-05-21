type CurrencyCode = "USD" | "EUR" | "UZS" | "RUB";

type ExchangeRateApiResponse = {
  result: "success" | string;
  base_code: CurrencyCode;
  time_last_update_utc?: string;
  time_next_update_utc?: string;
  rates: Partial<Record<CurrencyCode, number>>;
  provider?: string;
};

const fallbackRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.86,
  UZS: 12600,
  RUB: 80,
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

    const rates: Record<CurrencyCode, number> = {
      USD: 1,
      EUR: data.rates.EUR ?? fallbackRates.EUR,
      UZS: data.rates.UZS ?? fallbackRates.UZS,
      RUB: data.rates.RUB ?? fallbackRates.RUB,
    };

    return Response.json({
      base: "USD",
      rates,
      updatedAt: data.time_last_update_utc ?? new Date().toUTCString(),
      nextUpdateAt: data.time_next_update_utc,
      source: data.provider ?? "https://www.exchangerate-api.com",
    });
  } catch {
    return Response.json({
      base: "USD",
      rates: fallbackRates,
      updatedAt: new Date().toUTCString(),
      source: "fallback",
      fallback: true,
    });
  }
}
