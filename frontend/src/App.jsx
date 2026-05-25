import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, PlusCircle, Settings, X, Check, Save } from 'lucide-react';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import InvoicePreview from './components/InvoicePreview';

const API_BASE = import.meta.env.PROD ? 'https://invoice-generator-5q68.onrender.com' : '';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoices, setInvoices] = useState([]);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  
  // Profile settings state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    gstin: '',
    phone: '',
    email: '',
    state: 'Karnataka',
    logoUrl: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/invoices`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Load default profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/profile`);
      if (res.ok) {
        const data = await res.json();
        if (data.name) {
          setProfileData(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchProfile();
  }, []);

  // Delete invoice
  const handleDeleteInvoice = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/invoices/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchInvoices();
      } else {
        alert('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        setProfileSavedSuccess(true);
        setTimeout(() => {
          setProfileSavedSuccess(false);
          setShowProfileModal(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setProfileSaving(false);
    }
  };

  // Navigation handlers
  const handleEditTrigger = (id) => {
    setEditingInvoiceId(id);
    setActiveTab('create');
  };

  const handleCreateTrigger = () => {
    setEditingInvoiceId(null);
    setActiveTab('create');
  };

  const handleSaveSuccess = () => {
    fetchInvoices();
    setActiveTab('invoices');
    setEditingInvoiceId(null);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🧾</span>
          <h2>Invoicely</h2>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <Receipt size={20} />
            Invoices Log
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'create' && !editingInvoiceId ? 'active' : ''}`}
            onClick={handleCreateTrigger}
          >
            <PlusCircle size={20} />
            Create Invoice
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            className={`nav-item ${showProfileModal ? 'active' : ''}`}
            onClick={() => setShowProfileModal(true)}
          >
            <Settings size={20} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            invoices={invoices} 
            onCreateNew={handleCreateTrigger} 
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceList 
            invoices={invoices} 
            onEdit={handleEditTrigger}
            onPreview={(inv) => setPreviewInvoice(inv)}
            onDelete={handleDeleteInvoice}
            onCreateNew={handleCreateTrigger}
          />
        )}

        {activeTab === 'create' && (
          <InvoiceForm 
            invoiceId={editingInvoiceId} 
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => {
              setActiveTab('invoices');
              setEditingInvoiceId(null);
            }}
            onPreview={(inv) => setPreviewInvoice(inv)}
          />
        )}
      </main>

      {/* 1. Modal for Previewing PDF Invoice */}
      {previewInvoice && (
        <InvoicePreview 
          invoice={previewInvoice} 
          onClose={() => setPreviewInvoice(null)} 
        />
      )}

      {/* 2. Modal for editing Shop settings default profile */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <button className="modal-close-btn" onClick={() => setShowProfileModal(false)}>
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--color-primary)' }}>
              Shop Profile Settings
            </h2>
            
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Shop / Company Name:</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })} 
                  placeholder="e.g. Cloth Emporium"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input 
                  type="text" 
                  value={profileData.phone} 
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })} 
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div className="form-group">
                <label>Email Address:</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })} 
                  placeholder="e.g. contact@clothstore.com"
                />
              </div>

              <div className="form-group">
                <label>GSTIN:</label>
                <input 
                  type="text" 
                  value={profileData.gstin} 
                  onChange={e => setProfileData({ ...profileData, gstin: e.target.value })} 
                  placeholder="e.g. 29AAAAA0000A1Z5"
                />
              </div>

              <div className="form-group">
                <label>Default Shop State (Supply Origin):</label>
                <select 
                  value={profileData.state} 
                  onChange={e => setProfileData({ ...profileData, state: e.target.value })}
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address:</label>
                <textarea 
                  rows="3" 
                  value={profileData.address} 
                  onChange={e => setProfileData({ ...profileData, address: e.target.value })} 
                  placeholder="Street Address, City, Postal Code"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--card-border)', color: '#fff', padding: '10px', borderRadius: '4px' }}
                />
              </div>

              <div className="action-row" style={{ marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                  {profileSaving ? 'Saving...' : profileSavedSuccess ? (
                    <>
                      <Check size={16} />
                      Saved Successfully!
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
