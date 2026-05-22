import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  nim: string;
  name: string;
  prodi: string;
  kelas: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  login: (nim: string, pass: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      error: null,
      login: (nim, pass) => {
        // Validation according to PDF and user info
        // User NIM is 25092001. Password must be 25092001
        if (nim === '25092001' && pass === '25092001') {
          set({
            isAuthenticated: true,
            user: {
              nim: '25092001',
              name: 'Sulthan Khansa',
              prodi: 'D-4 Teknik Informatika',
              kelas: 'TI-4A',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
            },
            error: null,
          });
          return true;
        } else {
          set({ error: 'NIM atau Password salah!' });
          return false;
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, error: null });
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: 'vibeevent-auth', // localStorage key
    }
  )
);
