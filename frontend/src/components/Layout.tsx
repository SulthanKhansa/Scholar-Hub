import React from 'react';
import { useRouterStore, AppPath } from '../store/routerStore';
import { useAuthStore } from '../store/authStore';
import { 
  PieChart, 
  Tag, 
  Mic, 
  User,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { path, navigate } = useRouterStore();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { label: 'Dashboard', icon: PieChart, path: '/dashboard' as AppPath },
    { label: 'Kategori Event', icon: Tag, path: '/dashboard/categories' as AppPath },
    { label: 'Event', icon: FileText, path: '/dashboard/events' as AppPath },
    { label: 'Pembicara', icon: Mic, path: '/dashboard/speakers' as AppPath },
    { label: 'Biodata', icon: User, path: '/biodata' as AppPath },
  ];

  const isActive = (itemPath: AppPath) => path === itemPath;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        background: 'linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          <span style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '28px', color: '#fff', letterSpacing: '-0.5px' }}>
            ScholarHub
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 16px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      background: active ? '#ffffff' : 'transparent',
                      color: active ? '#1e3a8a' : '#ffffff',
                      fontFamily: 'inherit',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <Icon size={20} color={active ? '#1e3a8a' : '#ffffff'} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '0 16px', marginTop: 'auto' }}>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--danger)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#cc0000'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--danger)'}
          >
            LOGOUT
          </button>
        </div>


      </aside>

      {/* Main Content Pane */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        padding: '40px 48px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Content Viewport */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
