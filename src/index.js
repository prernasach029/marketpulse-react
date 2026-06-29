import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
/* Mobile responsive overrides */
@media (max-width: 767px) {
  /* Hide sidebar by default on mobile - handled by JS */
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .grid-cols-5 {
    grid-template-columns: 1fr 1fr !important;
  }
  .col-span-3, .col-span-2 {
    grid-column: span 1 !important;
  }
  /* Stack split layouts */
  .split {
    grid-template-columns: 1fr !important;
  }
  /* Make tables scrollable */
  table {
    display: block;
    overflow-x: auto;
  }
  /* Reduce padding on mobile */
  .p-6 {
    padding: 1rem !important;
  }
  /* Fix ticker bar text size */
  .tick {
    padding: 0 10px !important;
  }
}