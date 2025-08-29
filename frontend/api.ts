import type { Provider, Order, NewOrderPayload, User } from './types';

// URL del backend in produzione (su Render).
// !!! IMPORTANTE: Sostituisci questo URL con quello vero del tuo backend su Render.com !!!
const PROD_API_URL = 'https://threed-print-connect.onrender.com'; // <-- SOSTITUISCI QUESTO!

// URL del backend in sviluppo (locale)
const DEV_API_URL = 'http://localhost:3001/api';

// Determina quale URL usare in base all'hostname del browser.
// Se l'hostname è 'localhost', siamo in sviluppo, altrimenti in produzione.
const API_BASE_URL = window.location.hostname === 'localhost' ? DEV_API_URL : PROD_API_URL;

console.log(`API base URL is set to: ${API_BASE_URL}`);


export const api = {
  /**
   * Recupera la lista dei provider dal backend reale.
   */
  fetchProviders: async (): Promise<Provider[]> => {
    console.log(`API: Fetching providers from backend at ${API_BASE_URL}...`);
    try {
        const response = await fetch(`${API_BASE_URL}/providers`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data: Provider[] = await response.json();
        console.log('API: Providers fetched successfully.');
        // In un'app reale, i dati come 'orders' e 'materials' potrebbero essere caricati separatamente o inclusi qui.
        // Per ora, assumiamo che il backend li fornisca, ma inizializziamoli vuoti se mancano.
        return data.map(p => ({ ...p, orders: p.orders || [], materials: p.materials || [] }));
    } catch (error) {
        console.error("Failed to fetch providers:", error);
        // Restituisci un array vuoto in caso di errore per non far crashare l'UI
        return [];
    }
  },

  /**
   * Invia un nuovo ordine al backend reale.
   */
  submitOrder: async (payload: NewOrderPayload, currentUser: User): Promise<Order> => {
    console.log(`API: Submitting order to backend at ${API_BASE_URL}...`, payload);
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                customerName: currentUser.name, // Aggiungiamo il nome del cliente per il backend
            }),
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const newOrder: Order = await response.json();
        console.log('API: Order submitted successfully.', newOrder);
        return newOrder;

    } catch(error) {
        console.error("Failed to submit order:", error);
        // Lancia l'errore in modo che il componente UI possa gestirlo
        throw error;
    }
  }
};