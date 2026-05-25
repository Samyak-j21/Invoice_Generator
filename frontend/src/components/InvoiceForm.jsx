import React, { useState, useEffect } from 'react';
import { Plus, Trash, Save, X, Eye, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.PROD ? 'https://invoice-generator-5q68.onrender.com' : '';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

export default function InvoiceForm({ invoiceId, onSaveSuccess, onCancel, onPreview }) {
  const [loading, setLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    state: 'Karnataka',
    logoUrl: ''
  });

  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    placeOfSupply: 'Karnataka'
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
  });

  const [paymentInfo, setPaymentInfo] = useState({
    status: 'Pending',
    method: 'UPI'
  });

  const [items, setItems] = useState([
    { id: 1, description: '', hsnSac: '', quantity: 1, unitPrice: 0 }
  ]);

  const [manualTaxToggle, setManualTaxToggle] = useState(false);
  const [manualTax, setManualTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0.18); // default 18% GST

  // Fetch shop profile and editing invoice data if ID is provided
  useEffect(() => {
    const bootstrapData = async () => {
      setLoading(true);
      try {
        // Load default shop profile first
        const profileRes = await fetch(`${API_BASE}/api/profile`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.name) {
            setCompanyInfo(profileData);
          }
        }

        // If editing an existing invoice, load its details
        if (invoiceId) {
          const invRes = await fetch(`${API_BASE}/api/invoices/${invoiceId}`);
          if (invRes.ok) {
            const inv = await invRes.json();
            setCompanyInfo(inv.companyInfo || {});
            setClientInfo(inv.clientInfo || {});
            setInvoiceDetails(inv.invoiceDetails || {});
            setPaymentInfo(inv.paymentInfo || {});
            setItems(inv.items || []);
            setManualTaxToggle(inv.manualTaxToggle || false);
            setManualTax(inv.manualTax || 0);
            setTaxRate(inv.taxRate || 0.18);
          }
        }
      } catch (error) {
        console.error('Error loading bootstrap data:', error);
      } finally {
        setLoading(false);
      }
    };
    bootstrapData();
  }, [invoiceId]);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save Default
  const handleSaveDefaultProfile = async () => {
    setProfileSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyInfo)
      });
      if (res.ok) {
        setProfileSavedMsg(true);
        setTimeout(() => setProfileSavedMsg(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setProfileSaving(false);
    }
  };

  // Line item manipulation
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', hsnSac: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let parsed = value;
        if (field === 'quantity') parsed = parseInt(value) || 0;
        if (field === 'unitPrice') parsed = parseFloat(value) || 0;
        return { ...item, [field]: parsed };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  const isIntraState = companyInfo.state.toLowerCase() === clientInfo.placeOfSupply.toLowerCase();
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let calculatedTax = 0;

  if (manualTaxToggle) {
    calculatedTax = parseFloat(manualTax) || 0;
  } else {
    calculatedTax = subtotal * taxRate;
    if (isIntraState) {
      cgst = calculatedTax / 2;
      sgst = calculatedTax / 2;
    } else {
      igst = calculatedTax;
    }
  }

  const grandTotal = subtotal + calculatedTax;

  // Save full Invoice
  const handleSaveInvoice = async () => {
    if (!clientInfo.name) {
      alert("Please enter a Client Name.");
      return;
    }
    
    setLoading(true);
    const invoicePayload = {
      companyInfo,
      clientInfo,
      invoiceDetails,
      paymentInfo,
      items,
      manualTaxToggle,
      manualTax: manualTaxToggle ? parseFloat(manualTax) : 0,
      taxRate,
      totals: {
        subtotal,
        calculatedTax,
        grandTotal,
        cgst,
        sgst,
        igst,
        isIntraState
      }
    };

    try {
      const url = invoiceId ? `${API_BASE}/api/invoices/${invoiceId}` : `${API_BASE}/api/invoices`;
      const method = invoiceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });

      if (res.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onSaveSuccess();
      } else {
        alert("Failed to save invoice.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !invoiceId) {
    return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>Loading configurations...</div>;
  }

  return (
    <div className="fade-in">
      <div className="panel-header">
        <h2 className="panel-title">{invoiceId ? 'Edit Invoice' : 'Create New Invoice'}</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={18} />
            Cancel
          </button>
          <button className="btn btn-secondary" onClick={() => onPreview({ companyInfo, clientInfo, invoiceDetails, paymentInfo, items, manualTaxToggle, manualTax, taxRate })}>
            <Eye size={18} />
            Preview Draft
          </button>
          <button className="btn btn-primary" onClick={handleSaveInvoice}>
            <Save size={18} />
            {invoiceId ? 'Update Invoice' : 'Save Invoice'}
          </button>
        </div>
      </div>

      <div className="form-grid">
        {/* Company Settings (Supplier) */}
        <div className="form-section">
          <div className="form-section-title">
            <FileText size={18} />
            1. Your Shop/Company Profile
          </div>
          
          <div className="form-group">
            <label>Logo (Optional):</label>
            <div className="logo-upload-zone" onClick={() => document.getElementById('logo-file-input').click()}>
              {companyInfo.logoUrl ? (
                <img src={companyInfo.logoUrl} alt="Logo" className="logo-preview-img" />
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to upload shop logo</span>
              )}
              <input 
                type="file" 
                id="logo-file-input" 
                onChange={handleLogoUpload} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Shop / Company Name:</label>
            <input 
              type="text" 
              value={companyInfo.name} 
              onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })} 
              placeholder="e.g. Acme Retailers"
            />
          </div>

          <div className="form-grid" style={{ gap: '12px', marginBottom: 0 }}>
            <div className="form-group">
              <label>Phone Number:</label>
              <input 
                type="text" 
                value={companyInfo.phone} 
                onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })} 
                placeholder="Phone Number"
              />
            </div>
            <div className="form-group">
              <label>Email Address:</label>
              <input 
                type="email" 
                value={companyInfo.email} 
                onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })} 
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Billing Address:</label>
            <textarea 
              rows="2"
              value={companyInfo.address} 
              onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })} 
              placeholder="Street Address, City, Postal Code"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--card-border)', color: '#fff', padding: '10px', borderRadius: '4px' }}
            />
          </div>

          <div className="form-grid" style={{ gap: '12px', marginBottom: 0 }}>
            <div className="form-group">
              <label>Supplier GSTIN:</label>
              <input 
                type="text" 
                value={companyInfo.gstin} 
                onChange={e => setCompanyInfo({ ...companyInfo, gstin: e.target.value })} 
                placeholder="e.g. 29AAAAA0000A1Z5"
              />
            </div>
            <div className="form-group">
              <label>Supplier State:</label>
              <select 
                value={companyInfo.state} 
                onChange={e => setCompanyInfo({ ...companyInfo, state: e.target.value })}
              >
                {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '16px', display: 'flex', gap: '8px', fontSize: '0.85rem' }}
            onClick={handleSaveDefaultProfile}
            disabled={profileSaving}
          >
            {profileSaving ? 'Saving...' : profileSavedMsg ? (
              <>
                <Check size={16} color="var(--color-success)" />
                Default Profile Saved!
              </>
            ) : (
              'Save as Default Shop Profile'
            )}
          </button>
        </div>

        {/* Client & Metadata settings */}
        <div className="form-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="form-section-title">
              <Plus size={18} />
              2. Client & Invoice Metadata
            </div>

            <div className="form-group">
              <label>Client / Customer Name:</label>
              <input 
                type="text" 
                value={clientInfo.name} 
                onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })} 
                placeholder="e.g. John Doe, or Retail Store Corp"
              />
            </div>

            <div className="form-grid" style={{ gap: '12px', marginBottom: 0 }}>
              <div className="form-group">
                <label>Client Phone:</label>
                <input 
                  type="text" 
                  value={clientInfo.phone} 
                  onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })} 
                  placeholder="Client Phone"
                />
              </div>
              <div className="form-group">
                <label>Client Email:</label>
                <input 
                  type="email" 
                  value={clientInfo.email} 
                  onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })} 
                  placeholder="Client Email"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Client Billing Address:</label>
              <input 
                type="text" 
                value={clientInfo.address} 
                onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })} 
                placeholder="Client Address"
              />
            </div>

            <div className="form-grid" style={{ gap: '12px', marginBottom: 0 }}>
              <div className="form-group">
                <label>Client GSTIN (Optional):</label>
                <input 
                  type="text" 
                  value={clientInfo.gstin} 
                  onChange={e => setClientInfo({ ...clientInfo, gstin: e.target.value })} 
                  placeholder="GSTIN"
                />
              </div>
              <div className="form-group">
                <label>Place of Supply (State):</label>
                <select 
                  value={clientInfo.placeOfSupply} 
                  onChange={e => setClientInfo({ ...clientInfo, placeOfSupply: e.target.value })}
                >
                  {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <div className="form-grid" style={{ gap: '12px', marginBottom: 0 }}>
              <div className="form-group">
                <label>Invoice Number:</label>
                <input 
                  type="text" 
                  value={invoiceDetails.number} 
                  onChange={e => setInvoiceDetails({ ...invoiceDetails, number: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Invoice Date:</label>
                <input 
                  type="date" 
                  value={invoiceDetails.date} 
                  onChange={e => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-grid" style={{ gap: '12px', marginBottom: 0 }}>
              <div className="form-group">
                <label>Payment Status:</label>
                <select 
                  value={paymentInfo.status} 
                  onChange={e => setPaymentInfo({ ...paymentInfo, status: e.target.value })}
                >
                  <option value="Pending">Pending Payment</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Method:</label>
                <select 
                  value={paymentInfo.method} 
                  onChange={e => setPaymentInfo({ ...paymentInfo, method: e.target.value })}
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic items editor */}
      <div className="panel-card" style={{ marginBottom: '30px' }}>
        <h3 className="form-section-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>3. Line Items</h3>
        
        <table className="items-editor-table">
          <thead>
            <tr>
              <th style={{ width: '45%', textAlign: 'left' }}>Item Description</th>
              <th style={{ width: '15%' }}>HSN/SAC</th>
              <th style={{ width: '10%' }}>QTY</th>
              <th style={{ width: '15%' }}>Unit Price (₹)</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Total (₹)</th>
              <th style={{ width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input 
                    type="text" 
                    value={item.description} 
                    onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                    placeholder="e.g. Cotton Blue Jeans"
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={item.hsnSac} 
                    onChange={e => handleUpdateItem(item.id, 'hsnSac', e.target.value)}
                    placeholder="e.g. 5208"
                    style={{ textAlign: 'center' }}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                    style={{ textAlign: 'center' }}
                    min="1"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={item.unitPrice} 
                    onChange={e => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                    style={{ textAlign: 'right' }}
                    min="0"
                  />
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, paddingRight: '12px' }}>
                  ₹{((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                </td>
                <td>
                  <button 
                    type="button" 
                    className="delete-row-btn"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={items.length <= 1}
                    style={{ opacity: items.length <= 1 ? 0.3 : 1 }}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" className="btn btn-secondary" onClick={handleAddItem} style={{ display: 'flex', gap: '8px' }}>
          <Plus size={16} />
          Add Line Item
        </button>

        <div className="calc-panel">
          <div className="calc-notes">
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label>GST Rate Preset:</label>
              <select value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value))} disabled={manualTaxToggle}>
                <option value={0}>0% Tax Free</option>
                <option value={0.05}>5% GST</option>
                <option value={0.12}>12% GST</option>
                <option value={0.18}>18% GST (Standard)</option>
                <option value={0.28}>28% GST</option>
              </select>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={manualTaxToggle} 
                  onChange={e => setManualTaxToggle(e.target.checked)} 
                />
                <span className="toggle-slider"></span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Enable Manual Tax Override
                </span>
              </label>
            </div>

            {manualTaxToggle && (
              <div className="form-group fade-in" style={{ maxWidth: '300px', marginTop: '10px' }}>
                <label>Manual Tax Amount (₹):</label>
                <input 
                  type="number" 
                  value={manualTax} 
                  onChange={e => setManualTax(parseFloat(e.target.value) || 0)} 
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="calc-totals">
            <div className="calc-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {!manualTaxToggle ? (
              <>
                {isIntraState ? (
                  <>
                    <div className="calc-row tax-detail">
                      <span>CGST ({(taxRate * 50).toFixed(1)}%):</span>
                      <span>₹{cgst.toFixed(2)}</span>
                    </div>
                    <div className="calc-row tax-detail">
                      <span>SGST ({(taxRate * 50).toFixed(1)}%):</span>
                      <span>₹{sgst.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="calc-row tax-detail">
                    <span>IGST ({(taxRate * 100).toFixed(0)}%):</span>
                    <span>₹{igst.toFixed(2)}</span>
                  </div>
                )}
                <div className="calc-row" style={{ color: 'var(--text-secondary)' }}>
                  <span>Total GST Calculated:</span>
                  <span>₹{calculatedTax.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="calc-row" style={{ color: 'var(--color-warning)' }}>
                <span>Manual Tax Override:</span>
                <span>₹{calculatedTax.toFixed(2)}</span>
              </div>
            )}

            <div className="calc-row grand-total">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
