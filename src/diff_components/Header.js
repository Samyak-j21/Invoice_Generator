import React from 'react';
import '../diff_styles/Header.css';

export default function Header({ companyInfo, onInputChange }) {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      onInputChange({ target: { name: 'logoUrl', value: reader.result } });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="header">
      <div className="top-contact-info">
        <input
          type="tel"
          name="phone"
          value={companyInfo.phone}
          onChange={onInputChange}
          placeholder="Phone Number"
          className="contact-input"
        />
        <input
          type="email"
          name="email"
          value={companyInfo.email}
          onChange={onInputChange}
          placeholder="Email"
          className="contact-input"
        />
      </div>

      <div className="company-section">
        <div className="company-logo-details">
          <div className="logo-box">
            {companyInfo.logoUrl ? (
              <img src={companyInfo.logoUrl} alt="Company Logo" className="company-logo" />
            ) : (
              <div className="logo-placeholder">Your Logo Here</div>
            )}
            <input
              type="file"
              name="logoUrl"
              onChange={handleLogoUpload}
              className="logo-url-input"
            />
          </div>

          <div className="company-info-editable">
            <input
              type="text"
              name="name"
              className="company-name-input"
              value={companyInfo.name}
              onChange={onInputChange}
              placeholder="Company Name"
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
              placeholder="Company GSTIN"
            />
          </div>
        </div>

        <div className="invoice-title-section">
          <p className="invoice-heading">INVOICE</p>
          <p className="invoice-detail-placeholder">Invoice: [number]</p>
          <p className="invoice-detail-placeholder">Date: [date]</p>
        </div>
      </div>
      <hr className="header-divider" />
    </header>
  );
}