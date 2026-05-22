import React from 'react';
import { Github } from 'lucide-react';

export const Biodata: React.FC = () => {
  const developerInfo = {
    name: 'Sulthan Khansa',
    nim: '25092001',
    prodi: 'D-4 Teknik Informatika',
    kelas: 'TI-4A',
    mataKuliah: 'Pemrograman Web 2',
    dosen: 'Jamal Apriadi, S.Kom.',
    kampus: 'Universitas Harkat Negeri',
    alamat: 'Jl. Mataram No. 9, Kota Tegal',
    avatar: '/images/profile.jpeg',
    bio: 'Mahasiswa berprestasi yang berfokus pada pengembangan aplikasi web full-stack modern. Tertarik dalam membuat solusi teknologi yang berdampak untuk dunia pendidikan.',
    skills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Prisma ORM', 'Zustand', 'PostgreSQL', 'MySQL', 'MongoDB', 'RESTful API', 'Git & GitHub', 'TailwindCSS'],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '40px', color: '#334155' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '32px', marginBottom: '32px', alignItems: 'center' }}>
        <img 
          src={developerInfo.avatar} 
          alt={developerInfo.name} 
          style={{ width: '120px', height: '120px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>{developerInfo.name}</h1>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#64748b' }}>{developerInfo.nim} • {developerInfo.prodi}</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://github.com/SulthanKhansa" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <Github size={16}/> GitHub
            </a>
          </div>
        </div>
      </div>

      {/* About */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Profil Singkat</h2>
        <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px' }}>{developerInfo.bio}</p>
      </div>

      {/* Academic Info */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Informasi Akademik</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mata Kuliah</div>
            <div style={{ fontWeight: 500, color: '#1e293b' }}>{developerInfo.mataKuliah}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dosen Pengampu</div>
            <div style={{ fontWeight: 500, color: '#1e293b' }}>{developerInfo.dosen}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kampus</div>
            <div style={{ fontWeight: 500, color: '#1e293b' }}>{developerInfo.kampus}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kelas</div>
            <div style={{ fontWeight: 500, color: '#1e293b' }}>{developerInfo.kelas}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
