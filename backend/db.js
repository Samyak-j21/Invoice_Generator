const fs = require('fs');
const path = require('path');

// Target database folder inside backend/
const DATA_DIR = path.join(__dirname, 'database');
const INVOICES_FILE = path.join(DATA_DIR, 'invoices.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');

// Helper to ensure database folder and JSON files exist on launch
function initializeDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('Created local database directory!');
    }
    
    if (!fs.existsSync(INVOICES_FILE)) {
      fs.writeFileSync(INVOICES_FILE, JSON.stringify([], null, 2), 'utf8');
      console.log('Initialized empty invoices.json!');
    }
    
    if (!fs.existsSync(PROFILE_FILE)) {
      fs.writeFileSync(PROFILE_FILE, JSON.stringify({}, null, 2), 'utf8');
      console.log('Initialized empty profile.json!');
    }
  } catch (error) {
    console.error('Failed to initialize local database:', error);
  }
}

// 1. Get all Invoices
function getInvoices() {
  try {
    initializeDatabase();
    const data = fs.readFileSync(INVOICES_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading invoices file:', error);
    return [];
  }
}

// 2. Get a single Invoice by ID
function getInvoiceById(id) {
  const invoices = getInvoices();
  return invoices.find(inv => String(inv._id) === String(id)) || null;
}

// 3. Save a new Invoice
function saveInvoice(invoiceData) {
  try {
    initializeDatabase();
    const invoices = getInvoices();
    
    // Assign a unique local string ID
    const newInvoice = {
      _id: `inv_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      ...invoiceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    invoices.push(newInvoice);
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(invoices, null, 2), 'utf8');
    return newInvoice;
  } catch (error) {
    console.error('Error writing invoice:', error);
    throw error;
  }
}

// 4. Update an existing Invoice
function updateInvoice(id, invoiceData) {
  try {
    initializeDatabase();
    const invoices = getInvoices();
    const index = invoices.findIndex(inv => String(inv._id) === String(id));
    
    if (index === -1) return false;
    
    invoices[index] = {
      ...invoices[index],
      ...invoiceData,
      _id: id, // preserve ID
      updatedAt: new Date()
    };
    
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(invoices, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
}

// 5. Delete an Invoice
function deleteInvoice(id) {
  try {
    initializeDatabase();
    const invoices = getInvoices();
    const filtered = invoices.filter(inv => String(inv._id) !== String(id));
    
    if (invoices.length === filtered.length) return false;
    
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

// 6. Get Shop Profile
function getProfile() {
  try {
    initializeDatabase();
    const data = fs.readFileSync(PROFILE_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('Error reading profile file:', error);
    return {};
  }
}

// 7. Save or Update Shop Profile
function saveProfile(profileData) {
  try {
    initializeDatabase();
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profileData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  getInvoices,
  getInvoiceById,
  saveInvoice,
  updateInvoice,
  deleteInvoice,
  getProfile,
  saveProfile
};
