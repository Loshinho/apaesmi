import React from 'react';
import { MapPin, CalendarPlus } from 'lucide-react';
import { motion } from 'motion/react';

export function Header() {
  const handleAddToCalendar = () => {
    // Generate an ICS or Google Calendar link
    const text = encodeURIComponent('Show de Prêmios Beneficente APAE');
    const dates = '20260816T170000Z/20260816T210000Z'; // 14:00 to 18:00 BRT is 17:00 to 21:00 UTC
    const details = encodeURIComponent('Show de Prêmios Beneficente da APAE de Santa Maria de Itabira.');
    const location = encodeURIComponent('Parque de Exposições, Santa Maria de Itabira - MG');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <header className="pt-8 pb-10 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        
        <motion.img 
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src="https://i.ibb.co/k24FpZJc/LOGO-SHOW-DE-PREMIOS.png"
          alt="Show de Prêmios Beneficente APAE Santa Maria de Itabira"
          className="w-full max-w-xl mx-auto mb-8 drop-shadow-2xl"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-[#E31E24] text-white rounded-3xl p-5 inline-block shadow-xl border border-white/20 max-w-md w-full relative overflow-hidden"
        >
          <div className="flex flex-row items-center justify-between px-4">
            <div className="text-center">
              <p className="font-lilita text-3xl text-yellow-300 leading-none drop-shadow">16 AGO</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/90 mt-1">2026</p>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <p className="font-lilita text-3xl text-white leading-none drop-shadow">14:00</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/90 mt-1">Horário</p>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <a 
              href="https://maps.app.goo.gl/EDqJxBTpK2CrtrJ27" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center text-yellow-300 hover:text-white transition-colors"
            >
              <MapPin className="w-7 h-7 mb-1 group-hover:-translate-y-1 transition-transform drop-shadow" />
              <span className="font-bold text-[10px] uppercase tracking-widest leading-none text-white/90">Ver no Mapa</span>
            </a>
          </div>
          
          <div className="mt-5 pt-4 border-t border-white/20 flex flex-col items-center">
             <p className="font-lilita text-xl text-white mb-3 tracking-wide flex items-center gap-2 drop-shadow-md">
                <MapPin className="w-5 h-5 text-yellow-300" />
                Local: Parque de Exposições
             </p>
             <button 
               onClick={handleAddToCalendar}
               className="flex items-center justify-center gap-2 text-sm font-bold bg-black/20 hover:bg-black/30 text-white transition-colors px-5 py-2.5 rounded-xl border border-white/10 w-full md:w-auto"
             >
               <CalendarPlus className="w-4 h-4" /> Adicionar à Agenda
             </button>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
