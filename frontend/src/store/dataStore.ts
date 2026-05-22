import { create } from 'zustand';

// Determine API URL based on environment
const getApiUrl = () => {
  // In production (Railway), use environment variable or relative path
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '/api';
  }
  // In development, use relative path (proxied by Vite)
  return '/api';
};

const rawUrl = getApiUrl();
const API_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export interface Category {
  id: number;
  nama: string;
  deskripsi?: string;
  name?: string;
  description?: string;
  _count?: {
    acara: number;
  };
}

export interface Speaker {
  id: number;
  nama: string;
  gelar: string;
  name?: string;
  title?: string;
  avatar?: string;
  bio?: string;
  _count?: {
    acara: number;
  };
}

export interface Event {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  kategoriId: number;
  pembicaraId: number;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  kategori?: Category;
  pembicara?: Speaker;
  dibuatPada?: string;
}

interface DataState {
  categories: Category[];
  speakers: Speaker[];
  events: Event[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  createCategory: (data: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (id: number, data: Omit<Category, 'id'>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;

  fetchSpeakers: () => Promise<void>;
  createSpeaker: (data: Omit<Speaker, 'id'>) => Promise<boolean>;
  updateSpeaker: (id: number, data: Omit<Speaker, 'id'>) => Promise<boolean>;
  deleteSpeaker: (id: number) => Promise<boolean>;

  fetchEvents: () => Promise<void>;
  createEvent: (data: Omit<Event, 'id' | 'category' | 'pembicara'>) => Promise<boolean>;
  updateEvent: (id: number, data: Omit<Event, 'id' | 'category' | 'pembicara'>) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;
}

export const useDataStore = create<DataState>((set, get) => ({
  categories: [],
  speakers: [],
  events: [],
  isLoading: false,
  error: null,

  // CATEGORIES
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      set({ categories: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        nama: categoryData.nama || categoryData.name,
        deskripsi: categoryData.deskripsi || categoryData.description,
      };
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create category');
      }
      await get().fetchCategories();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        nama: categoryData.nama || categoryData.name,
        deskripsi: categoryData.deskripsi || categoryData.description,
      };
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update category');
      }
      await get().fetchCategories();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete category');
      }
      await get().fetchCategories();
      await get().fetchEvents(); // Events might be deleted via Cascade delete
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  // SPEAKERS
  fetchSpeakers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/speakers`);
      if (!res.ok) throw new Error('Failed to fetch speakers');
      const data = await res.json();
      set({ speakers: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createSpeaker: async (speakerData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        nama: speakerData.nama || speakerData.name,
        gelar: speakerData.gelar || speakerData.title,
        avatar: speakerData.avatar,
        bio: speakerData.bio,
      };
      const res = await fetch(`${API_URL}/api/speakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create speaker');
      }
      await get().fetchSpeakers();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  updateSpeaker: async (id, speakerData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        nama: speakerData.nama || speakerData.name,
        gelar: speakerData.gelar || speakerData.title,
        avatar: speakerData.avatar,
        bio: speakerData.bio,
      };
      const res = await fetch(`${API_URL}/api/speakers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update speaker');
      }
      await get().fetchSpeakers();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  deleteSpeaker: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/speakers/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete speaker');
      }
      await get().fetchSpeakers();
      await get().fetchEvents(); // Cascade deleted events
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  // EVENTS
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/events`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      set({ events: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        judul: eventData.judul || eventData.title,
        deskripsi: eventData.deskripsi || eventData.description,
        tanggal: eventData.tanggal || eventData.date,
        lokasi: eventData.lokasi || eventData.location,
        kategoriId: eventData.kategoriId,
        pembicaraId: eventData.pembicaraId,
      };
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create event');
      }
      await get().fetchEvents();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        judul: eventData.judul || eventData.title,
        deskripsi: eventData.deskripsi || eventData.description,
        tanggal: eventData.tanggal || eventData.date,
        lokasi: eventData.lokasi || eventData.location,
        kategoriId: eventData.kategoriId,
        pembicaraId: eventData.pembicaraId,
      };
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update event');
      }
      await get().fetchEvents();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete event');
      }
      await get().fetchEvents();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
