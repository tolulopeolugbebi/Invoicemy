import type { CurrencyCode, CurrencyConfig } from '../types/invoice';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar ($)', position: 'prefix' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (€)', position: 'prefix' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (£)', position: 'prefix' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)', position: 'prefix' },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AU$)', position: 'prefix' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', position: 'prefix' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', position: 'prefix' },
  CHF: { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc (CHF)', position: 'prefix' },
  SGD: { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar (SG$)', position: 'prefix' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar (NZ$)', position: 'prefix' },
  BRL: { code: 'BRL', symbol: 'R$ ', name: 'Brazilian Real (R$)', position: 'prefix' },
};

export const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'USD'): string => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
  }).format(isNaN(amount) ? 0 : amount);

  if (currency.position === 'suffix') {
    return `${formattedNumber} ${currency.symbol}`;
  }
  return `${currency.symbol}${formattedNumber}`;
};
