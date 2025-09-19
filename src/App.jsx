import React, { useState, useEffect } from 'react';
import './diff_styles/App.css';

import Header from './diff_components/Header.js';
import PartyDetails from './diff_components/PartyDetails.js';
import InvoiceDetails from './diff_components/InvoiceDetails.js';
import ItemTable from './diff_components/ItemTable.js';
import TaxSummary from './diff_components/TaxSummary.js';
import Buttons from './diff_components/Buttons.js';

function App() {
  const [invoice, setInvoice] = useState({
    companyInfo: {
      name: 'The Cloth Store',
      address: 'Outer Ring Road 15th Cross, 100 Feet Ring Rd, J. P. Nagar, Bengaluru, Karnataka 560078, India',
      gstin: 'xxxx456789'
    },
    invoiceDetails: {
      number: 'INV-2025-001',
      date: '2025-09-18',
      status: 'Pending Payment'
    },
    clientInfo: {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      placeOfSupply: ''
    },
    items: [
      { id: 1, description: '', quantity: 0, unitPrice: 0, hsnSac: '' }
    ],
    manualTax: 0,
    taxRate: 0.18, // 18% GST rate
    paymentInfo: {
      status: 'Pending',
      method: ''
    }
  });

  const [savedInvoices, setSavedInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('https://invoice-generator-5q68.onrender.com/invoices');
        const data = await response.json();
        setSavedInvoices(data);
        console.log('Fetched invoices:', data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  const handleDetailsChange = (e, section) => {
    const { name, value } = e.target;
    setInvoice(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value
      }
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prevState => ({
      ...prevState,
      companyInfo: {
        ...prevState.companyInfo,
        [name]: value
      }
    }));
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prevState => ({
      ...prevState,
      paymentInfo: {
        ...prevState.paymentInfo,
        [name]: value
      }
    }));
  };

  const handleAddItem = () => {
    setInvoice(prevState => ({
      ...prevState,
      items: [...prevState.items, {
        id: prevState.items.length + 1,
        description: '',
        quantity: 0,
        unitPrice: 0,
        hsnSac: ''
      }]
    }));
  };

  const handleUpdateItem = (id, e) => {
    const { name, value } = e.target;
    setInvoice(prevState => ({
      ...prevState,
      items: prevState.items.map(item =>
        item.id === id ? { ...item, [name]: value } : item
      )
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('https://invoice-generator-5q68.onrender.com/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoice),
      });

      if (response.ok) {
        console.log('Invoice saved successfully!');
      } else {
        console.error('Failed to save invoice.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  const handlePrint = () => { window.print(); };
  const handleDownload = () => { console.log('Downloading invoice...'); };

  return (
    <div className="invoice-generator-app">
      <div className="invoice-container">
        <Header companyInfo={invoice.companyInfo} onInputChange={handleCompanyChange} />
        <div className="details-section">
          <PartyDetails
            clientInfo={invoice.clientInfo}
            onInputChange={(e) => handleDetailsChange(e, 'clientInfo')}
          />
          <InvoiceDetails
            onInputChange={(e) => handleDetailsChange(e, 'invoiceDetails')}
            invoiceDetails={invoice.invoiceDetails}
            paymentInfo={invoice.paymentInfo}
            onPaymentInfoChange={handlePaymentInfoChange}
          />
        </div>
        <ItemTable
          items={invoice.items}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
        />
        <TaxSummary
          items={invoice.items}
          taxRate={invoice.taxRate}
          placeOfSupply={invoice.clientInfo.placeOfSupply}
          manualTax={invoice.manualTax}
          onTaxChange={(e) => setInvoice(prevState => ({ ...prevState, manualTax: e.target.value }))}
        />
        <Buttons
          onSave={handleSave}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </div>

      <div className="saved-invoices-list">
        <h2>Saved Invoices</h2>
        {savedInvoices.length === 0 ? (
          <p>No invoices saved yet.</p>
        ) : (
          <ul>
            {savedInvoices.map((savedInvoice, index) => (
              <li key={index}>
                Invoice Number: {savedInvoice.invoiceDetails.number} - Client: {savedInvoice.clientInfo.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;