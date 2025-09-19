import React from 'react';
import '../diff_styles/Buttons.css';

export default function Buttons({ onPrint }) {
  return (
    <div className="buttons-container">
      <button onClick={onPrint} className="button print-button">
        Print
      </button>
    </div>
  );
}