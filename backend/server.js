const express = require('express');
const cors = require('cors');
const {
  initializeDatabase,
  getInvoices,
  getInvoiceById,
  saveInvoice,
  updateInvoice,
  deleteInvoice,
  getProfile,
  saveProfile
} = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and parsing of JSON bodies
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support larger base64 logo uploads

// Initialize local database on start
initializeDatabase();

// 1. Get all Invoices
app.get('/api/invoices', (req, res) => {
  try {
    const invoicesList = getInvoices();
    // Sort descending by date
    invoicesList.sort((a, b) => {
      const dateA = new Date(a.invoiceDetails?.date || 0);
      const dateB = new Date(b.invoiceDetails?.date || 0);
      return dateB - dateA;
    });
    res.status(200).json(invoicesList);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices.' });
  }
});

// 2. Get a single Invoice by ID
app.get('/api/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const invoice = getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice.' });
  }
});

// 3. Save a new Invoice
app.post('/api/invoices', (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = saveInvoice(invoiceData);
    res.status(201).json({ 
      message: 'Invoice saved successfully!', 
      invoiceId: newInvoice._id 
    });
  } catch (error) {
    console.error('Error saving invoice:', error);
    res.status(500).json({ error: 'Failed to save invoice.' });
  }
});

// 4. Update an existing Invoice
app.put('/api/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const invoiceData = req.body;
    
    const updated = updateInvoice(id, invoiceData);
    if (!updated) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    
    res.status(200).json({ message: 'Invoice updated successfully!' });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice.' });
  }
});

// 5. Delete an Invoice
app.delete('/api/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteInvoice(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    
    res.status(200).json({ message: 'Invoice deleted successfully!' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice.' });
  }
});

// 6. Get Supplier Shop Profile
app.get('/api/profile', (req, res) => {
  try {
    const profile = getProfile();
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// 7. Save or Update Supplier Shop Profile
app.post('/api/profile', (req, res) => {
  try {
    const profileData = req.body;
    saveProfile(profileData);
    res.status(200).json({ message: 'Shop Profile saved successfully!' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile.' });
  }
});

// 8. Email Invoice Details (optional feature)
app.post('/api/send-email', async (req, res) => {
  try {
    const { toEmail, invoiceHtml, invoiceNumber } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: 'test-account@ethereal.email', 
        pass: 'test-password'
      }
    });

    const mailOptions = {
      from: '"Premium Invoice Generator" <invoices@example.com>',
      to: toEmail,
      subject: `Tax Invoice #${invoiceNumber || 'N/A'}`,
      html: invoiceHtml || '<h3>Please find your invoice details attached.</h3>'
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent via email (Simulated via Ethereal SMTP)!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on local file system database and listening on port ${PORT}`);
});
