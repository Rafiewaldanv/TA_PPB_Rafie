// src/components/nav/BottomNav.jsx
// Bilah navigasi bawah untuk pengalaman mobile.
import React from 'react';
import { Home, Globe, PlusSquare, User, Code } from 'lucide-react';

const BottomNav = ({ currentPath, navigate }) => {
  // Definisi item navigasi untuk mobile
  const navItems = [
    { path: '/', label: 'Beranda', icon: Home, match: (p) => p === '/' },
    { path: '/planets', label: 'Eksplorasi', icon: Globe, match: (p) => p.startsWith('/planet') },
    { path: '/add', label: 'Tambah', icon: PlusSquare, match: (p) => p === '/add' },
    { path: '/profile', label: 'Profil', icon: User, match: (p) => p === '/profile' }, 
    { path: '/about', label: 'Tentang', icon: Code, match: (p) => p === '/about' }, 
  ];

  return (
    // 'sm:hidden' memastikan navigasi ini disembunyikan pada layar yang lebih besar dari mobile
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-2xl z-30">
      <div className="flex justify-around h-16 max-w-xl mx-auto">
        {navItems.map((item) => {
          const isActive = item.match(currentPath);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              // Styling yang responsif terhadap status aktif
              className={`flex flex-col items-center justify-center w-full text-sm font-medium transition duration-300 ${
                isActive ? 'text-cyan-400 border-t-2 border-cyan-400' : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;