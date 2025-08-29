import React, { useState } from 'react';
import type { Provider, View, Order, User } from './types';
import { OrderStatus } from './types';
import { useProviders } from './hooks/useProviders';
import { Header } from './components/Header';
import { ProviderCard } from './components/ProviderCard';
import { OrderModal } from './components/OrderModal';
import { Icon } from './components/Icon';

// Mock users for login simulation
const mockUsers: User[] = [
    { id: 1, name: 'Marco Rossi', type: 'provider', providerId: 1 },
    { id: 2, name: 'Alice', type: 'customer' },
];

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-md text-center">
                <Icon name="cube" className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Benvenuto in 3D Print Connect</h1>
                <p className="text-gray-400 mb-8">Seleziona un profilo per continuare.</p>
                <div className="space-y-4">
                    <button 
                        onClick={() => onLogin(mockUsers[0])}
                        className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-lg transition-colors duration-200 text-lg"
                    >
                        <Icon name="business" className="w-6 h-6 text-green-400" />
                        Accedi come Marco Rossi (Stampatore)
                    </button>
                    <button 
                        onClick={() => onLogin(mockUsers[1])}
                        className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-lg transition-colors duration-200 text-lg"
                    >
                         <Icon name="user" className="w-6 h-6 text-sky-400" />
                        Accedi come Alice (Cliente)
                    </button>
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC<{ providers: Provider[], onSelectProvider: (p: Provider) => void }> = ({ providers, onSelectProvider }) => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">Trova uno Stampatore 3D</h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Connettiti con appassionati e professionisti nella tua zona per dare vita ai tuoi progetti.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {providers.map(provider => (
        <ProviderCard key={provider.id} provider={provider} onSelect={onSelectProvider} />
      ))}
    </div>
  </div>
);

const ProviderDetailPage: React.FC<{ provider: Provider, onBack: () => void, onOpenOrderModal: () => void }> = ({ provider, onBack, onOpenOrderModal }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 font-medium">
            <Icon name="arrow-left" className="w-5 h-5"/>
            Torna alla lista
        </button>
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
                <div className="flex flex-col sm:flex-row items-start gap-8">
                    <img className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 flex-shrink-0" src={provider.avatarUrl} alt={provider.name} />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-bold text-white">{provider.name}</h1>
                             <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${provider.isBusiness ? 'bg-green-500/20 text-green-400' : 'bg-sky-500/20 text-sky-400'}`}>
                                <Icon name={provider.isBusiness ? 'business' : 'personal'} className="w-4 h-4" />
                                <span>{provider.isBusiness ? 'Account Business' : 'Account Privato'}</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 mt-2">
                            <Icon name="location" className="w-5 h-5 mr-2 text-blue-400" />
                            <span>{provider.distance}km di distanza</span>
                            <span className="mx-2">·</span>
                             <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Icon key={i} name="star" className={`w-5 h-5 ${i < Math.round(provider.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                                ))}
                                <span className="ml-2 text-sm font-medium text-gray-300">{provider.rating.toFixed(1)}</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mt-4 text-lg">"{provider.motto}"</p>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-gray-700 pb-2">Stampanti Disponibili</h3>
                        <ul className="space-y-3">
                            {provider.printers.map(printer => (
                                <li key={printer.id} className="flex items-center p-3 bg-gray-700/50 rounded-md">
                                    <Icon name="printer" className="w-6 h-6 mr-4 text-blue-400"/>
                                    <div>
                                        <p className="font-semibold text-gray-200">{printer.model}</p>
                                        <p className="text-sm text-gray-400">Volume: {printer.buildVolume}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-gray-700 pb-2">Materiali Offerti</h3>
                         <div className="flex flex-wrap gap-2">
                            {provider.materials.map(material => (
                                <span key={material} className="px-3 py-1 bg-gray-700 text-gray-200 font-medium rounded-full text-sm">{material}</span>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-gray-700/50 rounded-md">
                            <h4 className="font-semibold text-white">Tariffe</h4>
                            <p className="text-gray-400 text-sm mt-1">Le tariffe sono personalizzate in base al progetto. Contattami per un preventivo gratuito!</p>
                        </div>
                    </div>
                </div>
            </div>
             <div className="bg-gray-900/50 px-8 py-5 text-center">
                 <button onClick={onOpenOrderModal} className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg shadow-lg">
                    Invia un File e Richiedi Stampa
                </button>
            </div>
        </div>
    </div>
);

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
    const statusConfig = {
        [OrderStatus.PENDING]: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
        [OrderStatus.ACCEPTED]: { color: 'text-sky-400', bgColor: 'bg-sky-500/10' },
        [OrderStatus.PRINTING]: { color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
        [OrderStatus.COMPLETED]: { color: 'text-green-400', bgColor: 'bg-green-500/10' },
        [OrderStatus.REJECTED]: { color: 'text-red-400', bgColor: 'bg-red-500/10' },
    };
    return (
         <tr className="border-b border-gray-700 hover:bg-gray-800/50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{order.customerName}</td>
            <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                <div className="flex items-center gap-2">
                    {order.fileName ? (
                        <>
                            <Icon name="cube" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{order.fileName}</span>
                        </>
                    ) : (
                        <>
                            <Icon name="lightbulb" className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="italic truncate" title={order.ideaDescription}>{order.ideaDescription}</span>
                        </>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.material} (x{order.quantity})</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[order.status].bgColor} ${statusConfig[order.status].color}`}>
                    {order.status}
                </span>
            </td>
        </tr>
    );
};

const DashboardPage: React.FC<{ provider: Provider | undefined, user: User | null }> = ({ provider, user }) => {
    
    // If logged in as provider, show their dashboard
    if (user?.type === 'provider' && provider) {
         return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <h1 className="text-3xl font-bold text-white mb-6">Dashboard di {provider.name}</h1>
                 <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-200">Richieste di Stampa Ricevute</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File / Idea</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Dettagli</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stato</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                               {provider.orders.length > 0 ? provider.orders.map(order => (
                                   <OrderRow key={order.id} order={order} />
                               )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">Nessun ordine ricevuto.</td>
                                </tr>
                               )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // If logged in as customer, show their orders (mockup)
     if (user?.type === 'customer') {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-6">I Miei Ordini</h1>
                <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-center">
                    <Icon name="cube" className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-200">Funzionalità in arrivo!</h2>
                    <p className="text-gray-400 mt-2">Qui potrai visualizzare la cronologia e lo stato di tutti i tuoi ordini.</p>
                </div>
            </div>
        );
    }
    
    // Fallback
    return <div className="text-center py-10 text-gray-400">Impossibile caricare la dashboard.</div>;
}

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { providers, setProviders, loading } = useProviders();

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setView('PROVIDER_DETAIL');
  };

  const handleBackToHome = () => {
    setSelectedProvider(null);
    setView('HOME');
  };

  const handleLogin = (user: User) => {
      setCurrentUser(user);
      setView('HOME');
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      setView('HOME');
      setSelectedProvider(null);
  };

  const handleOrderSubmitted = (newOrder: Order, providerId: number) => {
    setProviders(currentProviders => {
        return currentProviders.map(p => {
            if (p.id === providerId) {
                // Add the new order to the beginning of the orders array
                return { ...p, orders: [newOrder, ...p.orders] };
            }
            return p;
        });
    });
    // Optional: switch to dashboard to see the new order after submission
    // setView('DASHBOARD');
  };
  
  const renderContent = () => {
      if (loading) {
          return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
      }

      switch (view) {
          case 'PROVIDER_DETAIL':
              return selectedProvider && <ProviderDetailPage provider={selectedProvider} onBack={handleBackToHome} onOpenOrderModal={() => setIsOrderModalOpen(true)} />;
          case 'DASHBOARD':
              const userProvider = providers.find(p => p.id === currentUser?.providerId);
              return <DashboardPage provider={userProvider} user={currentUser} />;
          case 'HOME':
          default:
              return <HomePage providers={providers} onSelectProvider={handleSelectProvider} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!currentUser && !loading && <LoginPage onLogin={handleLogin} />}
      <Header currentView={view} setView={setView} user={currentUser} onLogout={handleLogout} />
      <main>
        {renderContent()}
      </main>
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        provider={selectedProvider}
        currentUser={currentUser}
        onOrderSubmitted={handleOrderSubmitted} 
      />
    </div>
  );
};

export default App;