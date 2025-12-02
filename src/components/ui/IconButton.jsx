// src/components/ui/IconButton.jsx
// Komponen tombol universal yang menerima ikon, teks, dan styling.
import React from 'react';

/**
 * Komponen Tombol dengan Ikon.
 * Didesain untuk konsistensi interaksi di seluruh aplikasi.
 */
const IconButton = ({ 
    icon: Icon, 
    onClick, 
    children, 
    className = 'bg-cyan-600 hover:bg-cyan-700', 
    type = 'button', 
    disabled = false 
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    // Styling menggunakan Tailwind: shadow, rounded-xl, transisi, dan disabled state
    className={`flex items-center justify-center p-3 text-white rounded-xl transition duration-300 shadow-lg font-bold ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {/* Ikon dari lucide-react */}
    <Icon className="w-5 h-5 mr-2" />
    {/* Teks Tombol */}
    {children}
  </button>
);

export default IconButton;