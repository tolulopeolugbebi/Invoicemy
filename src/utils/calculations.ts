import type { InvoiceData, InvoiceTotals } from '../types/invoice';

export const calculateLineItemTotal = (quantity: number, unitPrice: number): number => {
  const qty = Number(quantity) || 0;
  const price = Number(unitPrice) || 0;
  return Number((qty * price).toFixed(2));
};

export const calculateInvoiceTotals = (invoice: InvoiceData): InvoiceTotals => {
  const subtotal = (invoice.items || []).reduce((acc, item) => {
    return acc + calculateLineItemTotal(item.quantity, item.unitPrice);
  }, 0);

  let discountAmount = 0;
  const discountVal = Number(invoice.discountValue) || 0;
  if (invoice.discountType === 'percent') {
    discountAmount = (subtotal * Math.min(Math.max(discountVal, 0), 100)) / 100;
  } else {
    discountAmount = Math.min(Math.max(discountVal, 0), subtotal);
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Number(invoice.taxRate) || 0;
  const taxAmount = (taxableAmount * Math.max(taxRate, 0)) / 100;
  const shippingFee = Number(invoice.shippingFee) || 0;

  const total = Number((taxableAmount + taxAmount + shippingFee).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    taxableAmount: Number(taxableAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    total,
    itemCount: invoice.items.length,
  };
};
