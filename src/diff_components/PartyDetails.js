import React from 'react';
import '../diff_styles/PartyDetails.css';

export default function PartyDetails({ clientInfo, onInputChange }) {
  return (
    <div className="party-details">
      <p className="section-title">Invoice ship to</p>
      <div className="form-group">
        <label>Client Name:</label>
        <input
          type="text"
          name="name"
          value={clientInfo.name}
          onChange={(e) => onInputChange(e, 'clientInfo')}
        />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={clientInfo.address}
          onChange={(e) => onInputChange(e, 'clientInfo')}
        />
      </div>
      <div className="form-group">
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={clientInfo.city}
          onChange={(e) => onInputChange(e, 'clientInfo')}
        />
      </div>
      <div className="form-group">
        <label>Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={clientInfo.postalCode}
          onChange={(e) => onInputChange(e, 'clientInfo')}
        />
      </div>
      <div className="form-group">
        <label>Place of Supply:</label>
        <input
          type="text"
          name="placeOfSupply"
          value={clientInfo.placeOfSupply}
          onChange={(e) => onInputChange(e, 'clientInfo')}
        />
      </div>
    </div>
  );
}