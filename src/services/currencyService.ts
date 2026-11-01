export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  locale: string;
  fractionDigits: number;
}

export interface ExchangeRatesState {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  source: 'live' | 'offline-reference';
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', defaultCurrency: 'INR' },
  { code: 'US', name: 'United States', flag: '🇺🇸', defaultCurrency: 'USD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', defaultCurrency: 'GBP' },
  { code: 'EU', name: 'Eurozone (Germany, France, Italy)', flag: '🇪🇺', defaultCurrency: 'EUR' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', defaultCurrency: 'JPY' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', defaultCurrency: 'KRW' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', defaultCurrency: 'SGD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', defaultCurrency: 'AUD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', defaultCurrency: 'CAD' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', defaultCurrency: 'AED' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', defaultCurrency: 'CHF' },
];

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', fractionDigits: 0 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', fractionDigits: 0 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', fractionDigits: 0 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', fractionDigits: 0 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', fractionDigits: 0 },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR', fractionDigits: 0 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG', fractionDigits: 0 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', fractionDigits: 0 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', fractionDigits: 0 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'en-AE', fractionDigits: 0 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH', fractionDigits: 0 },
};

// Verified reference rates against USD (base = USD 1.0)
const OFFLINE_REFERENCE_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 84.15,
  GBP: 0.78,
  EUR: 0.92,
  JPY: 152.4,
  KRW: 1378.0,
  SGD: 1.32,
  AUD: 1.52,
  CAD: 1.39,
  AED: 3.67,
  CHF: 0.87,
};

const STORAGE_KEYS = {
  SETTINGS: 'moss_moments_currency_settings',
  RATES: 'moss_moments_cached_rates',
};

export interface UserCurrencySettings {
  countryCode: string;
  currencyCode: string;
}

const DEFAULT_SETTINGS: UserCurrencySettings = {
  countryCode: 'US',
  currencyCode: 'USD',
};

class CurrencyService {
  private ratesState: ExchangeRatesState = {
    base: 'USD',
    rates: OFFLINE_REFERENCE_RATES,
    lastUpdated: 'Nov 1, 2026, 09:00 UTC (Reference)',
    source: 'offline-reference',
  };

  private listeners: Array<() => void> = [];

  constructor() {
    this.loadCachedRates();
    // Fetch live rates on startup in background
    this.refreshLiveRates();
  }

  private loadCachedRates(): void {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.RATES);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.rates && parsed.rates.USD) {
          this.ratesState = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached exchange rates:', e);
    }
  }

  getSettings(): UserCurrencySettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.countryCode && parsed.currencyCode) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read currency settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(settings: UserCurrencySettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      this.notify();
    } catch (e) {
      console.error('Could not save currency settings:', e);
    }
  }

  getRatesState(): ExchangeRatesState {
    return this.ratesState;
  }

  async refreshLiveRates(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && data.rates.INR) {
          const formattedDate = new Date(data.time_last_update_utc || Date.now()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          });

          this.ratesState = {
            base: 'USD',
            rates: {
              ...OFFLINE_REFERENCE_RATES,
              ...data.rates,
            },
            lastUpdated: `${formattedDate}`,
            source: 'live',
          };

          localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(this.ratesState));
          this.notify();
          return true;
        }
      }
    } catch (e) {
      console.info('Live exchange rate API unavailable; utilizing verified offline reference rates.', e);
    }
    return false;
  }

  convertAmount(amount: number, fromCurrency = 'USD', toCurrency?: string): number {
    if (!amount || isNaN(amount)) return 0;
    const current = toCurrency || this.getSettings().currencyCode;
    if (fromCurrency === current) {
      return amount;
    }

    const rates = this.ratesState.rates;
    const rateFrom = rates[fromCurrency] || OFFLINE_REFERENCE_RATES[fromCurrency] || 1.0;
    const rateTo = rates[current] || OFFLINE_REFERENCE_RATES[current] || 1.0;

    // Convert from origin to USD base, then from USD to target
    const amountInUSD = amount / rateFrom;
    const converted = amountInUSD * rateTo;
    return converted;
  }

  formatAmount(
    amount: number,
    fromCurrency = 'USD',
    toCurrency?: string,
    options?: { showOriginal?: boolean; compact?: boolean }
  ): string {
    const targetCurrencyCode = toCurrency || this.getSettings().currencyCode;
    const currencyInfo = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES.USD;
    const converted = this.convertAmount(amount, fromCurrency, targetCurrencyCode);

    try {
      const formatter = new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyInfo.code,
        maximumFractionDigits: options?.compact ? 0 : currencyInfo.fractionDigits,
        minimumFractionDigits: options?.compact ? 0 : currencyInfo.fractionDigits,
      });

      const formatted = formatter.format(Math.round(converted));

      if (options?.showOriginal && targetCurrencyCode !== fromCurrency) {
        const origFormatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: fromCurrency,
          maximumFractionDigits: 0,
        });
        return `${formatted} (${origFormatter.format(amount)})`;
      }

      return formatted;
    } catch (e) {
      return `${currencyInfo.symbol}${Math.round(converted).toLocaleString()}`;
    }
  }

  getExchangeRateDisplay(targetCurrency?: string): string {
    const current = targetCurrency || this.getSettings().currencyCode;
    if (current === 'USD') return '1 USD = $1.00 USD';
    const rate = this.ratesState.rates[current] || OFFLINE_REFERENCE_RATES[current] || 1.0;
    const info = SUPPORTED_CURRENCIES[current];
    return `1 USD = ${info?.symbol || ''}${rate.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${current}`;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

export const currencyService = new CurrencyService();
