// src/pages/AddEditPage.jsx
// Halaman untuk menambah (Create) atau mengedit (Update) data planet.
import React, { useState, useEffect } from 'react';
import { PlusSquare, Edit, Upload } from 'lucide-react';
import { api } from '../api/planetApi';
import LoadingScreen from '../components/util/LoadingScreen';
import IconButton from '../components/ui/IconButton';

// --- Sub Komponen untuk Form ---
const InputField = ({ label, name, value, onChange, placeholder, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 text-white"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <select
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 text-white appearance-none pr-10"
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
        <div className="relative pointer-events-none -mt-8 flex justify-end pr-3">
             <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>
    </div>
);

const ChevronDownIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ImageUploadField = ({ isEdit, currentImage, handleImageChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
            {isEdit ? 'Ganti Gambar Planet' : 'Unggah Gambar Planet'} <span className="text-red-400">*</span>
        </label>
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
        />
        {currentImage && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">{isEdit ? 'Gambar Saat Ini:' : 'Pratinjau Gambar:'}</p>
                <img 
                    src={currentImage} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border border-cyan-400" 
                />
            </div>
        )}
        {!isEdit && !currentImage && (
             <div className="mt-4 p-3 bg-red-900/50 rounded-lg text-red-400 text-sm">
                Harap unggah file gambar untuk planet baru.
            </div>
        )}
    </div>
);
// --- Halaman Tambah/Edit ---
const AddEditPage = ({ navigate, id }) => {
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    name: '', size: '', distance: '', fact: '', image: '', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Memuat data planet jika dalam mode Edit
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.getPlanetById(id).then(response => {
        setLoading(false);
        if (response.status === 200) {
          // Mengisi formData dengan data yang sudah ada
          setFormData(prev => ({ ...prev, ...response.data }));
        } else {
          setFormError('Gagal memuat data untuk diedit.');
        }
      });
    } else {
      // Mereset form untuk mode Tambah Baru
      setFormData({ name: '', size: '', distance: '', fact: '', image: '', habitable: 'Tidak Bisa Ditinggali', temperature: 'Dingin' });
      setFormError('');
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mengubah file gambar yang diunggah menjadi format Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setFormError('Harap unggah file gambar.');
        return;
    }
    
    setFormError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      // Menyimpan Base64 ke state 'image'
      setFormData(prev => ({ ...prev, image: reader.result })); 
    };
    reader.onerror = () => {
        setFormError('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validasi Wajib Isi
    if (!formData.name || !formData.size || !formData.distance || !formData.fact) {
      setFormError('Semua kolom wajib diisi!');
      return;
    }
    // Validasi Gambar (wajib untuk Tambah Baru)
    if (!isEdit && !formData.image) {
        setFormError('Gambar wajib diunggah untuk planet baru.');
        return;
    }

    setLoading(true);
    try {
      const result = isEdit 
        ? await api.updatePlanet(id, formData) 
        : await api.addPlanet(formData);

      if (result.status === 201 || result.status === 200) {
        setLoading(false);
        // Memicu event agar halaman List Page (Katalog) me-refresh
        window.dispatchEvent(new Event('planetDataUpdated')); 
        console.log(`Planet berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
        navigate('/planets');
      } else {
        setLoading(false);
        setFormError(result.error || `Gagal ${isEdit ? 'memperbarui' : 'menambah'} planet.`);
      }
    } catch (error) {
      setLoading(false);
      setFormError('Terjadi kesalahan jaringan/sistem.');
    }
  };

  if (loading && isEdit) return <LoadingScreen />;

  return (
    <div className="p-6 text-white min-h-screen-minus-header pb-24">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 border-b border-gray-700 pb-2">{isEdit ? 'Ubah Detail Planet' : 'Tambahkan Planet Baru'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
        {formError && <p className="text-red-400 font-medium bg-red-900/50 p-3 rounded-lg border border-red-700">{formError}</p>}
        
        <InputField label="Nama Planet" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Gliese 581g" required />
        <InputField label="Ukuran (Diameter)" name="size" value={formData.size} onChange={handleChange} placeholder="Contoh: 12,742 km" required />
        <InputField label="Jarak dari Matahari" name="distance" value={formData.distance} onChange={handleChange} placeholder="Contoh: 150 juta km" required />
        
        {/* Select Fields Baru */}
        <SelectField 
            label="Kelayakan Huni" 
            name="habitable" 
            value={formData.habitable} 
            onChange={handleChange}
            options={['Bisa Ditinggali', 'Tidak Bisa Ditinggali']}
            required
        />
        <SelectField 
            label="Suhu Permukaan" 
            name="temperature" 
            value={formData.temperature} 
            onChange={handleChange}
            options={['Dingin', 'Sedang', 'Panas']}
            required
        />

        {/* Input Gambar (Unggah File) */}
        <ImageUploadField isEdit={isEdit} currentImage={formData.image} handleImageChange={handleImageChange} />
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Fakta Kosmik Unik</label>
          <textarea
            name="fact"
            rows="4"
            value={formData.fact}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 text-white"
            placeholder="Jelaskan fakta unik planet ini..."
            required
          ></textarea>
        </div>

        {/* Tombol Submit */}
        <IconButton 
          icon={isEdit ? Edit : PlusSquare} 
          type="submit"
          // Ganti warna tombol berdasarkan mode (Edit=Blue, Add=Green)
          className={`w-full justify-center ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          disabled={loading}
        >
          {loading ? 'Mengirim Data...' : (isEdit ? 'Simpan Perubahan Data' : 'Tambahkan Planet ke Katalog')}
        </IconButton>
        <button type="button" onClick={() => navigate('/planets')} className="w-full text-center mt-3 text-gray-400 hover:text-cyan-400 font-medium transition duration-200">
            Batal
        </button>
      </form>
    </div>
  );
};

export default AddEditPage;