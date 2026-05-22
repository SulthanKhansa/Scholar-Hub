import React, { useEffect, useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { Search, Calendar, MapPin, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { events, categories, isLoading, fetchEvents, fetchCategories } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [fetchEvents, fetchCategories]);

  // Filtering Logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      (event.judul || event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.deskripsi || event.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.pembicara?.nama || event.pembicara?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.lokasi || event.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === null || event.kategoriId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: number) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const formatEventDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatEventTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search and Filter Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search events by title, topics, speakers, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '4px' }}>Filter Kategori:</span>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              background: selectedCategory === null ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              border: selectedCategory === null ? 'none' : '1px solid rgba(255,255,255,0.08)',
              color: selectedCategory === null ? '#fff' : 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: selectedCategory === null ? 600 : 400,
            }}
          >
            All Events
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                border: selectedCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat.id ? 600 : 400,
              }}
            >
              {cat.nama || cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && events.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Info size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
          <p style={{ fontSize: '15px' }}>No scheduled events match your search filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {filteredEvents.map((event) => {
            const isExpanded = expandedEventId === event.id;
            return (
              <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Accent line top */}
                <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' }}></div>
                
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Category badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {event.kategori?.nama || event.kategori?.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      <span>{formatEventTime(event.tanggal || event.date || '')} WITA</span>
                    </div>
                  </div>

                  {/* Title & Schedule */}
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: '1.4' }}>
                    {event.judul || event.title}
                  </h3>

                  {/* Location & Time */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      <span>{formatEventDate(event.tanggal || event.date || '')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="var(--accent)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.lokasi || event.location}</span>
                    </div>
                  </div>

                  {/* Speaker Details */}
                  {event.pembicara && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.03)',
                      marginBottom: '16px'
                    }}>
                      <img
                        src={event.pembicara.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(event.pembicara.nama || event.pembicara.name || '')}`}
                        alt={event.pembicara.nama || event.pembicara.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--secondary)' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HOST SPEAKER</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {event.pembicara.nama || event.pembicara.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {event.pembicara.gelar || event.pembicara.title}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description truncated or expanded */}
                  <p style={{
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {event.deskripsi || event.description}
                  </p>

                  {/* Toggle Expand Details */}
                  <button
                    onClick={() => toggleExpand(event.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: 'auto',
                      padding: 0,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {isExpanded ? (
                      <>
                        Collapse Details
                        <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        View Event Details
                        <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
