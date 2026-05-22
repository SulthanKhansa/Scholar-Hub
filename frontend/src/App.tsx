import React from 'react';
import { useRouterStore } from './store/routerStore';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Biodata } from './pages/Biodata';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Speakers } from './pages/Speakers';
import { Events } from './pages/Events';

export const App: React.FC = () => {
  const path = useRouterStore((state) => state.path);

  const renderPage = () => {
    switch (path) {
      case '/':
        return <Dashboard />;
      case '/login':
        return <Login />;
      case '/biodata':
        return <Biodata />;
      case '/dashboard':
        return <Dashboard />;
      case '/dashboard/categories':
        return <Categories />;
      case '/dashboard/speakers':
        return <Speakers />;
      case '/dashboard/events':
        return <Events />;
      default:
        return <Dashboard />;
    }
  };

  const content = renderPage();
  if (path === '/login') return content;

  return (
    <ProtectedRoute>
      <Layout>{content}</Layout>
    </ProtectedRoute>
  );
};
