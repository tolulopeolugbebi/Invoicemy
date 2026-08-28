import React, { useState, useEffect } from 'react';
import type { InvoiceData } from './types/invoice';
import { loadSavedInvoice, saveInvoiceToStorage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';

export const App: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>(() => loadSavedInvoice());
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Auto-save to localStorage whenever invoice state changes
  useEffect(() => {
    saveInvoiceToStorage(invoice);
  }, [invoice]);

  // Update root primary CSS variable when theme color changes
  useEffect(() => {
    if (invoice.themeColor) {
      document.documentElement.style.setProperty('--primary', invoice.themeColor);
    }
  }, [invoice.themeColor]);

  const handleUpdateInvoice = (updated: InvoiceData) => {
    setInvoice(updated);
  };

  const handleUpdateThemeColor = (color: string) => {
    setInvoice((prev) => ({
      ...prev,
      themeColor: color,
    }));
  };

  return (
    <div className="app-container">
      <Navbar
        invoice={invoice}
        onUpdateInvoice={handleUpdateInvoice}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-layout">
        {/* Editor Column - Hidden on mobile if preview tab active */}
        <div className={`editor-column ${activeTab === 'preview' ? 'hide-on-mobile-tab' : ''}`}>
          <InvoiceEditor
            invoice={invoice}
            onUpdateInvoice={handleUpdateInvoice}
          />
        </div>

        {/* Preview Column - Hidden on mobile if edit tab active */}
        <div className={`preview-column ${activeTab === 'edit' ? 'hide-on-mobile-tab' : ''}`}>
          <InvoicePreview
            invoice={invoice}
            onUpdateThemeColor={handleUpdateThemeColor}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
