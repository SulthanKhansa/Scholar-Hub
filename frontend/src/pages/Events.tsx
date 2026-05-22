import React, { useEffect, useState } from 'react';
import { useDataStore, Event } from '../store/dataStore';
import { Edit2, Trash2, X, Calendar, MapPin, Tag, User } from 'lucide-react';

export const Events: React.FC = () => {
  const { 
    events, 
    categories, 
    speakers, 
    isLoading, 
    error, 
    fetchEvents, 
    fetchCategories, 
    fetchSpeakers, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useDataStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pembicaraId, setPembicaraId] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchSpeakers();
  }, [fetchEvents, fetchCategories, fetchSpeakers]);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setCategoryId(categories[0]?.id.toString() || '');
    setPembicaraId(speakers[0]?.id.toString() || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.judul || event.title || '');
    setDescription(event.deskripsi || event.description || '');
    
    // Format date string to match datetime-local format: YYYY-MM-DDTHH:MM
    const dateStr = event.tanggal || event.date || '';
    const dateObj = new Date(dateStr);
    const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
    
    setDate(localISOTime);
    setLocation(event.lokasi || event.location || '');
    setCategoryId(event.kategoriId.toString());
    setPembicaraId(event.pembicaraId.toString());
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !location.trim() || !categoryId || !pembicaraId) {
      setFormError('All event fields are required');
      return;
    }

    const payload = {
      judul: title,
      deskripsi: description,
      tanggal: new Date(date).toISOString(),
      lokasi: location,
      kategoriId: parseInt(categoryId),
      pembicaraId: parseInt(pembicaraId)
    };

    let success = false;
    if (editingEvent) {
      success = await updateEvent(editingEvent.id, payload);
    } else {
      success = await createEvent(payload);
    }

    if (success) {
      setIsModalOpen(false);
    } else {
      setFormError(error || 'Failed to submit event. Try again.');
    }
  };

  const handleDelete = async (id: number, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to cancel and delete the event "${eventTitle}"?`)) {
      await deleteEvent(id);
    }
  };

  const formatEventTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Event</h1>
        <button 
          onClick={openAddModal} 
          className="btn-primary" 
          style={{ padding: '10px 24px', borderRadius: '24px', fontWeight: 600 }}
          disabled={categories.length === 0 || speakers.length === 0}
        >
          Tambah Event
        </button>
      </div>

      {/* Safety warnings for empty relations */}
      {(categories.length === 0 || speakers.length === 0) && !isLoading && (
        <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '16px', marginBottom: '20px', fontSize: '14px' }}>
          <strong>Perhatian:</strong> Anda harus membuat minimal 1 Kategori dan 1 Pembicara sebelum bisa membuat Event.
        </div>
      )}

      {/* Main Grid */}
      {isLoading && events.length === 0 ? (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : events.length === 0 ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
          <p>Belum ada event.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {events.map((event) => {
            const eventDateStr = (event.tanggal || event.date || '').split('T')[0];
            return (
              <div key={event.id} className="glass-panel card-hover" style={{ 
                padding: '20px', 
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: '1.4', flex: 1, paddingRight: '12px' }}>
                    {event.judul || event.title}
                  </h3>
                  <div style={{
                    padding: '4px 12px',
                    background: '#fef3c7',
                    color: '#b45309',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}>
                    {eventDateStr}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{formatEventTime(event.tanggal || event.date || '')} WIB</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ opacity: 0.6 }} />
                    {event.lokasi || event.location}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '16px' }}>
                  <button onClick={() => openEditModal(event)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(event.id, event.judul || event.title || '')} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '650px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                {editingEvent ? 'Modify Scheduled Event' : 'Schedule New Event'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-input"

                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Venue Location</label>
                  <input
                    type="text"
                    className="form-input"

                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* DYNAMIC RELATION DROPDOWNS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={13} />
                    Category (Dynamic Dropdown)
                  </label>
                  <select
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} style={{ backgroundColor: '#111827', color: '#fff' }}>
                        {cat.nama || cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} />
                    Host Speaker (Dynamic Dropdown)
                  </label>
                  <select
                    className="form-select"
                    value={pembicaraId}
                    onChange={(e) => setPembicaraId(e.target.value)}
                    required
                  >
                    {speakers.map((spk) => (
                      <option key={spk.id} value={spk.id} style={{ backgroundColor: '#111827', color: '#fff' }}>
                        {spk.nama || spk.name} ({spk.gelar || spk.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}

                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              {/* Form Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  {editingEvent ? 'Save Changes' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
