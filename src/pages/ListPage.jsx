// src/pages/ListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { api } from '../api/planetApi';
import LoadingScreen from '../components/util/LoadingScreen';
import ErrorScreen from '../components/util/ErrorScreen';
import EmptyState from '../components/util/EmptyState';
import PlanetImage from '../components/ui/PlanetImage';

const ListPage = ({ navigate }) => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlanets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPlanets();
      if (response.status === 200) {
        // Mengurutkan planet berdasarkan nama (A-Z)
        const sortedPlanets = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setPlanets(sortedPlanets);
      } else {
        setError("Gagal memuat data planet.");
      }
    } catch (e) {
      setError("Terjadi kesalahan koneksi.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memuat data saat komponen mount dan mendengarkan event update
  useEffect(() => {
    fetchPlanets();
    window.addEventListener('planetDataUpdated', fetchPlanets);
    return () => window.removeEventListener('planetDataUpdated', fetchPlanets);
  }, [fetchPlanets]);
  
  const handleDelete = async (id, name) => {
    // Menggunakan window.confirm (seperti di kode asli Anda)
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Konfirmasi Penghapusan: Yakin ingin menghapus planet ${name} dari katalog?`)) {
      return;
    }

    try {
      await api.deletePlanet(id);
      fetchPlanets();
      // Memicu event agar halaman lain yang menampilkan jumlah planet juga update
      window.dispatchEvent(new Event('planetDataUpdated')); 
    } catch (e) {
      console.error("Gagal menghapus planet.", e);
    }
  };

  // Logika Filter Pencarian
  const filteredPlanets = planets.filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={fetchPlanets} />;

  return (
    <div className="p-4 text-white min-h-screen-minus-header pb-24">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b border-gray-700 pb-2">Katalog Eksplorasi ({filteredPlanets.length})</h2>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Cari planet berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 pl-10 rounded-xl border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 transition duration-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Menampilkan EmptyState jika tidak ada planet */}
      {filteredPlanets.length === 0 ? (
        <EmptyState navigate={navigate} message={searchTerm ? `Tidak ditemukan planet dengan nama "${searchTerm}".` : "Belum ada planet di katalog ini."} />
      ) : (
        <div className="space-y-4">
          {filteredPlanets.map((planet) => (
            <div
              key={planet.id}
              className="bg-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-between transition duration-300 hover:shadow-cyan-500/30 hover:ring-2 hover:ring-cyan-500 border border-gray-700"
            >
              {/* Bagian yang dapat diklik ke Detail Page */}
              <div className="flex items-center cursor-pointer" onClick={() => navigate(`/planet/${planet.id}`)}>
                <PlanetImage src={planet.image} alt={planet.name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-cyan-400 transition-all duration-500" />
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400">{planet.name}</h3>
                  <p className="text-sm text-gray-400">{planet.distance}</p>
                </div>
              </div>
              
              {/* Tombol Aksi (Edit dan Delete) */}
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/add?id=${planet.id}`)}
                  className="p-2 text-cyan-500 hover:text-white rounded-full hover:bg-cyan-600 transition duration-150"
                  aria-label={`Edit ${planet.name}`}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(planet.id, planet.name)}
                  className="p-2 text-red-500 hover:text-white rounded-full hover:bg-red-600 transition duration-150"
                  aria-label={`Hapus ${planet.name}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListPage;