import React from 'react';
import '../diff_styles/Buttons.css';

export default function Buttons({ onSave, onPrint, onDownload }) {
  return (
    <div className="buttons-container">
      <button onClick={onSave} className="button save-button">
        Save
      </button>
      <button onClick={onPrint} className="button print-button">
        Print
      </button>
      <button onClick={onDownload} className="button download-button">
        Download PDF
      </button>
    </div>
  );
}