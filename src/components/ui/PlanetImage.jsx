// src/components/ui/PlanetImage.jsx
import React from 'react';

/**
 * Komponen untuk menampilkan gambar planet dengan fallback.
 * Memastikan aplikasi tetap stabil meskipun URL gambar tidak valid atau gagal dimuat.
 */
const PlanetImage = ({ src, alt, className }) => {
    // Gambar placeholder jika gambar utama gagal dimuat
    const fallbackImage = 'https://placehold.co/200x200/4B5563/F3F4F6?text=ZR+PLANET'; 
    
    return (
        <img 
            src={src || fallbackImage} 
            alt={alt} 
            className={className} 
            // Handler error: Jika gambar gagal dimuat, ganti sumber dengan placeholder
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = fallbackImage;
            }}
        />
    );
};

export default PlanetImage;