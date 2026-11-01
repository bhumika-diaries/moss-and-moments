import { useState, useEffect, useCallback } from 'react';
import {
  currencyService,
  UserCurrencySettings,
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES,
  ExchangeRatesState,
} from '../services/currencyService';

export function useCurrency() {
  const [settings, setSettings] = useState<UserCurrencySettings>(() => currencyService.getSettings());
  const [ratesState, setRatesState] = useState<ExchangeRatesState>(() => currencyService.getRatesState());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = currencyService.subscribe(() => {
      setSettings(currencyService.getSettings());
      setRatesState(currencyService.getRatesState());
    });
    return unsubscribe;
  }, []);

  const updateCountry = useCallback((countryCode: string) => {
    const country = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);
    const newSettings: UserCurrencySettings = {
      countryCode,
      currencyCode: country ? country.defaultCurrency : settings.currencyCode,
    };
    currencyService.saveSettings(newSettings);
  }, [settings.currencyCode]);

  const updateCurrency = useCallback((currencyCode: string) => {
    const newSettings: UserCurrencySettings = {
      ...settings,
      currencyCode,
    };
    currencyService.saveSettings(newSettings);
  }, [settings]);

  const refreshRates = useCallback(async () => {
    setIsRefreshing(true);
    await currencyService.refreshLiveRates();
    setIsRefreshing(false);
  }, []);

  const formatMoney = useCallback(
    (amount: number, options?: { showOriginal?: boolean; compact?: boolean }) => {
      return currencyService.formatAmount(amount, 'USD', settings.currencyCode, options);
    },
    [settings.currencyCode]
  );

  const activeCurrencyInfo = SUPPORTED_CURRENCIES[settings.currencyCode] || SUPPORTED_CURRENCIES.USD;
  const activeCountryInfo = SUPPORTED_COUNTRIES.find((c) => c.code === settings.countryCode) || SUPPORTED_COUNTRIES[1];

  return {
    settings,
    ratesState,
    isRefreshing,
    activeCountry: activeCountryInfo,
    activeCurrency: activeCurrencyInfo,
    updateCountry,
    updateCurrency,
    refreshRates,
    formatMoney,
    convertAmount: currencyService.convertAmount.bind(currencyService),
    exchangeRateDisplay: currencyService.getExchangeRateDisplay(settings.currencyCode),
    supportedCountries: SUPPORTED_COUNTRIES,
    supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
  };
}
