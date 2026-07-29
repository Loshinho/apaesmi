import React, { useState, useMemo, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { PointOfSale } from './types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PointsList } from './components/PointsList';
import { AdminPanel } from './components/AdminPanel';
import { Lock } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

function Background() {
  return (
    <div className="fixed inset-0 z-0 bg-[#1E9E49]">
      {/* Pattern overlay suave */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>
    </div>
  );
}

export default function App() {
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pointsOfSale'), (snapshot) => {
      const pts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PointOfSale));
      setPoints(pts);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    // Timeout de segurança: se não carregar em 5 segundos, libera a tela
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(points.map(p => p.city)));
    return uniqueCities.sort();
  }, [points]);

  const neighborhoods = useMemo(() => {
    if (!selectedCity) return [];
    const cityPoints = points.filter(p => p.city === selectedCity);
    const uniqueNeighborhoods = Array.from(new Set(cityPoints.map(p => p.neighborhood)));
    return uniqueNeighborhoods.sort();
  }, [selectedCity, points]);

  const filteredPoints = useMemo(() => {
    if (!selectedCity) {
      return points; // Se não tem cidade, mostra todos (PointsList vai ordenar)
    }
    
    return points.filter(p => {
      if (p.city !== selectedCity) return false;
      if (selectedNeighborhood && p.neighborhood !== selectedNeighborhood) return false;
      return true;
    });
  }, [points, selectedCity, selectedNeighborhood]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedNeighborhood('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E9E49] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 flex flex-col relative overflow-hidden">
      <Background />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex-1 flex flex-col w-full"
      >
        <Header />

        <main className="flex-1 w-full max-w-3xl mx-auto px-4 mt-2 mb-16 relative z-20">
          <SearchBar 
            cities={cities}
            neighborhoods={neighborhoods}
            selectedCity={selectedCity}
            selectedNeighborhood={selectedNeighborhood}
            onCityChange={handleCityChange}
            onNeighborhoodChange={setSelectedNeighborhood}
          />

          <PointsList 
            points={filteredPoints} 
            showAlphabetSlider={!selectedCity} // Mostra slider quando exibe todos
          />
        </main>

        <footer className="mt-auto pt-10 pb-6 bg-[#E31E24] w-full text-center relative z-20 border-t-4 border-yellow-400 shadow-[0_-10px_30px_rgba(227,30,36,0.3)]">
          <div className="max-w-4xl mx-auto px-4 mb-8">
             <h4 className="font-lilita text-2xl text-yellow-300 mb-6 drop-shadow-md tracking-wide">Informações e Contato</h4>
             <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white font-bold text-lg">
               <span>(31) 98433-5569</span>
               <span>(31) 3838-1567</span>
               <span>(31) 98935-6357</span>
               <span>(31) 98328-3791</span>
             </div>
          </div>

          <a 
            href="https://wa.me/5531997004046?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20cria%C3%A7%C3%A3o%20de%20um%20site." 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-row items-center justify-center gap-3 hover:scale-105 transition-transform group"
          >
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">Developed by:</span>
            <img src="https://i.ibb.co/Hv8HVRJ/galantis-10.png" alt="Galantis" className="h-20 drop-shadow-xl" />
          </a>
          
          <button 
            onDoubleClick={() => setIsAdminOpen(true)}
            className="absolute bottom-2 right-4 p-2 text-white/20 hover:text-white/50 transition-colors"
            title="Área Restrita"
          >
            <Lock className="w-4 h-4" />
          </button>
        </footer>
      </motion.div>

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

