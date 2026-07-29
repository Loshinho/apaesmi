import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBarProps {
  cities: string[];
  neighborhoods: string[];
  selectedCity: string;
  selectedNeighborhood: string;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (neighborhood: string) => void;
}

export function SearchBar({
  cities,
  neighborhoods,
  selectedCity,
  selectedNeighborhood,
  onCityChange,
  onNeighborhoodChange
}: SearchBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 mb-8 border border-gray-100"
    >
      <h2 className="text-xl font-lilita text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
        <Search className="w-6 h-6 text-[#E31E24]" />
        Encontre um ponto de venda
      </h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2">
            Selecione a Cidade
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-200 text-gray-900 text-base font-medium rounded-xl focus:ring-0 focus:border-[#1E9E49] block p-3.5 transition-colors cursor-pointer appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          >
            <option value="">Todas as cidades (ordem alfabética)</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {selectedCity && neighborhoods.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <label htmlFor="neighborhood" className="block text-sm font-bold text-gray-700 mb-2">
              Selecione o Bairro (Opcional)
            </label>
            <select
              id="neighborhood"
              value={selectedNeighborhood}
              onChange={(e) => onNeighborhoodChange(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 text-gray-900 text-base font-medium rounded-xl focus:ring-0 focus:border-[#1E9E49] block p-3.5 transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="">Todos os bairros...</option>
              {neighborhoods.map(neighborhood => (
                <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
              ))}
            </select>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
