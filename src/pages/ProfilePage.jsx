// src/pages/ProfilePage.jsx
// Halaman Profil - Menggunakan Tailwind CSS untuk styling.
import React, { useState, useEffect, useCallback } from 'react';
import { User, Globe, Code, Upload, Edit, Star, Sun, Moon, Cpu, PlusSquare } from 'lucide-react';
import { api, loadProfileFromStorage, saveProfileToStorage } from '../api/planetApi'; 
import LoadingScreen from '../components/util/LoadingScreen';

// --- SUB KOMPONEN (Menggunakan Tailwind Classes) ---
const CheckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-5 h-5" />);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5" />);

// Baris informasi statis
const InfoRow = ({ icon: Icon, title, value, color }) => (
    <div className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
        <Icon className={`w-4 h-4 mr-3 ${color}`} /> 
        <span className="font-medium text-gray-300 text-sm w-1/3">{title}:</span>
        <span className={`flex-1 ${color} font-semibold text-sm truncate`}>{value}</span>
    </div>
);

// Kartu statistik kecil
const ProfileStatCard = ({ label, value, icon: Icon, color, isCustom }) => (
    <div className="p-4 bg-gray-700 rounded-xl shadow-lg transition duration-300 hover:scale-[1.05] border-l-4" style={{ borderColor: color.replace('text-', '') }}>
        <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
        <p className="text-xl font-bold text-gray-100">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
);

// --- HALAMAN UTAMA ---
const ProfilePage = ({ navigate }) => {
  const [profile, setProfile] = useState(loadProfileFromStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  
  const [planetCount, setPlanetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setProfile(loadProfileFromStorage());
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
    fetchData();
    window.addEventListener('planetDataUpdated', fetchData);
    return () => window.removeEventListener('planetDataUpdated', fetchData);
  }, [fetchData]);
  
  // --- LOGIKA EDIT PROFIL KUSTOM (LOKAL) ---
  const handleEditSave = () => {
    if (isEditing) {
        saveProfileToStorage(tempProfile);
        setProfile(tempProfile);
        window.dispatchEvent(new Event('planetDataUpdated'));
    }
    setIsEditing(!isEditing);
  };
  
  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Harap unggah file gambar.'); 
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempProfile(prev => ({ ...prev, avatar: reader.result })); 
    };
    reader.onerror = () => {
        alert('Gagal membaca file gambar avatar.');
    };
    reader.readAsDataURL(file);
  };
  
  // Hitung statistik Kustom Dinamis
  const customPlanetCount = Math.max(0, planetCount - 8);
  
  const stats = [
    { label: "Planet Dikatalogkan", value: planetCount, icon: Globe, color: "text-cyan-400", isCustom: true },
    { label: "Data Kustom", value: customPlanetCount, icon: PlusSquare, color: "text-green-400", isCustom: true }, 
    { label: "Level Eksplorasi", value: planetCount >= 8 ? 5 : planetCount > 0 ? 3 : 1, icon: Star, color: "text-yellow-400" }, 
    { label: "Mode Aplikasi", value: "Offline Ready", icon: Code, color: "text-blue-400" },
  ];
  
  if (loading || !profile) return <LoadingScreen />;

  const { name, role, quote, avatar, joiningDate, lastMissionDate, status, missionCode } = profile;

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen pb-24 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-cyan-400 mb-8 border-b border-gray-700 pb-2 text-center">
        <User className="inline w-7 h-7 mr-2" /> Profil Pengamat
      </h2>

      {/* Detail Profil Utama (Data Kustom) */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-cyan-700/50 text-center relative">
        
        {/* Tombol Edit/Simpan/Batal */}
        <button
            onClick={handleEditSave}
            className={`absolute top-4 right-4 p-2 rounded-full transition duration-300 shadow-md ${
                isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
            aria-label={isEditing ? 'Simpan Profil' : 'Edit Profil'}
        >
            {isEditing ? <CheckIcon /> : <Edit className="w-5 h-5" />}
        </button>
        {isEditing && (
            <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-16 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition duration-300 shadow-md"
                aria-label="Batalkan Edit"
            >
                <XIcon />
            </button>
        )}
        
        {/* Avatar dan Nama */}
        <div className="flex flex-col items-center mb-6">
            <div className="relative group">
                <img 
                    src={tempProfile.avatar} 
                    alt="Avatar Profil" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400 shadow-xl mb-3 transition duration-500 hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/4B5563/F3F4F6?text=U" }}
                />
                {/* Area Unggah Avatar saat Edit Mode */}
                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
                        <Upload className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                )}
            </div>
            
            {/* Nama dan Role (Input saat Edit Mode) */}
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="name"
                        value={tempProfile.name}
                        onChange={handleTempChange}
                        className="text-2xl font-bold text-center text-gray-100 bg-gray-700 rounded-md p-1 focus:ring-cyan-500 focus:border-cyan-500 w-full max-w-xs"
                        placeholder="Nama Pengguna"
                    />
                    <input
                        type="text"
                        name="role"
                        value={tempProfile.role}
                        onChange={handleTempChange}
                        className="text-md font-medium text-cyan-300 italic text-center bg-gray-700 rounded-md p-1 mt-1 focus:ring-cyan-500 focus:border-cyan-500 w-full max-w-xs"
                        placeholder="Peran"
                    />
                </>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-gray-100">{name}</h3>
                    <p className="text-md font-medium text-cyan-300 italic">{role}</p>
                </>
            )}
        </div>

        {/* Quote (TextArea saat Edit Mode) */}
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-6">
            {isEditing ? (
                <textarea
                    name="quote"
                    rows="2"
                    value={tempProfile.quote}
                    onChange={handleTempChange}
                    className="text-sm italic text-gray-300 bg-gray-600 rounded-md p-1 focus:ring-cyan-500 focus:border-cyan-500 w-full resize-none"
                    placeholder="Kutipan/Slogan"
                />
            ) : (
                <p className="text-sm italic text-gray-300">"{quote}"</p>
            )}
        </div>
        
        {/* Informasi Penting Statis */}
        <div className="space-y-3 mb-8 text-left">
            <InfoRow icon={Star} title="Status Misi" value={status} color="text-green-400" />
            <InfoRow icon={Sun} title="Bergabung Sejak" value={joiningDate} color="text-gray-400" />
            <InfoRow icon={Moon} title="Misi Terakhir" value={lastMissionDate} color="text-yellow-400" /> 
            <InfoRow icon={Cpu} title="Kode Misi Pengamat" value={missionCode} color="text-red-400" /> 
        </div>
        
        {/* Statistik Eksplorasi (Dinams) */}
        <h4 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Statistik Eksplorasi</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <ProfileStatCard key={index} {...stat} color={stat.color} />
            ))}
        </div>

      </div>
      
      {/* Footer Navigasi */}
      <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-cyan-400 font-medium transition duration-200">
              &larr; Kembali ke Beranda
          </button>
      </div>
    </div>
  );
};

export default ProfilePage;