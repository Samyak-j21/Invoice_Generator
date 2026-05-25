import React from 'react';
import { FileText, CheckCircle, Clock, IndianRupee, Plus, Settings } from 'lucide-react';

export default function Dashboard({ invoices, onCreateNew, onOpenProfile }) {
  // Compute analytics
  const invoiceCount = invoices.length;
  
  const calculateTotal = (inv) => {
    const subtotal = inv.items.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);
    let tax = 0;
    if (inv.manualTaxToggle && inv.manualTax !== undefined) {
      tax = parseFloat(inv.manualTax) || 0;
    } else {
      const taxRate = parseFloat(inv.taxRate || 0.18);
      const isIntraState = String(inv.companyInfo?.state || '').toLowerCase() === String(inv.clientInfo?.placeOfSupply || '').toLowerCase();
      tax = subtotal * taxRate;
    }
    return subtotal + tax;
  };

  const totalRevenue = invoices.reduce((acc, inv) => acc + calculateTotal(inv), 0);
  
  const paidRevenue = invoices
    .filter(inv => inv.paymentInfo?.status === 'Paid')
    .reduce((acc, inv) => acc + calculateTotal(inv), 0);
    
  const pendingRevenue = invoices
    .filter(inv => inv.paymentInfo?.status === 'Pending' || inv.paymentInfo?.status === 'Pending Payment')
    .reduce((acc, inv) => acc + calculateTotal(inv), 0);

  const paidPercentage = totalRevenue > 0 ? Math.round((paidRevenue / totalRevenue) * 100) : 0;

  return (
    <div className="fade-in">
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your professional invoice analytics dashboard.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onOpenProfile}>
            <Settings size={18} />
            Shop Settings
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <Plus size={18} />
            New Invoice
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-primary)' }}>
            <FileText size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Invoices</span>
            <span className="stat-value">{invoiceCount}</span>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon-wrapper">
            <IndianRupee size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card paid">
          <div className="stat-icon-wrapper">
            <CheckCircle size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Collected Amount</span>
            <span className="stat-value">₹{paidRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon-wrapper">
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Amount</span>
            <span className="stat-value">₹{pendingRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="panel-card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Collection Progress Ratio</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Paid ({paidPercentage}%)</span>
          <span style={{ color: 'var(--text-secondary)' }}>Uncollected ({100 - paidPercentage}%)</span>
        </div>
        <div style={{ height: '12px', background: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${paidPercentage}%`, background: 'var(--color-success)', height: '100%', transition: 'width 0.5s ease' }}></div>
          <div style={{ width: `${100 - paidPercentage}%`, background: 'var(--color-warning)', height: '100%', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>
    </div>
  );
}
