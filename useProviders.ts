import { useState, useEffect } from 'react';
import type { Provider } from '../types';
import { api } from '../api';

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndSetProviders = async () => {
        setLoading(true);
        try {
          const data = await api.fetchProviders();
          setProviders(data);
        } catch (error) {
          console.error("Failed to fetch providers", error);
          // In a real app, you'd set an error state to show in the UI
        } finally {
          setLoading(false);
        }
      };

    fetchAndSetProviders();
  }, []);

  return { providers, setProviders, loading };
};