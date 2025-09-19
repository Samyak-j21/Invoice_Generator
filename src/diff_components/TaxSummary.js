import React from 'react';
import '../diff_styles/TaxSummary.css';

export default function TaxSummary({ items, taxRate, placeOfSupply, manualTax, onTaxChange }) {
  const supplierState = "Karnataka";

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let taxes = parseFloat(manualTax) || 0;

  const isIntraState = placeOfSupply.toLowerCase() === supplierState.toLowerCase();

  if (taxes === 0) {
    if (isIntraState) {
      cgst = subtotal * (taxRate / 2);
      sgst = subtotal * (taxRate / 2);
      taxes = cgst + sgst;
    } else {
      igst = subtotal * taxRate;
      taxes = igst;
    }
  }

  const grandTotal = subtotal + taxes;

  return (
    <div className="tax-summary">
      <div className="totals">
        <div className="total-row">
          <p>Subtotal</p>
          <p>₹{subtotal.toFixed(2)}</p>
        </div>

        <div className="total-row">
          <p>Manual Tax (Override)</p>
          <input type="number" value={manualTax} onChange={onTaxChange} />
        </div>

        {taxes > 0 && manualTax === 0 && (
          <div className="tax-breakdown">
            {isIntraState ? (
              <>
                <div className="total-row tax-row">
                  <p>CGST ({taxRate * 50}%)</p>
                  <p>₹{cgst.toFixed(2)}</p>
                </div>
                <div className="total-row tax-row">
                  <p>SGST ({taxRate * 50}%)</p>
                  <p>₹{sgst.toFixed(2)}</p>
                </div>
              </>
            ) : (
              <div className="total-row tax-row">
                <p>IGST ({taxRate * 100}%)</p>
                <p>₹{igst.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

      </div>
      <div className="balance-due">
        <p>Balance due:</p>
        <p className="grand-total-amount">₹{grandTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}