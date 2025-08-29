import React from 'react';
import type { Provider } from '../types';
import { Icon } from './Icon';

interface ProviderCardProps {
  provider: Provider;
  onSelect: (provider: Provider) => void;
}

const AccountTypeBadge: React.FC<{ isBusiness: boolean }> = ({ isBusiness }) => {
    const bgColor = isBusiness ? 'bg-green-500/20' : 'bg-sky-500/20';
    const textColor = isBusiness ? 'text-green-400' : 'text-sky-400';
    const iconName = isBusiness ? 'business' : 'personal';
    const text = isBusiness ? 'Business' : 'Privato';

    return (
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
            <Icon name={iconName} className="w-3.5 h-3.5" />
            <span>{text}</span>
        </div>
    );
};


export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out relative">
      <div className="p-5">
        <AccountTypeBadge isBusiness={provider.isBusiness} />
        <div className="flex items-center mb-4">
          <img className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-600" src={provider.avatarUrl} alt={provider.name} />
          <div>
            <h3 className="text-xl font-bold text-white">{provider.name}</h3>
            <div className="flex items-center text-gray-400 text-sm">
                <Icon name="location" className="w-4 h-4 mr-1 text-blue-400" />
                <span>{provider.distance}km di distanza</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 h-10">"{provider.motto}"</p>

        <div className="space-y-3 text-sm">
            <div className="flex items-start">
                <Icon name="printer" className="w-5 h-5 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-gray-200">Stampanti</h4>
                    <p className="text-gray-400">{provider.printers.map(p => p.model).join(', ')}</p>
                </div>
            </div>
            <div className="flex items-start">
                <Icon name="cube" className="w-5 h-5 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-gray-200">Materiali</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {provider.materials.map(material => (
                            <span key={material} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">{material}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

      </div>
      <div className="px-5 py-3 bg-gray-800/50 border-t border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" className={`w-5 h-5 ${i < Math.round(provider.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-300">{provider.rating.toFixed(1)}</span>
        </div>
        <button
            onClick={() => onSelect(provider)}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
        >
            Richiedi Stampa
        </button>
      </div>
    </div>
  );
};