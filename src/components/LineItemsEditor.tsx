import React from 'react';
import { Plus, Trash2, Copy, Layers } from 'lucide-react';
import type { LineItem, CurrencyCode } from '../types/invoice';
import { calculateLineItemTotal } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';

interface LineItemsEditorProps {
  items: LineItem[];
  currency: CurrencyCode;
  onChangeItems: (items: LineItem[]) => void;
}

export const LineItemsEditor: React.FC<LineItemsEditorProps> = ({
  items,
  currency,
  onChangeItems,
}) => {
  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChangeItems(updated);
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: 'item_' + Date.now(),
      description: '',
      details: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChangeItems([...items, newItem]);
  };

  const handleDuplicateItem = (index: number) => {
    const target = items[index];
    const duplicated: LineItem = {
      ...target,
      id: 'item_' + Date.now(),
      description: target.description ? `${target.description} (Copy)` : '',
    };
    const updated = [...items];
    updated.splice(index + 1, 0, duplicated);
    onChangeItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      // If only one item, clear it instead of leaving 0 items
      onChangeItems([
        {
          id: 'item_' + Date.now(),
          description: '',
          details: '',
          quantity: 1,
          unitPrice: 0,
        },
      ]);
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChangeItems(updated);
  };

  return (
    <div className="form-card">
      <div className="card-header">
        <div className="card-title">
          <Layers size={18} className="card-title-icon" />
          <span>Invoice Items ({items.length})</span>
        </div>
        <button
          type="button"
          id="add-item-btn-top"
          className="btn btn-secondary btn-sm"
          onClick={handleAddItem}
        >
          <Plus size={14} />
          <span>Add Line Item</span>
        </button>
      </div>

      <div className="items-table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Item &amp; Description</th>
              <th style={{ width: '15%' }}>Qty</th>
              <th style={{ width: '20%' }}>Unit Price</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Amount</th>
              <th style={{ width: '5%', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const lineTotal = calculateLineItemTotal(item.quantity, item.unitPrice);
              return (
                <tr key={item.id || index} className="item-row">
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Service or product description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      id={`item-desc-${index}`}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                      placeholder="Additional details / scope (optional)"
                      value={item.details || ''}
                      onChange={(e) => handleItemChange(index, 'details', e.target.value)}
                      id={`item-details-${index}`}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="form-input"
                      style={{ textAlign: 'center' }}
                      value={item.quantity === 0 ? '' : item.quantity}
                      placeholder="1"
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        handleItemChange(index, 'quantity', isNaN(val) ? 0 : val);
                      }}
                      id={`item-qty-${index}`}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="form-input"
                      style={{ textAlign: 'right' }}
                      value={item.unitPrice === 0 ? '' : item.unitPrice}
                      placeholder="0.00"
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        handleItemChange(index, 'unitPrice', isNaN(val) ? 0 : val);
                      }}
                      id={`item-price-${index}`}
                    />
                  </td>

                  <td className="item-total-cell">
                    {formatCurrency(lineTotal, currency)}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-only btn-subtle"
                        title="Duplicate item"
                        onClick={() => handleDuplicateItem(index)}
                        id={`item-duplicate-${index}`}
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-only btn-danger"
                        title="Remove item"
                        onClick={() => handleRemoveItem(index)}
                        id={`item-remove-${index}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        id="add-item-btn-bottom"
        className="btn btn-secondary"
        style={{ width: '100%', borderStyle: 'dashed' }}
        onClick={handleAddItem}
      >
        <Plus size={16} />
        <span>Add Another Item</span>
      </button>
    </div>
  );
};
