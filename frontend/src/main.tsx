import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const style = document.createElement('style');
style.textContent = `*:focus-visible{outline:2px solid #6366f1!important;outline-offset:2px;border-radius:4px}`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
