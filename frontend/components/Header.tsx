import React from 'react';
import type { View, User } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, user, onLogout }) => {
  const getButtonClass = (view: View) => {
    return `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
  };
  
  const dashboardText = user?.type === 'provider' ? 'La Mia Dashboard' : 'I Miei Ordini';

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Icon name="cube" className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">3D Print Connect</span>
          </div>
          <nav className="flex items-center gap-4">
             {user ? (
              <>
                <button onClick={() => setView('HOME')} className={getButtonClass('HOME')}>
                    <Icon name="search" className="w-5 h-5" />
                    <span>Trova Stampatori</span>
                </button>
                <button onClick={() => setView('DASHBOARD')} className={getButtonClass('DASHBOARD')}>
                    <Icon name="dashboard" className="w-5 h-5" />
                    <span>{dashboardText}</span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                    <span className="text-sm text-gray-300">
                        Benvenuto, <span className="font-bold text-white">{user.name}</span>
                    </span>
                    <button onClick={onLogout} title="Logout" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                       <Icon name="logout" className="w-5 h-5" />
                    </button>
                </div>
              </>
            ) : (
                 <span className="text-gray-400 text-sm">Benvenuto! Accedi per continuare.</span>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};