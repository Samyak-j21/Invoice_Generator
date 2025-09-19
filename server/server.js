const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// IMPORTANT: Replace with your actual MongoDB connection string
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.log('Database connection error:', err));

const invoiceSchema = new mongoose.Schema({
  companyInfo: Object,
  invoiceDetails: Object,
  clientInfo: Object,
  items: Array,
  manualTax: Number,
  taxRate: Number,
  paymentInfo: Object
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Helper functions defined here
const calculateGrandTotal = (invoice) => {
  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxes = invoice.manualTax || (subtotal * invoice.taxRate);
  return subtotal + taxes;
};

const generateInvoiceHtml = (invoice) => {
  return `
        <h1>Tax Invoice #${invoice.invoiceDetails.number}</h1>
        <p>Billed to: ${invoice.clientInfo.name}</p>
        <p>Total: ₹${calculateGrandTotal(invoice).toFixed(2)}</p>
        <p>Status: ${invoice.invoiceDetails.status}</p>
    `;
};


// Route to get all invoices from the database
app.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).send('Error fetching invoices.');
  }
});

app.post('/save', (req, res) => {
  const invoiceData = req.body;
  const newInvoice = new Invoice(invoiceData);

  newInvoice.save()
    .then(() => {
      console.log('Invoice saved successfully!');
      res.status(200).send('Invoice saved successfully!');
    })
    .catch(err => {
      console.error('Error saving invoice:', err);
      res.status(500).send('Error saving invoice.');
    });
});

// Route to download the invoice as a PDF
app.get('/download-pdf/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).send('Invoice not found.');
    }

    const html = generateInvoiceHtml(invoice);

    pdf.create(html).toStream((err, stream) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).send('Error generating PDF.');
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice.invoiceDetails.number}.pdf`);
      stream.pipe(res);
    });
  } catch (error) {
    console.error('Error in PDF generation:', error);
    res.status(500).send('Error generating PDF.');
  }
});

// Route to send an invoice via email
app.post('/send-email', async (req, res) => {
  try {
    const { toEmail, invoiceData } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: toEmail,
      subject: `Invoice from ${invoiceData.companyInfo.name}`,
      html: generateInvoiceHtml(invoiceData)
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});