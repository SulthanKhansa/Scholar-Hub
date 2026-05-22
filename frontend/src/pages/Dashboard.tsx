import React, { useEffect } from 'react';
import { useDataStore } from '../store/dataStore';


export const Dashboard: React.FC = () => {
  const { 
    events, 
    categories, 
    speakers, 
    isLoading, 
    fetchEvents, 
    fetchCategories, 
    fetchSpeakers 
  } = useDataStore();
  
  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchSpeakers();
  }, [fetchEvents, fetchCategories, fetchSpeakers]);

  if (isLoading && events.length === 0) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Header */}
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>Ringkasan Data</h1>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', animation: 'fadeIn 0.6s ease-out' }}>
        <div className="glass-panel card-hover" style={{ padding: '28px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>Total Kategori</div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)' }}>{categories.length}</div>
        </div>
        <div className="glass-panel card-hover" style={{ padding: '28px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>Total Event</div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)' }}>{events.length}</div>
        </div>
        <div className="glass-panel card-hover" style={{ padding: '28px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>Total Pembicara</div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)' }}>{speakers.length}</div>
        </div>
      </div>

      {/* Main Grid: Recent Events and Speakers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Kategori Terbaru */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', minHeight: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Kategori Terbaru</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {categories.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Belum ada data kategori.</p>
            ) : (
              categories.slice(0, 3).map(category => (
                <div key={category.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: 'var(--primary)'
                  }}>
                    {(category.nama || category.name || '').charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>{category.nama || category.name}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {category.deskripsi || category.description || 'Kategori Event'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Event Terbaru */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', minHeight: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Event Terbaru</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {events.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Belum ada data event.</p>
            ) : (
              events.slice(0, 3).map(event => (
                <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{event.judul || event.title}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                      {(event.tanggal || event.date || '').split('T')[0]}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pembicara Terbaru */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', minHeight: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Pembicara Terbaru</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {speakers.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Belum ada data pembicara.</p>
            ) : (
              speakers.slice(0, 3).map(speaker => (
                <div key={speaker.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: 'var(--primary)'
                  }}>
                    {(speaker.nama || speaker.name || '').charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>{speaker.nama || speaker.name}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{speaker.gelar || speaker.title}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
