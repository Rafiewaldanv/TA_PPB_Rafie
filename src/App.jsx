// src/App.jsx
// KOMPONEN ROOT / ORCHESTRATOR
// File ini mengelola setup dasar, routing (pemilihan halaman), dan layout utama (Header & BottomNav).
import React, { useEffect } from 'react';
// Mengimpor Komponen Navigasi
import Header from './components/nav/Header';
import BottomNav from './components/nav/BottomNav';
// Mengimpor Hook Navigasi
import { useNavigation } from './hooks/useNavigation';
// Mengimpor Semua Halaman Aplikasi
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import AddEditPage from './pages/AddEditPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';

// =========================================================================
// KOMPONEN UTAMA APLIKASI (AppRoot)
// =========================================================================

export default function App() {
  const { path, navigate, getParams } = useNavigation();

  // Efek samping untuk menginjeksikan CSS kustom (animasi)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        background-color: #111827; /* bg-gray-900 */
      }
      /* Min-height disesuaikan karena hanya ada 1 bar sticky Header */
      .min-h-screen-minus-header {
        min-height: calc(100vh - 64px - 1rem); 
      }
      @media (max-width: 639px) {
         /* Mobile: (Header Nav 64px) + (Bottom Nav 64px) = 128px */
         .min-h-screen-minus-header {
            min-height: calc(100vh - 128px - 1rem); 
        }
      }
      
      /* CSS KUSTOM UNTUK ANIMASI */
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 15s linear infinite;
      }

      @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
      }
      .animate-icon-bounce {
          animation: icon-bounce 2s ease-in-out infinite;
      }
      
      @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
      }
      .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fungsi penentu halaman yang akan dirender berdasarkan path URL
  const renderPage = () => {
    // 1. Detail Planet (e.g., #/planet/1)
    if (path.startsWith('/planet/')) {
      const params = getParams('/planet/:id');
      return <DetailPage id={params.id} navigate={navigate} />;
    }
    
    // 2. Tambah/Edit Planet (e.g., #/add atau #/add?id=1)
    if (path.startsWith('/add')) {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const id = urlParams.get('id'); // Ambil ID jika ada (mode edit)
        return <AddEditPage navigate={navigate} id={id} />;
    }

    // 3. Halaman Daftar (Katalog)
    if (path === '/planets') {
      return <ListPage navigate={navigate} />;
    }

    // 4. Halaman Profil
    if (path === '/profile') {
        return <ProfilePage navigate={navigate} />;
    }
    
    // 5. Halaman Tentang
    if (path === '/about') {
        return <AboutPage navigate={navigate} />;
    }

    // Default: Home Page
    return <HomePage navigate={navigate} />;
  };

  return (
    <div className="bg-gray-900 min-h-screen"> 
      
      {/* Header Statis di Atas */}
      <Header title="ZR Planet" navigate={navigate} currentPath={path} />
      
      <main className="max-w-xl mx-auto p-2">
        {/* Render halaman yang sesuai */}
        {renderPage()}
      </main>
      
      {/* Bottom Navigasi (Mobile) */}
      <BottomNav currentPath={path} navigate={navigate} />
    </div>
  );
}