// src/components/util/EmptyState.jsx
// Menampilkan pesan kepada pengguna jika tidak ada data yang ditemukan.
import React from 'react';
import { Globe, PlusSquare } from 'lucide-react';
import IconButton from '../ui/IconButton';

/**
 * Komponen yang ditampilkan saat list data kosong.
 * @param {function} navigate Fungsi navigasi dari hook utama.
 * @param {string} message Pesan yang menjelaskan kondisi kosong.
 */
const EmptyState = ({ navigate, message }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-700 rounded-xl shadow-inner border border-gray-600">
    <Globe className="w-16 h-16 text-cyan-400 mb-4" />
    <p className="text-xl font-semibold text-gray-300 mb-2">Katalog Kosong</p>
    <p className="text-gray-400 mb-6">{message}</p>
    
    {/* Tombol untuk langsung menuju halaman tambah planet */}
    <IconButton icon={PlusSquare} onClick={() => navigate('/add')} className="bg-cyan-600 hover:bg-cyan-700">
      Tambah Data Pertama
    </IconButton>
  </div>
);

export default EmptyState;