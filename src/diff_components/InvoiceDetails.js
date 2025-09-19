import React from 'react';
import '../diff_styles/InvoiceDetails.css';

export default function InvoiceDetails({ invoiceDetails, paymentInfo, onInputChange, onPaymentInfoChange }) {
  return (
    <div className="invoice-details">
      <div className="form-group">
        <label>Status:</label>
        <select
          name="status"
          value={paymentInfo.status}
          onChange={onPaymentInfoChange}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>
      <div className="form-group">
        <label>Payment Method:</label>
        <select
          name="method"
          value={paymentInfo.method}
          onChange={onPaymentInfoChange}
        >
          <option value="">Select</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>
      <div className="form-group">
        <label>Invoice Number:</label>
        <input
          type="text"
          name="number"
          value={invoiceDetails.number}
          onChange={(e) => onInputChange(e, 'invoiceDetails')}
        />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={invoiceDetails.date}
          onChange={(e) => onInputChange(e, 'invoiceDetails')}
        />
      </div>
    </div>
  );
}