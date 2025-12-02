// src/components/util/LoadingScreen.jsx
// Menampilkan indikator visual saat aplikasi sedang memuat data.
import React from 'react';

const LoadingScreen = () => (
  // Kelas 'h-screen-minus-header' dan 'animate-spin-slow' diinjeksi 
  // melalui CSS dinamis di App.jsx untuk konsistensi di semua tampilan
  <div className="flex flex-col items-center justify-center p-12 h-screen-minus-header text-cyan-400">
    {/* Animasi loading berbentuk cincin */}
    <div className="animate-spin-slow rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div> 
    <p className="mt-6 text-xl font-medium">Sedang menstabilkan orbit data...</p>
  </div>
);

export default LoadingScreen;