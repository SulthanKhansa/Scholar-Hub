import { create } from 'zustand';

export type AppPath = 
  | '/' 
  | '/login' 
  | '/dashboard' 
  | '/dashboard/categories' 
  | '/dashboard/speakers' 
  | '/dashboard/events' 
  | '/biodata';

interface RouterState {
  path: AppPath;
  navigate: (to: AppPath) => void;
}

export const useRouterStore = create<RouterState>((set) => ({
  path: '/',
  navigate: (to) => {
    // Use browser history instead of hash
    window.history.pushState(null, '', to);
    set({ path: to });
  },
}));

// Synchronize with browser history on initial load and back/forward buttons
if (typeof window !== 'undefined') {
  const handlePopState = () => {
    const pathname = window.location.pathname as AppPath;
    const validPaths: AppPath[] = [
      '/',
      '/login',
      '/dashboard',
      '/dashboard/categories',
      '/dashboard/speakers',
      '/dashboard/events',
      '/biodata'
    ];
    if (validPaths.includes(pathname)) {
      useRouterStore.getState().navigate(pathname);
    } else {
      useRouterStore.getState().navigate('/');
    }
  };

  window.addEventListener('popstate', handlePopState);
  
  // Set initial path based on current pathname
  setTimeout(() => {
    handlePopState();
  }, 100);
}
