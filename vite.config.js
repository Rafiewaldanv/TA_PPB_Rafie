/**
 * Konfigurasi Vite (Build Tool)
 * Mengaktifkan plugin React, Tailwind CSS, dan Progressive Web App (PWA)
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Import plugin PWA (perlu diinstal: npm install -D vite-plugin-pwa)
import { VitePWA } from 'vite-plugin-pwa'; 

export default defineConfig({
  plugins: [
    react(),
    
    // --- KONFIGURASI PWA ---
    VitePWA({
        registerType: 'autoUpdate',
        // Aset yang akan di-cache dan disertakan dalam Workbox
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'solar-logo.png'],
        injectRegister: 'auto', // Memungkinkan pendaftaran Service Worker otomatis

        // Pengaturan Manifest (Metadata aplikasi saat diinstal)
        manifest: {
            name: 'ZR Planet',
            short_name: 'ZR Planet',
            description: 'Aplikasi Informasi Planet dan Tata Surya Interaktif',
            theme_color: '#111827', // Warna tema (bg-gray-900/dark)
            background_color: '#1F2937', // Warna latar belakang saat loading
            display: 'standalone', // Menghilangkan UI browser saat diinstal
            scope: '/',
            start_url: '/',
            orientation: 'portrait',
            icons: [
                { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
                { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
            ]
        },

        // Konfigurasi Workbox (Service Worker)
        workbox: {
            // Pattern untuk aset yang akan di-cache
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
        },
    }),
  ],
});