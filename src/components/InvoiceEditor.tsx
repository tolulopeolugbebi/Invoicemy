import React, { useRef } from 'react';
import { 
  Building2, 
  UserCheck, 
  FileCheck, 
  Percent, 
  CreditCard, 
  X,
  UploadCloud
} from 'lucide-react';
import type { InvoiceData, CurrencyCode, InvoiceStatus } from '../types/invoice';
import { CURRENCIES, formatCurrency } from '../utils/currencies';
import { calculateInvoiceTotals } from '../utils/calculations';
import { LineItemsEditor } from './LineItemsEditor';

interface InvoiceEditorProps {
  invoice: InvoiceData;
  onUpdateInvoice: (invoice: InvoiceData) => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  invoice,
  onUpdateInvoice,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const totals = calculateInvoiceTotals(invoice);

  const handleFieldChange = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    onUpdateInvoice({
      ...invoice,
      [field]: value,
    });
  };

  const handleBusinessChange = (field: keyof typeof invoice.business, value: string) => {
    onUpdateInvoice({
      ...invoice,
      business: {
        ...invoice.business,
        [field]: value,
      },
    });
  };

  const handleClientChange = (field: keyof typeof invoice.client, value: string) => {
    onUpdateInvoice({
      ...invoice,
      client: {
        ...invoice.client,
        [field]: value,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      handleBusinessChange('logoUrl', event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    handleBusinessChange('logoUrl', '');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  return (
    <div className="editor-panel">
      {/* 1. Invoice Meta / General Information */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-title">
            <FileCheck size={18} className="card-title-icon" />
            <span>Invoice Information</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              id="invoice-status-select"
              className="form-select"
              style={{ width: 'auto', padding: '0.25rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}
              value={invoice.status}
              onChange={(e) => handleFieldChange('status', e.target.value as InvoiceStatus)}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="form-grid-4">
          <div className="form-group">
            <label className="form-label" htmlFor="invoice-number">Invoice #</label>
            <input
              id="invoice-number"
              type="text"
              className="form-input"
              value={invoice.invoiceNumber}
              onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
              placeholder="e.g. INV-2026-001"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="currency-select">Currency</label>
            <select
              id="currency-select"
              className="form-select"
              value={invoice.currency}
              onChange={(e) => handleFieldChange('currency', e.target.value as CurrencyCode)}
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="issue-date">Issue Date</label>
            <input
              id="issue-date"
              type="date"
              className="form-input"
              value={invoice.issueDate}
              onChange={(e) => handleFieldChange('issueDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="due-date">Due Date</label>
            <input
              id="due-date"
              type="date"
              className="form-input"
              value={invoice.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="payment-terms">Payment Terms</label>
            <input
              id="payment-terms"
              type="text"
              className="form-input"
              value={invoice.paymentTerms}
              onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
              placeholder="e.g. Due on receipt, Net 14, Net 30"
            />
          </div>
        </div>
      </div>

      {/* 2. Business Details (Your Company / Freelancer) */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-title">
            <Building2 size={18} className="card-title-icon" />
            <span>Your Business Details (From)</span>
          </div>
        </div>

        <div className="form-grid">
          {/* Logo Upload */}
          <div className="form-group col-span-2">
            <label className="form-label">Company Logo</label>
            {invoice.business.logoUrl ? (
              <div className="logo-preview-box">
                <img
                  src={invoice.business.logoUrl}
                  alt="Business Logo Preview"
                  className="logo-preview-img"
                />
                <button
                  type="button"
                  id="remove-logo-btn"
                  className="btn btn-sm btn-danger"
                  onClick={handleRemoveLogo}
                >
                  <X size={14} />
                  <span>Remove Logo</span>
                </button>
              </div>
            ) : (
              <div
                id="logo-upload-dropzone"
                className="logo-upload-area"
                onClick={() => logoInputRef.current?.click()}
              >
                <UploadCloud size={24} style={{ color: 'var(--primary)', margin: '0 auto 0.25rem' }} />
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Click to upload company logo
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  PNG, JPG, SVG or WEBP (Max 2MB)
                </div>
              </div>
            )}
            <input
              type="file"
              ref={logoInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="business-name">Business / Freelancer Name *</label>
            <input
              id="business-name"
              type="text"
              className="form-input"
              value={invoice.business.name}
              onChange={(e) => handleBusinessChange('name', e.target.value)}
              placeholder="e.g. Apex Studio LLC / John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business-email">Email Address</label>
            <input
              id="business-email"
              type="email"
              className="form-input"
              value={invoice.business.email}
              onChange={(e) => handleBusinessChange('email', e.target.value)}
              placeholder="billing@yourdomain.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business-phone">Phone Number</label>
            <input
              id="business-phone"
              type="text"
              className="form-input"
              value={invoice.business.phone}
              onChange={(e) => handleBusinessChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="business-address">Street Address</label>
            <input
              id="business-address"
              type="text"
              className="form-input"
              value={invoice.business.address}
              onChange={(e) => handleBusinessChange('address', e.target.value)}
              placeholder="123 Business Boulevard, Suite 500"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business-city">City</label>
            <input
              id="business-city"
              type="text"
              className="form-input"
              value={invoice.business.city}
              onChange={(e) => handleBusinessChange('city', e.target.value)}
              placeholder="San Francisco"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business-state-zip">State / Zip Code</label>
            <input
              id="business-state-zip"
              type="text"
              className="form-input"
              value={invoice.business.stateZip}
              onChange={(e) => handleBusinessChange('stateZip', e.target.value)}
              placeholder="CA 94107"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business-country">Country</label>
            <input
              id="business-country"
              type="text"
              className="form-input"
              value={invoice.business.country}
              onChange={(e) => handleBusinessChange('country', e.target.value)}
              placeholder="United States"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business-tax-id">Tax ID / VAT / GST</label>
            <input
              id="business-tax-id"
              type="text"
              className="form-input"
              value={invoice.business.taxId}
              onChange={(e) => handleBusinessChange('taxId', e.target.value)}
              placeholder="e.g. US-EIN-12345678"
            />
          </div>
        </div>
      </div>

      {/* 3. Client Details (Bill To) */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-title">
            <UserCheck size={18} className="card-title-icon" />
            <span>Client Details (Bill To)</span>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="client-name">Client / Company Name *</label>
            <input
              id="client-name"
              type="text"
              className="form-input"
              value={invoice.client.name}
              onChange={(e) => handleClientChange('name', e.target.value)}
              placeholder="e.g. Acme Corporation / Jane Smith"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="client-email">Client Email</label>
            <input
              id="client-email"
              type="email"
              className="form-input"
              value={invoice.client.email}
              onChange={(e) => handleClientChange('email', e.target.value)}
              placeholder="accounts@acme.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="client-phone">Client Phone</label>
            <input
              id="client-phone"
              type="text"
              className="form-input"
              value={invoice.client.phone}
              onChange={(e) => handleClientChange('phone', e.target.value)}
              placeholder="+1 (555) 999-8888"
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="client-address">Billing Address</label>
            <input
              id="client-address"
              type="text"
              className="form-input"
              value={invoice.client.address}
              onChange={(e) => handleClientChange('address', e.target.value)}
              placeholder="742 Evergreen Terrace"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="client-city">City</label>
            <input
              id="client-city"
              type="text"
              className="form-input"
              value={invoice.client.city}
              onChange={(e) => handleClientChange('city', e.target.value)}
              placeholder="New York"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="client-state-zip">State / Zip Code</label>
            <input
              id="client-state-zip"
              type="text"
              className="form-input"
              value={invoice.client.stateZip}
              onChange={(e) => handleClientChange('stateZip', e.target.value)}
              placeholder="NY 10001"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="client-country">Country</label>
            <input
              id="client-country"
              type="text"
              className="form-input"
              value={invoice.client.country}
              onChange={(e) => handleClientChange('country', e.target.value)}
              placeholder="United States"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="client-tax-id">Client Tax ID (Optional)</label>
            <input
              id="client-tax-id"
              type="text"
              className="form-input"
              value={invoice.client.clientTaxId || ''}
              onChange={(e) => handleClientChange('clientTaxId', e.target.value)}
              placeholder="e.g. VAT / Tax Reg #"
            />
          </div>
        </div>
      </div>

      {/* 4. Line Items Table */}
      <LineItemsEditor
        items={invoice.items}
        currency={invoice.currency}
        onChangeItems={(items) => handleFieldChange('items', items)}
      />

      {/* 5. Discounts, Taxes & Financial Summary */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-title">
            <Percent size={18} className="card-title-icon" />
            <span>Taxes, Discounts &amp; Totals</span>
          </div>
        </div>

        <div className="form-grid-3">
          {/* Tax Rate */}
          <div className="form-group">
            <label className="form-label" htmlFor="tax-rate-input">
              <span>Tax / VAT / GST (%)</span>
            </label>
            <input
              id="tax-rate-input"
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="form-input"
              value={invoice.taxRate === 0 ? '' : invoice.taxRate}
              placeholder="0%"
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                handleFieldChange('taxRate', isNaN(val) ? 0 : Math.max(0, val));
              }}
            />
          </div>

          {/* Discount */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }} htmlFor="discount-input">Discount</label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  type="button"
                  id="discount-percent-btn"
                  className={`btn-sm ${invoice.discountType === 'percent' ? 'btn-primary' : 'btn-subtle'}`}
                  style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}
                  onClick={() => handleFieldChange('discountType', 'percent')}
                >
                  %
                </button>
                <button
                  type="button"
                  id="discount-fixed-btn"
                  className={`btn-sm ${invoice.discountType === 'fixed' ? 'btn-primary' : 'btn-subtle'}`}
                  style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}
                  onClick={() => handleFieldChange('discountType', 'fixed')}
                >
                  {CURRENCIES[invoice.currency]?.symbol || '$'}
                </button>
              </div>
            </div>
            <input
              id="discount-input"
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.discountValue === 0 ? '' : invoice.discountValue}
              placeholder={invoice.discountType === 'percent' ? '0%' : '0.00'}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                handleFieldChange('discountValue', isNaN(val) ? 0 : Math.max(0, val));
              }}
            />
          </div>

          {/* Shipping Fee */}
          <div className="form-group">
            <label className="form-label" htmlFor="shipping-input">
              <span>Shipping / Extra Fee</span>
            </label>
            <input
              id="shipping-input"
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.shippingFee === 0 ? '' : invoice.shippingFee}
              placeholder="0.00"
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                handleFieldChange('shippingFee', isNaN(val) ? 0 : Math.max(0, val));
              }}
            />
          </div>
        </div>

        {/* Live Calculation Summary Container */}
        <div className="summary-container">
          <div className="summary-row">
            <span>Subtotal ({totals.itemCount} items)</span>
            <span className="summary-amount">{formatCurrency(totals.subtotal, invoice.currency)}</span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="summary-row" style={{ color: '#059669' }}>
              <span>
                Discount {invoice.discountType === 'percent' ? `(${invoice.discountValue}%)` : ''}
              </span>
              <span className="summary-amount" style={{ color: '#059669' }}>
                -{formatCurrency(totals.discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          {totals.taxAmount > 0 && (
            <div className="summary-row">
              <span>Tax ({invoice.taxRate}%)</span>
              <span className="summary-amount">+{formatCurrency(totals.taxAmount, invoice.currency)}</span>
            </div>
          )}

          {totals.shippingFee > 0 && (
            <div className="summary-row">
              <span>Shipping &amp; Handling</span>
              <span className="summary-amount">+{formatCurrency(totals.shippingFee, invoice.currency)}</span>
            </div>
          )}

          <div className="summary-row total-row">
            <span>Grand Total</span>
            <span className="summary-amount grand-total">
              {formatCurrency(totals.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Payment Instructions & Notes */}
      <div className="form-card">
        <div className="card-header">
          <div className="card-title">
            <CreditCard size={18} className="card-title-icon" />
            <span>Payment Instructions &amp; Notes</span>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="payment-instructions">Payment Details / Bank Info</label>
            <textarea
              id="payment-instructions"
              className="form-textarea"
              rows={3}
              value={invoice.paymentInstructions}
              onChange={(e) => handleFieldChange('paymentInstructions', e.target.value)}
              placeholder="Bank Name, IBAN / Account Number, SWIFT, PayPal, etc."
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label" htmlFor="invoice-notes">Client Notes &amp; Terms</label>
            <textarea
              id="invoice-notes"
              className="form-textarea"
              rows={2}
              value={invoice.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Thank you for your business! Custom terms or warranty conditions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
