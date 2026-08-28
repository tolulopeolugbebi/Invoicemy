export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'CHF' | 'SGD' | 'NZD' | 'BRL' | 'NGN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
}

export interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  stateZip: string;
  country: string;
  taxId: string;
  website: string;
  logoUrl?: string;
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  stateZip: string;
  country: string;
  clientTaxId?: string;
}

export interface LineItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';
export type DiscountType = 'percent' | 'fixed';
export type TemplateStyle = 'modern' | 'minimal' | 'classic' | 'executive';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: CurrencyCode;
  status: InvoiceStatus;
  business: BusinessDetails;
  client: ClientDetails;
  items: LineItem[];
  taxRate: number; // percentage, e.g. 10 for 10%
  discountType: DiscountType;
  discountValue: number; // percentage or fixed dollar amount
  shippingFee: number;
  notes: string;
  paymentInstructions: string;
  themeColor: string;
  templateStyle: TemplateStyle;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}
