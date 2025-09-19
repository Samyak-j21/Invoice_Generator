import React from 'react';
import '../diff_styles/Header.css';

export default function Header({ companyInfo, onInputChange }) {
  return (
    <header className="header">
      <div className="contact-info">
        <p>
          <input
            type="tel"
            name="phone"
            value={companyInfo.phone}
            onChange={onInputChange}
            placeholder="Phone Number"
          />
        </p>
        <p>
          <input
            type="email"
            name="email"
            value={companyInfo.email}
            onChange={onInputChange}
            placeholder="Email"
          />
        </p>
      </div>
      <div className="company-section">
        <div className="logo-box">
          {companyInfo.logoUrl ? (
            <img src={companyInfo.logoUrl} alt="Company Logo" />
          ) : (
            <input
              type="text"
              name="logoUrl"
              value={companyInfo.logoUrl}
              onChange={onInputChange}
              placeholder="Logo URL"
            />
          )}
        </div>
        <div className="company-details">
          <input
            type="text"
            name="name"
            className="company-name-input"
            value={companyInfo.name}
            onChange={onInputChange}
          />
          <input
            type="text"
            name="address"
            value={companyInfo.address}
            onChange={onInputChange}
            placeholder="Company Address"
          />
          <input
            type="text"
            name="gstin"
            value={companyInfo.gstin}
            onChange={onInputChange}
            placeholder="GSTIN"
          />
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