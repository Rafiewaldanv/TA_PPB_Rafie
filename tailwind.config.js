/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        // --- PALET WARNA TEMA ANGKASA ---
        colors: {
          'dark-bg': '#111827', // Latar belakang utama (gray-900)
          'card-bg': '#1F2937', // Latar belakang kartu (gray-800)
          'primary-light': '#06B6D4', // Cyan/biru muda (Warna utama/aksen)
          'primary-dark': '#0891b2', // Cyan-700
          'accent-green': '#10B981', // Green-500 (untuk tombol Tambah)
          'accent-blue': '#3B82F6', // Blue-500 (Warna kedua untuk kartu)
        },
        // --- SHADOW KHUSUS (Untuk efek 'glow' di tema gelap) ---
        boxShadow: {
            'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 5px 15px -3px rgba(0, 0, 0, 0.3)',
        }
        // Catatan: Animasi keyframes dihilangkan di sini karena sudah diinjeksikan 
        // melalui App.jsx untuk konsistensi, tetapi Tailwind tetap menggunakannya.
    },
  },
  plugins: [],
}