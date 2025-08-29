import React, { useState, useCallback } from 'react';
import type { Provider, NewOrderPayload, User, Order } from '../types';
import { Material } from '../types';
import { Icon } from './Icon';
import { api } from '../api';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  currentUser: User | null;
  onOrderSubmitted: (newOrder: Order, providerId: number) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, provider, currentUser, onOrderSubmitted }) => {
  const [hasFile, setHasFile] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState<Material>(provider?.materials[0] || Material.PLA);
  const [notes, setNotes] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 1 && !provider?.isBusiness) {
      setError('Questo fornitore non accetta ordini multipli. La quantità è limitata a 1.');
      setQuantity(1);
    } else {
      setError('');
      setQuantity(Math.max(1, newQuantity));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !currentUser) {
        setError('Errore: dati utente o fornitore mancanti.');
        return;
    }
    if (hasFile && !file) {
      setError('Per favore, carica un file di modello 3D.');
      return;
    }
    if (!hasFile && !ideaDescription.trim()) {
      setError("Per favore, descrivi la tua idea.");
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    const payload: NewOrderPayload = {
        providerId: provider.id,
        fileName: file?.name,
        ideaDescription: hasFile ? undefined : ideaDescription,
        quantity,
        material,
        notes,
    };

    try {
        const newOrder = await api.submitOrder(payload, currentUser);
        onOrderSubmitted(newOrder, provider.id);
        onClose();
    } catch (err) {
        setError('Si è verificato un errore durante l\'invio dell\'ordine. Riprova.');
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const resetForm = useCallback(() => {
    setHasFile(true);
    setFile(null);
    setQuantity(1);
    setMaterial(provider?.materials[0] || Material.PLA);
    setNotes('');
    setIdeaDescription('');
    setError('');
    setIsSubmitting(false);
  }, [provider]);

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Richiedi una Stampa</h2>
          <p className="text-gray-400 mt-1">Invia il tuo file a <span className="font-semibold text-blue-400">{provider.name}</span>.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cosa vuoi stampare?</label>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-700 p-1">
                <button type="button" onClick={() => setHasFile(true)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${hasFile ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}>
                  Ho un file 3D
                </button>
                <button type="button" onClick={() => setHasFile(false)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!hasFile ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}>
                  Ho un'idea/schizzo
                </button>
              </div>
            </div>

            {hasFile ? (
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">File Modello 3D (.stl, .obj)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Icon name="upload" className="mx-auto h-12 w-12 text-gray-500" />
                    <div className="flex text-sm text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                        <span>Carica un file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".stl,.obj,.3mf" />
                      </label>
                      <p className="pl-1">o trascinalo qui</p>
                    </div>
                    <p className="text-xs text-gray-500">{file ? file.name : 'Nessun file selezionato'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="idea" className="block text-sm font-medium text-gray-300">Descrivi la tua idea</label>
                <textarea id="idea" name="idea" rows={4} value={ideaDescription} onChange={e => {setIdeaDescription(e.target.value); setError('')}} className="mt-1 shadow-sm block w-full sm:text-sm bg-gray-700 border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Descrivi l'oggetto che vorresti creare, le sue dimensioni, funzionalità, ecc. Puoi anche includere link a immagini di riferimento."></textarea>
              </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-300">Materiale</label>
                    <select id="material" name="material" value={material} onChange={e => setMaterial(e.target.value as Material)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-white">
                        {provider.materials.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantità</label>
                    <input type="number" name="quantity" id="quantity" min="1" value={quantity} onChange={handleQuantityChange} className="mt-1 block w-full pl-3 pr-2 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-white" />
                </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Note Aggiuntive</label>
                <textarea id="notes" name="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 shadow-sm block w-full sm:text-sm bg-gray-700 border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Es. colore, impostazioni specifiche..."></textarea>
            </div>
          </div>
          <div className="bg-gray-800/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-700">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none">
              Annulla
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center w-36">
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Invia Richiesta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};