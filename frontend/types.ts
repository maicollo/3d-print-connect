export enum Material {
  PLA = 'PLA',
  ABS = 'ABS',
  PETG = 'PETG',
  TPU = 'TPU',
  RESIN = 'Resin',
}

export interface Printer {
  id: number;
  model: string;
  buildVolume: string; // e.g., "220x220x250mm"
}

export interface Provider {
  id: number;
  name: string;
  distance: number; // in km
  rating: number; // 1-5
  avatarUrl: string;
  printers: Printer[];
  materials: Material[];
  isBusiness: boolean;
  motto: string;
  orders: Order[];
}

export enum OrderStatus {
    PENDING = 'In attesa',
    ACCEPTED = 'Accettato',
    PRINTING = 'In stampa',
    COMPLETED = 'Completato',
    REJECTED = 'Rifiutato',
}

export interface Order {
    id: number;
    customerName: string;
    fileName?: string;
    ideaDescription?: string;
    material: Material;
    quantity: number;
    status: OrderStatus;
    date: string;
}

export interface User {
  id: number;
  name: string;
  type: 'provider' | 'customer';
  // If the user is a provider, this links to their provider profile
  providerId?: number; 
}

export interface NewOrderPayload {
    providerId: number;
    fileName?: string;
    ideaDescription?: string;
    material: Material;
    quantity: number;
    notes: string;
}

export type View = 'HOME' | 'PROVIDER_DETAIL' | 'DASHBOARD';