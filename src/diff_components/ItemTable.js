import React from 'react';
import '../diff_styles/ItemTable.css';

export default function ItemTable({ items, onAddItem, onUpdateItem }) {
  return (
    <div className="item-table-container">
      <div className="table-header">
        <div className="header-cell">Item Description</div>
        <div className="header-cell">HSN/SAC Code</div>
        <div className="header-cell">QTY</div>
        <div className="header-cell">Unit Price</div>
        <div className="header-cell">Total</div>
      </div>
      <div className="table-body">
        {items.map(item => (
          <div className="table-row" key={item.id}>
            <div className="cell description-cell">
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => onUpdateItem(item.id, e)}
              />
            </div>
            <div className="cell hsn-cell">
              <input
                type="text"
                name="hsnSac"
                value={item.hsnSac}
                onChange={(e) => onUpdateItem(item.id, e)}
              />
            </div>
            <div className="cell qty-cell">
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => onUpdateItem(item.id, e)}
              />
            </div>
            <div className="cell price-cell">
              <input
                type="number"
                name="unitPrice"
                value={item.unitPrice}
                onChange={(e) => onUpdateItem(item.id, e)}
              />
            </div>
            <div className="cell total-cell">₹{(item.quantity * item.unitPrice).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <button onClick={onAddItem} className="add-item-button">Add Item</button>
    </div>
  );
}