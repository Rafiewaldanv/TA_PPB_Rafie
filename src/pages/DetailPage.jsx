// src/pages/DetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Moon, Sun, CloudOff, Zap, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../api/planetApi';
import LoadingScreen from '../components/util/LoadingScreen';
import ErrorScreen from '../components/util/ErrorScreen';
import IconButton from '../components/ui/IconButton';
import PlanetImage from '../components/ui/PlanetImage';

// --- Sub Komponen untuk Detail Page ---
// Menampilkan baris data detail
const DetailItem = ({ title, value, icon: Icon, iconColor }) => (
  <div className="flex justify-between border-b border-gray-700 py-2 items-center">
    <span className="font-medium text-gray-300 flex items-center">
      {Icon && <Icon className={`w-4 h-4 mr-2 ${iconColor}`} />}
      {title}
    </span>
    <span className="text-cyan-400 font-semibold">{value}</span>
  </div>
);

// --- Halaman Detail ---
const DetailPage = ({ id, navigate }) => {
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil detail planet berdasarkan ID
  const fetchPlanet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPlanetById(id);
      if (response.status === 200) {
        setPlanet(response.data);
      } else {
        setError(response.error);
      }
    } catch (e) {
      setError("Terjadi kesalahan koneksi saat memuat detail.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlanet();
    window.addEventListener('planetDataUpdated', fetchPlanet);
    return () => window.removeEventListener('planetDataUpdated', fetchPlanet);
  }, [fetchPlanet]);

  if (loading) return <LoadingScreen />;
  if (error || !planet) return <ErrorScreen message={error || "Data planet tidak valid."} onRetry={() => navigate('/planets')} />;

  const handleEdit = () => {
    navigate(`/add?id=${id}`);
  };
  
  // Menentukan ikon kelayakan huni
  const getHabitableIcon = (habitable) => {
    if (habitable === 'Bisa Ditinggali') {
      return { icon: CheckCircle, color: 'text-green-400' };
    }
    return { icon: XCircle, color: 'text-red-400' };
  };
  
  // Menentukan ikon suhu
  const getTemperatureIcon = (temperature) => {
    switch (temperature) {
      case 'Panas': return { icon: Sun, color: 'text-red-500' };
      case 'Sedang': return { icon: CloudOff, color: 'text-yellow-400' };
      case 'Dingin': return { icon: Moon, color: 'text-blue-400' };
      default: return { icon: Zap, color: 'text-gray-400' };
    }
  };

  const habitableStatus = getHabitableIcon(planet.habitable);
  const tempStatus = getTemperatureIcon(planet.temperature);

  return (
    <div className="p-6 text-white min-h-screen-minus-header pb-24">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-cyan-700/50">
        <h2 className="text-4xl font-extrabold text-cyan-400 mb-6 border-b border-gray-700 pb-2">{planet.name}</h2>
        
        {/* Gambar Planet */}
        <div className="flex justify-center mb-8">
          <PlanetImage 
            src={planet.image} 
            alt={planet.name} 
            className="w-56 h-56 object-cover rounded-full border-4 border-cyan-500 shadow-xl transition duration-500 animate-spin-slow"
          />
        </div>

        {/* Detail Data */}
        <div className="space-y-4">
          <DetailItem title="Ukuran (Diameter)" value={planet.size} />
          <DetailItem title="Jarak Rata-Rata Matahari" value={planet.distance} />
          
          {/* Field Baru */}
          <DetailItem 
            title="Kelayakan Huni" 
            value={planet.habitable} 
            icon={habitableStatus.icon} 
            iconColor={habitableStatus.color} 
          />
          <DetailItem 
            title="Suhu Permukaan" 
            value={planet.temperature} 
            icon={tempStatus.icon} 
            iconColor={tempStatus.color} 
          />

          {/* Fakta Unik */}
          <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h4 className="font-semibold text-gray-300 flex items-center">
                <Moon className="w-4 h-4 mr-2 text-yellow-300" />
                Fakta Kosmik Unik
            </h4>
            <p className="text-gray-400 mt-2 italic">{planet.fact}</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 space-y-3">
          <IconButton icon={Edit} onClick={handleEdit} className="w-full justify-center bg-blue-600 hover:bg-blue-700">
            Ubah Data Planet
          </IconButton>
          <button onClick={() => navigate('/planets')} className="w-full text-center text-gray-400 hover:text-cyan-400 font-medium transition duration-200">
            &larr; Kembali ke Katalog
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;