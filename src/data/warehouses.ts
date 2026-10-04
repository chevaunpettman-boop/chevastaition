import { Warehouse, Currency } from '../types';

export const WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-01',
    code: 'BKK-HUB',
    name: 'Bangkok Suvarnabhumi Global Export Center',
    city: 'Samut Prakan / Bangkok',
    country: 'Thailand',
    type: 'Central Export Hub',
    coldCapacityUsedPercent: 68,
    ambientCapacityUsedPercent: 82,
    activeShipmentsCount: 384,
    handlingFeeUsd: 4.50,
  },
  {
    id: 'wh-02',
    code: 'CNX-DEPOT',
    name: 'Chiang Mai Highland Artisanal Depot',
    city: 'Chiang Mai',
    country: 'Thailand',
    type: 'Artisanal Sourcing Depot',
    coldCapacityUsedPercent: 44,
    ambientCapacityUsedPercent: 61,
    activeShipmentsCount: 112,
    handlingFeeUsd: 3.20,
  },
  {
    id: 'wh-03',
    code: 'LAX-FWD',
    name: 'Los Angeles West Coast Forward Depot',
    city: 'Carson, California',
    country: 'United States',
    type: 'Forward Cross-Dock',
    coldCapacityUsedPercent: 28,
    ambientCapacityUsedPercent: 74,
    activeShipmentsCount: 245,
    handlingFeeUsd: 6.80,
  },
  {
    id: 'wh-04',
    code: 'FRA-FWD',
    name: 'Frankfurt European Hub & Cross-Dock',
    city: 'Frankfurt am Main',
    country: 'Germany',
    type: 'Forward Cross-Dock',
    coldCapacityUsedPercent: 35,
    ambientCapacityUsedPercent: 69,
    activeShipmentsCount: 178,
    handlingFeeUsd: 7.20,
  },
];

export const CURRENCY_RATES: Record<Currency, { symbol: string; rateFromUsd: number; name: string }> = {
  USD: { symbol: '$', rateFromUsd: 1.0, name: 'US Dollar' },
  THB: { symbol: '฿', rateFromUsd: 36.5, name: 'Thai Baht' },
  EUR: { symbol: '€', rateFromUsd: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rateFromUsd: 0.79, name: 'British Pound' },
  JPY: { symbol: '¥', rateFromUsd: 154.2, name: 'Japanese Yen' },
  AUD: { symbol: 'A$', rateFromUsd: 1.52, name: 'Australian Dollar' },
};

export interface TaxRule {
  countryCode: string;
  countryName: string;
  taxRatePercent: number;
  dutyThresholdUsd: number;
  dutyRatePercent: number;
  customsRegime: string;
}

export const COUNTRY_TAX_RULES: Record<string, TaxRule> = {
  US: {
    countryCode: 'US',
    countryName: 'United States',
    taxRatePercent: 7.5,
    dutyThresholdUsd: 800, // Section 321 de minimis
    dutyRatePercent: 0,
    customsRegime: 'US CBP Section 321 Duty-Free Entry',
  },
  TH: {
    countryCode: 'TH',
    countryName: 'Thailand (Local Domestic)',
    taxRatePercent: 7.0, // Domestic VAT
    dutyThresholdUsd: 9999,
    dutyRatePercent: 0,
    customsRegime: 'Thai Revenue Dept Domestic VAT 7%',
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    taxRatePercent: 20.0,
    dutyThresholdUsd: 175,
    dutyRatePercent: 4.5,
    customsRegime: 'HMRC Import VAT & Phytosanitary Checks',
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany & EU (IOSS)',
    taxRatePercent: 19.0,
    dutyThresholdUsd: 160,
    dutyRatePercent: 3.8,
    customsRegime: 'EU Import One-Stop Shop (IOSS) Compliant',
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    taxRatePercent: 10.0,
    dutyThresholdUsd: 130,
    dutyRatePercent: 3.0,
    customsRegime: 'Japan Customs Consumption Tax & MAFF Notice',
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    taxRatePercent: 10.0,
    dutyThresholdUsd: 650,
    dutyRatePercent: 5.0,
    customsRegime: 'Australian Dept of Agriculture Biosecurity (BICON)',
  },
};

/**
 * Volumetric Weight Formula: (L x W x H in cm) / 5000 = Volumetric kg
 */
export function calculateVolumetricWeightKg(l: number, w: number, h: number): number {
  return Number(((l * w * h) / 5000).toFixed(2));
}
