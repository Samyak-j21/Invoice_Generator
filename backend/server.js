const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { connectToDatabase, getDb } = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and parsing of JSON bodies
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Larger limit to support base64 logo uploads

// 1. Get all Invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const db = getDb();
    const invoices = await db.collection('invoices')
      .find({})
      .sort({ "invoiceDetails.date": -1, _id: -1 })
      .toArray();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices.' });
  }
});

// 2. Get a single Invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Invoice ID format' });
    }
    const db = getDb();
    const invoice = await db.collection('invoices').findOne({ _id: new ObjectId(id) });
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
app.post('/api/invoices', async (req, res) => {
  try {
    const invoiceData = req.body;
    const db = getDb();
    
    // Add timestamp metadata
    invoiceData.createdAt = new Date();
    invoiceData.updatedAt = new Date();
    
    const result = await db.collection('invoices').insertOne(invoiceData);
    res.status(201).json({ 
      message: 'Invoice saved successfully!', 
      invoiceId: result.insertedId 
    });
  } catch (error) {
    console.error('Error saving invoice:', error);
    res.status(500).json({ error: 'Failed to save invoice.' });
  }
});

// 4. Update an existing Invoice
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Invoice ID format' });
    }
    const invoiceData = req.body;
    const db = getDb();
    
    // Remove _id from body if it exists to avoid MongoDB modification error
    delete invoiceData._id;
    invoiceData.updatedAt = new Date();
    
    const result = await db.collection('invoices').updateOne(
      { _id: new ObjectId(id) },
      { $set: invoiceData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    
    res.status(200).json({ message: 'Invoice updated successfully!' });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice.' });
  }
});

// 5. Delete an Invoice
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Invoice ID format' });
    }
    const db = getDb();
    const result = await db.collection('invoices').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    
    res.status(200).json({ message: 'Invoice deleted successfully!' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice.' });
  }
});

// 6. Get Supplier Shop Profile (convenience feature so they don't type it every time)
app.get('/api/profile', async (req, res) => {
  try {
    const db = getDb();
    const profile = await db.collection('profile').findOne({});
    res.status(200).json(profile || {});
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// 7. Save or Update Supplier Shop Profile
app.post('/api/profile', async (req, res) => {
  try {
    const profileData = req.body;
    const db = getDb();
    delete profileData._id; // prevent _id issues
    
    const result = await db.collection('profile').updateOne(
      {},
      { $set: profileData },
      { upsert: true }
    );
    
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

    // Use a placeholder/default test transporter. In real life, users would set up SMTP credentials
    // We'll use nodemailer to send beautiful HTML invoices.
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'test-account@ethereal.email', 
        pass: 'test-password'
      }
    });

    const mailOptions = {
      from: '"Premium Invoice Generator" <invoices@example.com>',
      to: toEmail,
      subject: `Tax Invoice #${invoiceNumber || 'N/A'}`,
      html: invoiceHtml || '<h3>Please find your invoice details attached/displayed in the portal.</h3>'
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent via email (Simulated via Ethereal SMTP)!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Start DB then server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running and listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database before starting server:', err);
    process.exit(1);
  });
