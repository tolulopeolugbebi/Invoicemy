import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  PlusCircle, 
  Sparkles, 
  ChevronDown
} from 'lucide-react';
import type { InvoiceData } from '../types/invoice';
import { sampleTemplates, emptyInvoice } from '../utils/sampleData';
import confetti from 'canvas-confetti';

interface NavbarProps {
  invoice: InvoiceData;
  onUpdateInvoice: (invoice: InvoiceData) => void;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  invoice,
  onUpdateInvoice,
  activeTab,
  setActiveTab,
}) => {
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);

  const handlePrint = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.1 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6'],
      });
    } catch {
      // Confetti fallback
    }
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleLoadSample = (template: typeof sampleTemplates[0]) => {
    onUpdateInvoice({
      ...template.data,
      id: 'inv_' + Date.now(),
    });
    setTemplateDropdownOpen(false);
  };

  const handleNewInvoice = () => {
    if (window.confirm('Create a new invoice? Any unsaved changes will be cleared.')) {
      onUpdateInvoice({
        ...emptyInvoice,
        id: 'inv_' + Date.now(),
      });
    }
  };



  return (
    <header className="navbar no-print">
      <div className="navbar-content">
        <div className="brand-section">
          <div className="brand-icon">
            <FileText size={22} />
          </div>
          <div>
            <div className="brand-title">
              Invoicemy <span>.</span>
              <span className="brand-badge">Free Generator</span>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="view-tabs">
          <button
            id="tab-edit-btn"
            className={`view-tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            Editor
          </button>
          <button
            id="tab-preview-btn"
            className={`view-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        <div className="nav-actions">
          {/* Preset Templates Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              id="template-dropdown-btn"
              className="btn btn-secondary"
              onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
              title="Load realistic sample data"
            >
              <Sparkles size={16} style={{ color: '#F59E0B' }} />
              <span>Samples</span>
              <ChevronDown size={14} />
            </button>

            {templateDropdownOpen && (
              <div className="dropdown-menu">
                <div style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Choose Template
                </div>
                {sampleTemplates.map((template) => (
                  <button
                    key={template.name}
                    className="dropdown-item"
                    onClick={() => handleLoadSample(template)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{template.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Invoice Button */}
          <button
            id="new-invoice-btn"
            className="btn btn-subtle"
            onClick={handleNewInvoice}
            title="Create blank invoice"
          >
            <PlusCircle size={16} />
            <span>New</span>
          </button>


          {/* Primary Action: Print / PDF */}
          <button
            id="print-invoice-btn"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
