// src/api/planetApi.js
// Integrasi Penuh dengan Supabase DITAMBAH Data Fallback/Mock jika terjadi kegagalan jaringan atau RLS.

// --- SEMUA IMPORT HARUS DITEMPATKAN PALING ATAS ---
import { supabase } from '../config/supabase'; 

// --- KEY UNTUK LOCAL STORAGE ---
const PROFILE_KEY = 'zrPlanetProfile';
const PLANET_KEY = 'zrPlanets';

// --- DATA FALLBACK (DIAMBIL DARI KODE ASLI ANDA) ---
const initialPlanetsFallback = [
    { id: '1', name: 'Merkurius', size: '4,880 km', distance: '58 juta km', fact: 'Planet terkecil dan terdekat dengan Matahari, permukaannya dipenuhi kawah.', image: 'https://placehold.co/150x150/4B5563/F3F4F6?text=MERK', habitable: 'Tidak Bisa Ditinggali', temperature: 'Panas' },
    { id: '2', name: 'Venus', size: '12,104 km', distance: '108 juta km', fact: 'Planet terpanas karena efek rumah kaca ekstrem.', image: 'https://placehold.co/150x150/B45309/F3F4F6?text=VENUS', habitable: 'Tidak Bisa Ditinggali', temperature: 'Panas' },
    { id: '3', name: 'Bumi', size: '12,742 km', distance: '150 juta km', fact: 'Satu-satunya planet yang diketahui mendukung kehidupan, memiliki satu satelit alami.', image: 'https://placehold.co/150x150/10B981/1F2937?text=BUMI', habitable: 'Bisa Ditinggali', temperature: 'Sedang' },
    { id: '4', name: 'Mars', size: '6,779 km', distance: '228 juta km', fact: 'Dikenal sebagai Planet Merah, memiliki gunung tertinggi di Tata Surya, Olympus Mons.', image: 'https://placehold.co/150x150/DC2626/F3F4F6?text=MARS', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin' },
    { id: '5', name: 'Jupiter', size: '142,984 km', distance: '778 juta km', fact: 'Planet terbesar, dua kali lebih besar dari gabungan semua planet lain. Memiliki Badai Merah Besar.', image: 'https://placehold.co/150x150/FBBF24/1F2937?text=JUP', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin' },
    { id: '6', name: 'Saturnus', size: '120,536 km', distance: '1,4 miliar km', fact: 'Paling terkenal dengan sistem cincin esnya yang indah dan kompleks.', image: 'https://placehold.co/150x150/06B6D4/1F2937?text=SAT', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin' },
    { id: '7', name: 'Uranus', size: '51,118 km', distance: '2,9 miliar km', fact: 'Planet es raksasa yang berputar miring, hampir 90 derajat dari orbitnya.', image: 'https://placehold.co/150x150/3B82F6/1F2937?text=URAN', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin' },
    { id: '8', name: 'Neptunus', size: '49,528 km', distance: '4,5 miliar km', fact: 'Planet terjauh, tempat bertiupnya angin tercepat di Tata Surya.', image: 'https://placehold.co/150x150/1D4ED8/F3F4F6?text=NEP', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin' },
];

// --- FUNGSI LOCALSTORAGE (Planet) ---
export const loadPlanetsFromStorage = () => {
    const data = localStorage.getItem(PLANET_KEY);

    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Data planets rusak, menggunakan fallback.");
            localStorage.setItem(PLANET_KEY, JSON.stringify(initialPlanetsFallback));
            return initialPlanetsFallback;
        }
    }

    // Jika pertama kali
    localStorage.setItem(PLANET_KEY, JSON.stringify(initialPlanetsFallback));
    return initialPlanetsFallback;
};

export const savePlanetsToStorage = (planets) => {
    localStorage.setItem(PLANET_KEY, JSON.stringify(planets));
};

// --- FUNGSI LOKAL (PROFIL) ---
const initialProfile = {
    name: "Pengamat Kosmik 42",
    role: "Navigator Data",
    joiningDate: "05/04/2025",
    lastMissionDate: "28/11/2025", 
    status: "Aktif dalam Misi Eksplorasi",
    quote: "Batas langit hanyalah permulaan data yang harus kita kelola.",
    avatar: "https://placehold.co/100x100/34D399/1F2937?text=NAV",
    missionCode: "ZR-OMNI-2025-ALPHA", 
};

export const loadProfileFromStorage = () => {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            return { ...initialProfile, ...parsed };
        } catch (e) {
            return initialProfile;
        }
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(initialProfile));
    return initialProfile;
};

export const saveProfileToStorage = (profile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// --- API Planet (Supabase + Fallback) ---
export const api = {
  getPlanets: async () => {
    try {
      const { data, error } = await supabase
        .from('planets')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase Error (getPlanets):', error);
        return { 
          status: 500,
          error: `Gagal memuat dari Supabase: ${error.message}. Menampilkan fallback.`,
          data: initialPlanetsFallback 
        };
      }

      return { status: 200, data: data || [] }; 
    } catch (networkError) {
        return { 
            status: 500, 
            error: 'Kesalahan jaringan total. Menampilkan fallback.',
            data: initialPlanetsFallback 
        };
    }
  },

  getPlanetById: async (id) => {
    try {
        const { data, error } = await supabase
          .from('planets')
          .select('*')
          .eq('id', id)
          .single(); 
    
        if (error && error.code === 'PGRST116') {
          return { status: 404, error: 'Planet tidak ditemukan.' };
        }
        if (error) {
          return { status: 500, error: 'Gagal memuat detail planet.' };
        }
        return { status: 200, data };

    } catch {
        return { status: 500, error: 'Kesalahan jaringan.' };
    }
  },
  
  addPlanet: async (newPlanet) => {
    const { data, error } = await supabase
      .from('planets')
      .insert([newPlanet])
      .select()
      .single(); 

    if (error) {
      return { status: 500, error: 'Gagal menambahkan planet.' };
    }
    return { status: 201, data }; 
  },

  updatePlanet: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('planets')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { status: 500, error: 'Gagal memperbarui planet.' };
    }
    return { status: 200, data };
  },
  
  deletePlanet: async (id) => {
    const { error } = await supabase
      .from('planets')
      .delete()
      .eq('id', id);

    if (error) {
      return { status: 500, error: 'Gagal menghapus planet.' };
    }

    return { status: 204 };
  },
};
