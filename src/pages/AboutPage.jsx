// src/pages/AboutPage.jsx
// Halaman yang menampilkan informasi tentang fitur dan tujuan aplikasi ZR Planet.
import React from 'react';
import { Globe, Code, Edit, Trash2, PlusSquare, Aperture, Rocket } from 'lucide-react';

// --- Sub Komponen untuk About Page ---
// Kartu fitur dengan tata letak horizontal
const FeatureCard = ({ title, icon: Icon, description, color, children }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="md:w-1/3 flex-shrink-0">
            {children}
        </div>
        <div className="md:w-2/3">
            <h3 className={`text-2xl font-bold mb-3 flex items-center ${color}`}>
                <Icon className="w-6 h-6 mr-2" /> {title}
            </h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);
// --- Halaman Tentang ---
const AboutPage = () => {
    return (
        <div className="p-6 text-white min-h-screen-minus-header pb-24">
            <h2 className="text-4xl font-extrabold text-cyan-400 mb-8 border-b border-gray-700 pb-2 text-center">
                <Globe className="inline w-8 h-8 mr-2 animate-pulse" /> Tentang ZR Planet
            </h2>
            
            <div className="space-y-8">
                <p className="text-lg text-gray-300 text-center italic mb-8">
                    ZR Planet adalah portal data kosmik interaktif yang dirancang untuk membawa Anda lebih dekat ke misteri alam semesta, satu planet pada satu waktu.
                </p>

                {/* Section 1: Planet dan Data */}
                <FeatureCard 
                    title="1. Katalog Planet & Informasi Mendalam" 
                    icon={Globe} 
                    description="Jelajahi detail planet-planet Tata Surya, mulai dari ukuran, jarak, hingga fakta unik dan penting lainnya. Setiap planet memiliki kartu data khusus untuk mempermudah navigasi data."
                    color="text-cyan-400"
                >
                    <div className="flex items-center justify-center p-4 bg-gray-900 rounded-lg border border-gray-700 h-24">
                        <Aperture className="w-10 h-10 text-cyan-400 animate-pulse-slow" />
                        <span className="ml-3 text-lg font-semibold text-gray-200">Data Kosmik Tersedia</span>
                    </div>
                </FeatureCard>

                {/* Section 2: Fitur Interaktif (CRUD) */}
                <FeatureCard 
                    title="2. Kelola Data Anda Sendiri" 
                    icon={Edit} 
                    description="Anda bukan hanya penonton, tetapi juga kontributor! Tambahkan planet, edit detail, atau hapus entri dari katalog. Fitur CRUD (Create, Read, Update, Update, Delete) memungkinkan Anda menyesuaikan basis data kosmik sesuai kebutuhan eksplorasi Anda."
                    color="text-yellow-400"
                >
                    <div className="flex items-center justify-around p-4 bg-gray-900 rounded-lg border border-gray-700 h-24">
                        <PlusSquare className="w-8 h-8 text-green-400" />
                        <Edit className="w-8 h-8 text-blue-400" />
                        <Trash2 className="w-8 h-8 text-red-400" />
                    </div>
                </FeatureCard>

                {/* Section 3: Pengalaman PWA (Cepat & Andal) */}
                <FeatureCard 
                    title="3. Pengalaman Aplikasi Web Modern" 
                    icon={Rocket} 
                    description="Dibangun sebagai Progressive Web App (PWA), ZR Planet cepat, responsif, dan dapat diinstal di perangkat Anda, memberikan pengalaman yang andal dan mulus seperti aplikasi *native*."
                    color="text-green-400"
                >
                    <div className="flex items-center justify-center p-4 bg-gray-900 rounded-lg border border-gray-700 h-24">
                         <div className="w-10 h-10 bg-cyan-600 rounded-xl shadow-2xl flex items-center justify-center transform transition-transform duration-500 animate-icon-bounce">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </FeatureCard>
                
                <p className="text-center text-lg text-gray-300 pt-4 italic border-t border-gray-700">
                    Mulai petualangan data kosmik Anda sekarang juga!
                </p>
            </div>
        </div>
    );
};

export default AboutPage;