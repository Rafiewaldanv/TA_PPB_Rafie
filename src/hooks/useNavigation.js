// src/hooks/useNavigation.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mengelola navigasi berbasis hash (#) di URL.
 * Ini berfungsi sebagai router sederhana untuk aplikasi SPA (PWA) Anda.
 */
export const useNavigation = (initialPath = '/') => {
  // Mengambil path awal dari hash URL (misal: #/planets -> /planets)
  const [path, setPath] = useState(window.location.hash.slice(1) || initialPath);

  // Fungsi untuk berpindah halaman
  const navigate = useCallback((newPath) => {
    window.location.hash = newPath;
    setPath(newPath);
    // Gulir ke atas saat berpindah halaman
    window.scrollTo(0, 0);
  }, []);

  // Mendengarkan perubahan hash di URL
  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash.slice(1) || initialPath);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initialPath]);

  // Fungsi untuk mengekstrak parameter dari URL (misal: /planet/:id -> mengambil nilai id)
  const getParams = (routePath) => {
    if (routePath.includes(':')) {
      const routeParts = routePath.split('/');
      const pathParts = path.split('/');
      const params = {};
      routeParts.forEach((part, index) => {
        if (part.startsWith(':')) {
          const key = part.substring(1);
          params[key] = pathParts[index];
        }
      });
      return params;
    }
    return {};
  };

  return { path, navigate, getParams };
};