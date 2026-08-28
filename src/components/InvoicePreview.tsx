import React from 'react';
import type { InvoiceData } from '../types/invoice';
import { calculateInvoiceTotals, calculateLineItemTotal } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';
import { Palette } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  onUpdateThemeColor: (color: string) => void;
}

const THEME_COLORS = [
  { name: 'Indigo', color: '#4F46E5' },
  { name: 'Emerald', color: '#059669' },
  { name: 'Blue', color: '#2563EB' },
  { name: 'Violet', color: '#7C3AED' },
  { name: 'Rose', color: '#E11D48' },
  { name: 'Executive Slate', color: '#0F172A' },
];

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onUpdateThemeColor,
}) => {
  const totals = calculateInvoiceTotals(invoice);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'status-badge paid';
      case 'pending':
        return 'status-badge pending';
      case 'overdue':
        return 'status-badge overdue';
      default:
        return 'status-badge draft';
    }
  };

  return (
    <div className="preview-panel">
      {/* Preview Toolbar */}
      <div className="preview-toolbar no-print">
        <div className="preview-title">
          <Palette size={16} style={{ color: invoice.themeColor }} />
          <span>Theme Accent:</span>
          <div className="theme-picker">
            {THEME_COLORS.map((item) => (
              <button
                key={item.color}
                type="button"
                className={`color-dot ${invoice.themeColor === item.color ? 'active' : ''}`}
                style={{ backgroundColor: item.color }}
                title={item.name}
                onClick={() => onUpdateThemeColor(item.color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Printable Invoice Paper Sheet */}
      <div className="invoice-paper-wrapper">
        <div 
          id="invoice-paper-document" 
          className={`invoice-paper template-${invoice.templateStyle || 'minimal'}`}
          style={{ '--primary': invoice.themeColor } as React.CSSProperties}
        >
          {/* Top Decorative Accent Bar */}
          <div className="paper-accent-bar" style={{ backgroundColor: invoice.themeColor }} />

          {/* Paper Header */}
          <div className="paper-header">
            <div className="paper-company">
              {invoice.business.logoUrl && (
                <img
                  src={invoice.business.logoUrl}
                  alt={invoice.business.name || 'Business Logo'}
                  className="paper-logo"
                />
              )}
              <div className="paper-company-name">
                {invoice.business.name || 'Your Business Name'}
              </div>
              <div className="paper-company-meta">
                {invoice.business.email && <div>{invoice.business.email}</div>}
                {invoice.business.phone && <div>{invoice.business.phone}</div>}
                {invoice.business.address && <div>{invoice.business.address}</div>}
                {(invoice.business.city || invoice.business.stateZip || invoice.business.country) && (
                  <div>
                    {[invoice.business.city, invoice.business.stateZip, invoice.business.country]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
                {invoice.business.taxId && <div>Tax ID: {invoice.business.taxId}</div>}
              </div>
            </div>

            <div className="paper-invoice-info">
              <div className="paper-invoice-title" style={{ color: invoice.themeColor }}>
                INVOICE
              </div>
              <div className="paper-invoice-number">
                #{invoice.invoiceNumber || 'INV-001'}
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span className={getStatusBadgeClass(invoice.status)}>
                  {invoice.status}
                </span>
              </div>

              <div className="paper-meta-table">
                <div className="paper-meta-row">
                  <span className="paper-meta-label">Issue Date:</span>
                  <span className="paper-meta-val">{invoice.issueDate || '—'}</span>
                </div>
                <div className="paper-meta-row">
                  <span className="paper-meta-label">Due Date:</span>
                  <span className="paper-meta-val">{invoice.dueDate || '—'}</span>
                </div>
                {invoice.paymentTerms && (
                  <div className="paper-meta-row">
                    <span className="paper-meta-label">Terms:</span>
                    <span className="paper-meta-val">{invoice.paymentTerms}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parties: Billed To / Billed From */}
          <div className="paper-parties">
            <div>
              <div className="party-title">Billed To:</div>
              <div className="party-name">
                {invoice.client.name || 'Client Name / Company'}
              </div>
              <div className="party-details">
                {invoice.client.email && <div>{invoice.client.email}</div>}
                {invoice.client.phone && <div>{invoice.client.phone}</div>}
                {invoice.client.address && <div>{invoice.client.address}</div>}
                {(invoice.client.city || invoice.client.stateZip || invoice.client.country) && (
                  <div>
                    {[invoice.client.city, invoice.client.stateZip, invoice.client.country]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
                {invoice.client.clientTaxId && <div>Tax ID: {invoice.client.clientTaxId}</div>}
              </div>
            </div>

            <div>
              <div className="party-title">Payment Due:</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: invoice.themeColor, fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(totals.total, invoice.currency)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                Due by: <strong>{invoice.dueDate || invoice.issueDate || 'Upon receipt'}</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="paper-items-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Description</th>
                <th style={{ width: '12%' }}>Qty</th>
                <th style={{ width: '18%' }}>Price</th>
                <th style={{ width: '20%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length === 0 || (invoice.items.length === 1 && !invoice.items[0].description) ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                    No line items added yet. Add items in the editor.
                  </td>
                </tr>
              ) : (
                invoice.items.map((item, index) => {
                  const lineTotal = calculateLineItemTotal(item.quantity, item.unitPrice);
                  return (
                    <tr key={item.id || index}>
                      <td>
                        <div className="paper-item-name">
                          {item.description || 'Untitled Item'}
                        </div>
                        {item.details && (
                          <div className="paper-item-details">{item.details}</div>
                        )}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice, invoice.currency)}</td>
                      <td>{formatCurrency(lineTotal, invoice.currency)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Bottom Grid: Notes & Summary */}
          <div className="paper-bottom-grid">
            <div className="paper-summary-block">
              <div className="paper-summary-row">
                <span>Subtotal:</span>
                <span className="paper-summary-val">{formatCurrency(totals.subtotal, invoice.currency)}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="paper-summary-row" style={{ color: '#059669' }}>
                  <span>
                    Discount {invoice.discountType === 'percent' ? `(${invoice.discountValue}%)` : ''}:
                  </span>
                  <span className="paper-summary-val" style={{ color: '#059669' }}>
                    -{formatCurrency(totals.discountAmount, invoice.currency)}
                  </span>
                </div>
              )}

              {totals.taxAmount > 0 && (
                <div className="paper-summary-row">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span className="paper-summary-val">+{formatCurrency(totals.taxAmount, invoice.currency)}</span>
                </div>
              )}

              {totals.shippingFee > 0 && (
                <div className="paper-summary-row">
                  <span>Shipping:</span>
                  <span className="paper-summary-val">+{formatCurrency(totals.shippingFee, invoice.currency)}</span>
                </div>
              )}

              <div className="paper-summary-total" style={{ borderTopColor: invoice.themeColor }}>
                <span className="paper-total-label">Total Due:</span>
                <span className="paper-total-amount" style={{ color: invoice.themeColor }}>
                  {formatCurrency(totals.total, invoice.currency)}
                </span>
              </div>
            </div>

            <div className="paper-notes-block">
              {invoice.paymentInstructions && (
                <div>
                  <div className="paper-note-section-title">Payment Instructions</div>
                  <div className="paper-note-text">{invoice.paymentInstructions}</div>
                </div>
              )}

              {invoice.notes && (
                <div>
                  <div className="paper-note-section-title">Notes / Terms</div>
                  <div className="paper-note-text">{invoice.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Paper Footer */}
          <div className="paper-footer">
            Thank you for your business! Generated with Invoicemy.
          </div>
        </div>
      </div>
    </div>
  );
};
