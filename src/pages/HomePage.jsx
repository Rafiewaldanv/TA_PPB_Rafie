// src/pages/HomePage.jsx
// Halaman Utama - Menggunakan Tailwind CSS untuk styling dan Data Dinamis dari API.
import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Zap, PlusSquare } from 'lucide-react';
// Mengimpor API dan fungsi lokal yang diperlukan
import { api, loadProfileFromStorage } from '../api/planetApi';

// --- Komponen Kartu Statistik Cepat ---
const HomeCard = ({ title, value, unit, icon: Icon, color, onClick }) => (
  <div 
    // Menggunakan styling yang lebih rinci dan shadow yang dalam untuk tema angkasa
    className={`p-6 rounded-xl shadow-2xl flex flex-col justify-between h-40 transition duration-300 transform hover:scale-[1.02] cursor-pointer ${color}`}
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
      <h4 className="text-sm font-semibold uppercase text-white opacity-90">{title}</h4>
      <Icon className="w-5 h-5 text-white opacity-70" />
    </div>
    <div>
      <p className="text-4xl font-bold text-white">{value}</p>
      <p className="text-xs text-white opacity-80">{unit}</p>
    </div>
  </div>
);

// --- Komponen Action Button ---
const ActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }) => {
  const baseStyles = "w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-3 transition duration-300 hover:opacity-90";
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600",
    secondary: "bg-green-500 hover:bg-green-600"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

// --- Halaman Utama (Dynamic) ---
const HomePage = ({ navigate }) => {
    // State untuk data dinamis
    const [planetCount, setPlanetCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(loadProfileFromStorage());

    // Fungsi untuk mengambil data planet dan profil
    const fetchData = useCallback(async () => {
        setLoading(true);
        // 1. Ambil data profil (lokal)
        setProfile(loadProfileFromStorage()); 

        // 2. Ambil data planet (asinkron dari Supabase/API)
        try {
            const response = await api.getPlanets();
            const total = response.data ? response.data.length : 0;
            setPlanetCount(total);
        } catch (e) {
            setPlanetCount(0); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Ambil data saat komponen dimuat
        fetchData();
        
        // Listener untuk memuat ulang data saat terjadi perubahan (Add/Edit/Delete)
        window.addEventListener('planetDataUpdated', fetchData);
        return () => window.removeEventListener('planetDataUpdated', fetchData);
    }, [fetchData]);
    
    // Tampilkan loading screen saat data sedang diambil
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen-minus-header bg-gray-900">
            <div className="animate-spin-slow w-10 h-10 border-t-4 border-cyan-500 rounded-full"></div>
            <p className="ml-4 text-cyan-400">Memuat data kosmik...</p>
        </div>
    );
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header (Asumsi sudah di-render oleh App.jsx) */}

      {/* Main Content */}
      {/* Mengubah max-w-4xl dan mx-auto agar elemen di tengah dan ada batas samping */}
      <div className="max-w-4xl mx-auto px-6 py-12"> 
        {/* Greeting Card */}
        <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-sm p-8 rounded-xl shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-cyan-400 mb-3">Halo, {profile.name}!</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Selamat datang di <span className="text-cyan-400 font-semibold">ZR Planet</span>, portal data interaktif Tata Surya. Temukan fakta unik dan detail planet-planet.
          </p>
        </div>

        {/* Stats Cards */}
        {/* Menggunakan gap dan grid untuk layout responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <HomeCard 
            title="Planet Di Katalog" 
            value={planetCount} // Menggunakan data dinamis
            unit="Benda Langit" 
            icon={Globe} 
            onClick={() => navigate?.('/planets')}
            color="bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl"
          />
          <HomeCard 
            title="Kecepatan Orbit Bumi" 
            value="108.000" 
            unit="km/jam" 
            icon={Zap} 
            color="bg-gradient-to-br from-orange-600 to-orange-700 shadow-2xl"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6 pb-4 border-b border-gray-600">Aksi Cepat</h3>
          <div className="space-y-4">
            <ActionButton 
              icon={Globe}
              label="Lihat Semua Data Planet"
              onClick={() => navigate?.('/planets')}
              variant="primary"
            />
            <ActionButton 
              icon={PlusSquare}
              label="Tambah Data Planet Baru"
              onClick={() => navigate?.('/add')}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;