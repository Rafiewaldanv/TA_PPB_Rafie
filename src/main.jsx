// src/main.jsx
// Titik masuk utama untuk merender aplikasi React

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Mengimpor komponen App (Root/Orchestrator)
import './index.css'; // Mengimpor styling global (Tailwind)

const container = document.getElementById('root');

// Pastikan elemen root ditemukan
if (container) {
  const root = createRoot(container);

  // Merender komponen utama aplikasi
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemen root dengan ID 'root' tidak ditemukan di dokumen HTML.");
}