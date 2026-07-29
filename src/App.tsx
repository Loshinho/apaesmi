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
  const { scrollY } = useScroll();
  const yBase = useTransform(scrollY, [0, 1500], [0, -1000]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#1E9E49] via-[#157936] to-[#0A471D]">
      <motion.div 
        style={{ y: yBase }}
        className="absolute top-[10%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        style={{ y: yBase }}
        className="absolute top-[80%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"
      />
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>

      {/* Parallax Cars */}
      {/* Left Side Cars (Mirrored) */}
      <motion.img 
        style={{ y: yBase }}
        src="https://i.ibb.co/wNkH3qB1/mobi.png" 
        className="absolute top-[5%] -left-[10%] w-72 md:w-80 lg:w-[350px] opacity-100 scale-x-[-1] pointer-events-none drop-shadow-2xl" 
        alt="Fiat Mobi"
      />
      <motion.img 
        style={{ y: yBase }}
        src="https://i.ibb.co/wNkH3qB1/mobi.png" 
        className="absolute top-[65%] -left-[15%] w-80 md:w-96 lg:w-[400px] opacity-100 scale-x-[-1] pointer-events-none drop-shadow-2xl" 
        alt="Fiat Mobi"
      />

      {/* Right Side Cars */}
      <motion.img 
        style={{ y: yBase }}
        src="https://i.ibb.co/wNkH3qB1/mobi.png" 
        className="absolute top-[35%] -right-[5%] w-64 md:w-72 lg:w-[350px] opacity-100 pointer-events-none drop-shadow-2xl" 
        alt="Fiat Mobi"
      />
      <motion.img 
        style={{ y: yBase }}
        src="https://i.ibb.co/wNkH3qB1/mobi.png" 
        className="absolute top-[95%] -right-[10%] w-72 md:w-80 lg:w-[450px] opacity-100 pointer-events-none drop-shadow-2xl" 
        alt="Fiat Mobi"
      />
      
      {/* Bottom Right Hero Car (Toro) */}
      <motion.img 
        style={{ y: yBase }}
        src="https://i.ibb.co/3YGjm5jD/hero-176.png" 
        className="absolute top-[135%] -right-[5%] w-[400px] md:w-[500px] lg:w-[600px] opacity-100 pointer-events-none drop-shadow-2xl" 
        alt="Fiat Toro"
      />
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
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: "easeOut" }}
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

