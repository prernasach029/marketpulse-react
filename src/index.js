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
/* Mobile fixes */
@media (max-width: 768px) {
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr) !important; }
  .grid-cols-5 { grid-template-columns: repeat(2, 1fr) !important; }
  .grid-cols-2 { grid-template-columns: 1fr !important; }
  .col-span-3 { grid-column: span 1 !important; }
  .col-span-2 { grid-column: span 1 !important; }
}