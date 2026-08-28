import type { InvoiceData } from '../types/invoice';
import { sampleTemplates } from './sampleData';

const STORAGE_KEY = 'invoicemy_current_invoice_v1';

export const loadSavedInvoice = (): InvoiceData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.items && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load invoice from localStorage:', err);
  }
  // Default to the first sample template so user has an immediate live visual preview
  return sampleTemplates[0].data;
};

export const saveInvoiceToStorage = (invoice: InvoiceData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  } catch (err) {
    console.error('Failed to save invoice to localStorage:', err);
  }
};

export const exportInvoiceToJson = (invoice: InvoiceData): void => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(invoice, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${invoice.invoiceNumber || 'invoice'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
