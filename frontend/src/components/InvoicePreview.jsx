import React from 'react';
import { Download, Printer, X, Mail } from 'lucide-react';

export default function InvoicePreview({ invoice, onClose }) {
  if (!invoice) return null;

  const { companyInfo = {}, clientInfo = {}, invoiceDetails = {}, paymentInfo = {}, items = [], manualTaxToggle = false, manualTax = 0, taxRate = 0.18 } = invoice;

  const subtotal = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  const isIntraState = String(companyInfo.state || '').toLowerCase() === String(clientInfo.placeOfSupply || '').toLowerCase();
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let taxAmount = 0;

  if (manualTaxToggle) {
    taxAmount = parseFloat(manualTax) || 0;
  } else {
    taxAmount = subtotal * taxRate;
    if (isIntraState) {
      cgst = taxAmount / 2;
      sgst = taxAmount / 2;
    } else {
      igst = taxAmount;
    }
  }

  const grandTotal = subtotal + taxAmount;
  const isPaid = paymentInfo.status === 'Paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
        
        {/* Control Action buttons in Modal header */}
        <div className="action-row" style={{ marginTop: 0, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #cbd5e1' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            Print / Save to PDF
          </button>
          
          <button className="btn btn-primary" onClick={onClose} style={{ background: '#1e293b', borderColor: '#1e293b' }}>
            <X size={16} />
            Close Preview
          </button>
        </div>

        {/* This represents the print target layout */}
        <div className="invoice-preview-sheet print-target">
          
          {/* Header block with Logo and Company Info */}
          <div className="invoice-header-block">
            <div>
              {companyInfo.logoUrl ? (
                <img src={companyInfo.logoUrl} alt="Logo" className="invoice-logo-container" />
              ) : (
                <div style={{ fontWeight: 800, fontSize: '1.6rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
                  {companyInfo.name || 'YOUR SHOP NAME'}
                </div>
              )}
              
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>{companyInfo.address || 'Address not configured'}</span>
                <span><strong>Phone:</strong> {companyInfo.phone || 'N/A'} | <strong>Email:</strong> {companyInfo.email || 'N/A'}</span>
                {companyInfo.gstin && <span><strong>GSTIN:</strong> {companyInfo.gstin}</span>}
                <span><strong>State:</strong> {companyInfo.state || 'N/A'}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="invoice-preview-title">TAX INVOICE</div>
              <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#475569' }}>
                <div><strong>Invoice No:</strong> #{invoiceDetails.number}</div>
                <div><strong>Date:</strong> {invoiceDetails.date}</div>
                <div><strong>Status:</strong> {paymentInfo.status}</div>
                <div><strong>Payment Via:</strong> {paymentInfo.method || 'N/A'}</div>
              </div>

              {/* Status Watermark */}
              <div className={`preview-badge-watermark ${isPaid ? 'paid' : 'pending'}`} style={{ display: 'inline-block', float: 'right' }}>
                {isPaid ? 'PAID' : 'PENDING'}
              </div>
            </div>
          </div>

          {/* Client Details Grid */}
          <div className="invoice-meta-grid">
            <div className="meta-col">
              <h4>Billed To (Client)</h4>
              <div className="meta-details">
                <strong>{clientInfo.name || 'Customer/Client Name'}</strong>
                <span>{clientInfo.address || 'Client Address'}</span>
                {clientInfo.phone && <span><strong>Phone:</strong> {clientInfo.phone}</span>}
                {clientInfo.email && <span><strong>Email:</strong> {clientInfo.email}</span>}
                {clientInfo.gstin && <span><strong>GSTIN:</strong> {clientInfo.gstin}</span>}
                <span><strong>Place of Supply:</strong> {clientInfo.placeOfSupply}</span>
              </div>
            </div>
            
            <div className="meta-col" style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '40px' }}>
              <h4>Summary Details</h4>
              <div className="meta-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#64748b' }}>Tax Type:</span>
                  <span>{isIntraState ? 'Intra-State GST (CGST + SGST)' : 'Inter-State GST (IGST)'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#64748b' }}>Item Count:</span>
                  <span>{items.length} items</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line items Table */}
          <table className="preview-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Description</th>
                <th style={{ width: '15%', textTransform: 'uppercase' }}>HSN/SAC</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ fontWeight: 500, color: '#1e293b' }}>{item.description || 'N/A'}</td>
                  <td style={{ color: '#64748b' }}>{item.hsnSac || '—'}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Summary Block */}
          <div className="preview-totals-block">
            <div className="preview-totals-inner">
              <div className="preview-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {!manualTaxToggle ? (
                <>
                  {isIntraState ? (
                    <>
                      <div className="preview-row tax-detail">
                        <span>CGST ({(taxRate * 50).toFixed(1)}%):</span>
                        <span>₹{cgst.toFixed(2)}</span>
                      </div>
                      <div className="preview-row tax-detail">
                        <span>SGST ({(taxRate * 50).toFixed(1)}%):</span>
                        <span>₹{sgst.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="preview-row tax-detail">
                      <span>IGST ({(taxRate * 100).toFixed(0)}%):</span>
                      <span>₹{igst.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="preview-row" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <span>Total GST:</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="preview-row" style={{ color: '#b45309', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span>Manual Tax Override:</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="preview-row grand">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '60px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
            Thank you for your business! This is an electronically generated tax invoice.
          </div>
        </div>

      </div>
    </div>
  );
}
