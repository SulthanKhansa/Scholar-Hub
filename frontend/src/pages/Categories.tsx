import React, { useEffect, useState } from 'react';
import { useDataStore, Category } from '../store/dataStore';
import { Edit2, Trash2, X, FolderCheck } from 'lucide-react';

export const Categories: React.FC = () => {
  const { 
    categories, 
    isLoading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useDataStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.nama || cat.name || '');
    setDescription(cat.deskripsi || cat.description || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category name is required');
      return;
    }

    const payload = { nama: name, deskripsi: description };
    let success = false;

    if (editingCategory) {
      success = await updateCategory(editingCategory.id, payload);
    } else {
      success = await createCategory(payload);
    }

    if (success) {
      setIsModalOpen(false);
    } else {
      setFormError(error || 'An error occurred during submission.');
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"? This will delete all associated events.`)) {
      await deleteCategory(id);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Kategori Event</h1>
        <button onClick={openAddModal} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '24px', fontWeight: 600 }}>
          Tambah Kategori
        </button>
      </div>

      {/* Main Grid */}
      {isLoading && categories.length === 0 ? (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : categories.length === 0 ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <FolderCheck size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
          <p>Belum ada kategori.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {categories.map((cat) => (
            <div key={cat.id} className="glass-panel card-hover" style={{ 
              display: 'flex', 
              padding: '20px', 
              gap: '16px', 
              borderRadius: '16px',
              position: 'relative'
            }}>
              {/* Image Placeholder */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--primary)',
                fontSize: '32px',
                fontWeight: 800
              }}>
                {(cat.nama || cat.name || '').charAt(0)}
              </div>
              
              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  {cat.nama || cat.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {cat.deskripsi || cat.description || `${cat.nama || cat.name} adalah kompetisi atau acara yang bertujuan untuk meningkatkan keahlian peserta di bidang ini.`}
                </p>
                
                {/* Actions (Hidden by default, shown on hover if needed, or just small icons) */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '12px' }}>
                  <button onClick={() => openEditModal(cat)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.nama || cat.name || '')} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
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
            maxWidth: '500px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                {editingCategory ? 'Modify Category Label' : 'Add Category Label'}
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
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"

                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={4}

                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Form Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
