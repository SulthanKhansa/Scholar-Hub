import React, { useEffect, useState } from 'react';
import { useDataStore, Speaker } from '../store/dataStore';
import { Edit2, Trash2, X, Users } from 'lucide-react';

export const Speakers: React.FC = () => {
  const { 
    speakers, 
    isLoading, 
    error, 
    fetchSpeakers, 
    createSpeaker, 
    updateSpeaker, 
    deleteSpeaker 
  } = useDataStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const openAddModal = () => {
    setEditingSpeaker(null);
    setName('');
    setTitle('');
    setAvatar('');
    setBio('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (spk: Speaker) => {
    setEditingSpeaker(spk);
    setName(spk.nama || spk.name || '');
    setTitle(spk.gelar || spk.title || '');
    setAvatar(spk.avatar || '');
    setBio(spk.bio || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) {
      setFormError('Name and Professional Title are required');
      return;
    }

    const payload = {
      nama: name,
      gelar: title,
      avatar: avatar.trim() || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      bio
    };

    let success = false;
    if (editingSpeaker) {
      success = await updateSpeaker(editingSpeaker.id, payload);
    } else {
      success = await createSpeaker(payload);
    }

    if (success) {
      setIsModalOpen(false);
    } else {
      setFormError(error || 'Failed to submit speaker data.');
    }
  };

  const handleDelete = async (id: number, spkName: string) => {
    if (window.confirm(`Are you sure you want to delete speaker "${spkName}"? All events hosted by this speaker will be deleted.`)) {
      await deleteSpeaker(id);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Pembicara</h1>
        <button onClick={openAddModal} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '24px', fontWeight: 600 }}>
          Tambah Pembicara
        </button>
      </div>

      {/* Main Grid */}
      {isLoading && speakers.length === 0 ? (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : speakers.length === 0 ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Users size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
          <p>Belum ada pembicara.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {speakers.map((spk) => (
            <div key={spk.id} className="glass-panel card-hover" style={{ 
              padding: '24px 20px', 
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}>
              
              {/* Avatar Circle */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 800,
                color: '#831843',
                marginBottom: '16px'
              }}>
                {(spk.nama || spk.name || '').charAt(0)}
              </div>
              
              {/* Info */}
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                {spk.nama || spk.name}
              </h3>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#831843', marginBottom: '8px' }}>
                {spk.gelar || spk.title}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.4' }}>
                {spk.bio}
              </div>

              {/* Actions */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => openEditModal(spk)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(spk.id, spk.nama || spk.name || '')} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
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
            maxWidth: '550px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                {editingSpeaker ? 'Modify Speaker Profile' : 'Onboard New Speaker'}
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
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"

                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  className="form-input"

                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"

                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Speaker Biography (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}

                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Form Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  {editingSpeaker ? 'Update Profile' : 'Register Speaker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
