import React, { useRef, useMemo, useEffect } from 'react';
import { MapPin, Phone, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PointOfSale } from '../types';

interface PointsListProps {
  points: PointOfSale[];
  showAlphabetSlider: boolean;
}

export function PointsList({ points, showAlphabetSlider }: PointsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  
  // Sort points alphabetically by name
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.name.localeCompare(b.name));
  }, [points]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  // Find which letters actually exist in the data
  const existingLetters = useMemo(() => {
    const letters = new Set<string>();
    sortedPoints.forEach(p => {
      if (p.name) {
        letters.add(p.name.charAt(0).toUpperCase());
      }
    });
    return letters;
  }, [sortedPoints]);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Group by letter for rendering headers when slider is active
  const groupedPoints = useMemo(() => {
    const groups: { [key: string]: PointOfSale[] } = {};
    if (showAlphabetSlider) {
      sortedPoints.forEach(p => {
        const firstLetter = p.name ? p.name.charAt(0).toUpperCase() : '#';
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(p);
      });
    }
    return groups;
  }, [sortedPoints, showAlphabetSlider]);

  if (sortedPoints.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 text-center shadow-xl border border-white/20">
        <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-bold text-lg">Nenhum ponto de venda encontrado.</p>
      </div>
    );
  }

  return (
    <div className="relative" ref={listRef}>
      <div className="flex">
        <div className="flex-1 w-full space-y-4 pr-2">
          {showAlphabetSlider ? (
            // Render with letter headers
            Object.keys(groupedPoints).sort().map(letter => (
              <div key={letter} id={`letter-${letter}`} className="mb-6 scroll-mt-24">
                <h3 className="font-lilita text-2xl text-yellow-300 mb-3 px-2 flex items-center gap-2 drop-shadow-md">
                  {letter}
                  <div className="h-px bg-white/20 flex-1"></div>
                </h3>
                <div className="space-y-4">
                  {groupedPoints[letter].map((point, i) => (
                    <PointCard key={point.id || i} point={point} index={i} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Render flat list
            <div className="space-y-4">
              {sortedPoints.map((point, i) => (
                <PointCard key={point.id || i} point={point} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Alphabet Slider */}
        {showAlphabetSlider && (
          <div className="sticky top-24 h-max ml-2 flex flex-col items-center bg-black/20 backdrop-blur-md rounded-full py-2 px-1">
            {alphabet.map(letter => {
              const isActive = existingLetters.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => isActive && scrollToLetter(letter)}
                  disabled={!isActive}
                  className={`text-[10px] sm:text-xs font-bold py-[2px] px-1 w-full rounded transition-all ${
                    isActive 
                      ? 'text-white hover:bg-white/30 cursor-pointer' 
                      : 'text-white/20 cursor-default'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PointCard({ point, index }: { point: PointOfSale; index: number; key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-2xl p-5 shadow-lg border-l-[6px] border-[#E31E24] hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <h4 className="font-lilita text-xl text-gray-800 flex items-start gap-2 leading-tight">
        <Store className="w-5 h-5 text-[#E31E24] mt-0.5 shrink-0" />
        {point.name}
      </h4>
      <div className="mt-4 space-y-3 text-gray-600 ml-7">
        <p className="flex items-start gap-2.5 text-sm font-medium">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
          <span>
            {point.address}<br/>
            <span className="text-gray-400 font-bold">{point.neighborhood} - {point.city}</span>
          </span>
        </p>
        <a 
          href={`tel:${point.phone.replace(/\D/g,'')}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1E9E49] hover:text-[#157936] bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Phone className="w-4 h-4" />
          {point.phone}
        </a>
      </div>
    </motion.div>
  );
}
