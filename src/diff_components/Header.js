import React from 'react';
import '../diff_styles/Header.css';

export default function Header({ companyInfo, onInputChange }) {
  return (
    <header className="header">
      <div className="contact-info">
        <p>&#9990; [000-000-0000]</p>
        <p>&#9990; [000-000-0000]</p>
        <p>&#9993; [companyemail@gmail.com]</p>
      </div>
      <div className="company-section">
        <div className="logo-box">Your Logo Here</div>
        <div className="company-details">
          <input
            type="text"
            name="name"
            className="company-name-input"
            value={companyInfo.name}
            onChange={(e) => onInputChange(e)}
          />
          <p>{companyInfo.address}</p>
          <p>GSTIN: {companyInfo.gstin}</p>
        </div>
        <div className="invoice-title">
          <p className="invoice-heading">INVOICE</p>
          <p className="invoice-number">Invoice: [number]</p>
          <p className="invoice-date">Date: [date]</p>
        </div>
      </div>
    </header>
  );
}