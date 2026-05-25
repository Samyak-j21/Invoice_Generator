import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, Mail, FileText, Sparkles } from 'lucide-react';

export default function InvoiceList({ invoices, onEdit, onPreview, onDelete, onCreateNew }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Calculates Grand Total for listing
  const getGrandTotal = (inv) => {
    const subtotal = inv.items.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);
    let tax = 0;
    if (inv.manualTaxToggle && inv.manualTax !== undefined) {
      tax = parseFloat(inv.manualTax) || 0;
    } else {
      const taxRate = parseFloat(inv.taxRate || 0.18);
      tax = subtotal * taxRate;
    }
    return subtotal + tax;
  };

  // Filter & Search Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      String(inv.invoiceDetails?.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(inv.clientInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'All' || 
      inv.paymentInfo?.status === statusFilter ||
      (statusFilter === 'Pending' && inv.paymentInfo?.status === 'Pending Payment');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="panel-card fade-in">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Saved Invoices Log</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Showing {filteredInvoices.length} of {invoices.length} invoices.
          </p>
        </div>
      </div>

      {/* Filters Search row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by client or invoice number..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '44px' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} style={{ color: 'var(--text-muted)' }} />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Pending Only</option>
          </select>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '50%', color: 'var(--text-muted)' }}>
            <FileText size={48} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Invoices Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
              We couldn't find any invoices matching your search. Create a new one or modify your filters!
            </p>
          </div>
          <button className="btn btn-primary" onClick={onCreateNew} style={{ display: 'flex', gap: '8px' }}>
            <Sparkles size={16} />
            Create First Invoice
          </button>
        </div>
      ) : (
        <div className="invoice-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Client Name</th>
                <th>Place of Supply</th>
                <th style={{ textAlign: 'right' }}>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const total = getGrandTotal(inv);
                const isPaid = inv.paymentInfo?.status === 'Paid';
                return (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      #{inv.invoiceDetails?.number}
                    </td>
                    <td>{inv.invoiceDetails?.date}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{inv.clientInfo?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.clientInfo?.email || 'No Email'}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                        {inv.clientInfo?.placeOfSupply || 'N/A'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge ${isPaid ? 'paid' : 'pending'}`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '8px' }}
                          title="Preview & Download PDF"
                          onClick={() => onPreview(inv)}
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '8px' }}
                          title="Edit Invoice"
                          onClick={() => onEdit(inv._id)}
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '8px' }}
                          title="Delete Invoice"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete invoice #${inv.invoiceDetails?.number}?`)) {
                              onDelete(inv._id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
