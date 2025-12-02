// src/components/util/ErrorScreen.jsx
// Menampilkan pesan kesalahan ketika terjadi kegagalan pemuatan data.
import React from 'react';
import { Zap } from 'lucide-react';
import IconButton from '../ui/IconButton';

/**
 * Komponen yang menampilkan pesan error dan tombol untuk mencoba lagi.
 * @param {string} message Pesan kesalahan yang akan ditampilkan.
 * @param {function} onRetry Fungsi yang akan dipanggil saat tombol Coba Lagi diklik.
 */
const ErrorScreen = ({ message, onRetry }) => (
  // Kelas 'h-screen-minus-header' memastikan komponen ini mengambil 
  // sisa tinggi layar, berada di tengah.
  <div className="flex flex-col items-center justify-center p-12 h-screen-minus-header text-red-400 text-center">
    <p className="text-2xl font-bold mb-4">Kesalahan Kosmik!</p>
    <p className="text-gray-400 mb-6">{message}</p>
    
    {/* Tombol Coba Muat Ulang */}
    <IconButton icon={Zap} onClick={onRetry} className="bg-red-600 hover:bg-red-700">
      Coba Muat Ulang
    </IconButton>
  </div>
);

export default ErrorScreen;