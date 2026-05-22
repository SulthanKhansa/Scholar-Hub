import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouterStore } from '../store/routerStore';
import { ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useRouterStore((state) => state.navigate);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      clearError();
    };
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !password) return;
    
    const success = login(nim, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        minHeight: '600px'
      }}>
        {/* Left Side - Mascot */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.5) 0%, rgba(219, 234, 254, 0.5) 100%)',
          padding: '40px',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          gap: '32px'
        }}>
          <h1 style={{ 
            fontSize: '38px', 
            fontWeight: 800, 
            color: '#1e3a8a', 
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}>
            ScholarHub
          </h1>
          <img 
            src="/images/Scholar Mascot.png" 
            alt="Scholar Mascot" 
            style={{ 
              width: '100%', 
              maxWidth: '380px', 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.12))',
              transform: 'scale(1.1)' 
            }} 
          />
        </div>

        {/* Right Side - Form */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 40px',
          background: '#ffffff'
        }}>
          <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', margin: 0 }}>
                Welcome Back
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0, marginTop: '8px' }}>
                Please login with NIM (25092001)
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 500
              }}>
                <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="nim" style={{ color: '#334155', fontWeight: 600 }}>NIM</label>
                <input
                  id="nim"
                  type="text"
                  className="form-input"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#0f172a' }}
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="password" style={{ color: '#334155', fontWeight: 600 }}>Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#0f172a' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" style={{ 
                width: '100%', 
                padding: '14px', 
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: 700, 
                cursor: 'pointer', 
                marginTop: '16px', 
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
