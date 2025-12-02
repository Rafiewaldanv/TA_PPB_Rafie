// src/components/nav/Header.jsx
// Header aplikasi yang berfungsi sebagai navigasi utama (desktop) dan judul.
import React from 'react';
import { Home, Globe, User, Code, Aperture } from 'lucide-react';

const Header = ({ title, navigate, currentPath }) => {
    // Definisi item navigasi
    const navItems = [
        { path: '/', label: 'Beranda', icon: Home, match: (p) => p === '/' },
        { path: '/planets', label: 'Eksplorasi', icon: Globe, match: (p) => p.startsWith('/planet') },
        { path: '/profile', label: 'Profil', icon: User, match: (p) => p === '/profile' }, 
        { path: '/about', label: 'Tentang', icon: Code, match: (p) => p === '/about' }, 
    ];

    const topPositionClass = 'top-0'; 

    return (
        <header className={`bg-gray-800 text-white shadow-xl sticky ${topPositionClass} z-10 border-b-2 border-cyan-500/50`}>
            <div className="max-w-xl mx-auto flex justify-between items-center p-4">
                {/* Judul Aplikasi (Logo) */}
                <h1 
                    className="text-2xl font-extrabold text-cyan-400 select-none cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <Aperture className="inline w-6 h-6 mr-2" />
                    {title}
                </h1>
                
                {/* Navigasi Desktop (Disembunyikan di Mobile) */}
                <nav className="hidden sm:flex space-x-2">
                    {navItems.map((item) => {
                        const isActive = item.match(currentPath);
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center text-sm font-medium transition duration-300 px-3 py-2 rounded-lg ${
                                    isActive 
                                        ? 'bg-cyan-600 text-white shadow-md' 
                                        : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-700'
                                }`}
                            >
                                <item.icon className="w-4 h-4 mr-1" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Header;