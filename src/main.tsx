/**
 * ENTRY POINT
 * Punto di ingresso dell'applicazione React con routing
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SecondoTest from './SecondoTest';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/secondo-test" element={<SecondoTest />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

