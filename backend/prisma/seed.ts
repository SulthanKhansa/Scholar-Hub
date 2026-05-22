import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Hapus data yang ada
  await prisma.acara.deleteMany({});
  await prisma.pembicara.deleteMany({});
  await prisma.kategoriAcara.deleteMany({});

  // 2. Buat Kategori Acara
  const kat1 = await prisma.kategoriAcara.create({
    data: {
      nama: 'Seminar Akademik',
      deskripsi: 'Seminar skala besar dengan pembicara terkemuka dari industri dan akademisi.',
    },
  });

  const kat2 = await prisma.kategoriAcara.create({
    data: {
      nama: 'Beasiswa & Karir',
      deskripsi: 'Workshop tentang persiapan beasiswa, studi lanjut, dan pengembangan karir.',
    },
  });

  const kat3 = await prisma.kategoriAcara.create({
    data: {
      nama: 'Workshop Praktis',
      deskripsi: 'Pelatihan hands-on untuk mengembangkan keterampilan teknis mahasiswa.',
    },
  });

  const kat4 = await prisma.kategoriAcara.create({
    data: {
      nama: 'Konferensi Mahasiswa',
      deskripsi: 'Presentasi penelitian, showcase proyek, dan diskusi panel oleh mahasiswa.',
    },
  });

  console.log('Kategori Acara dibuat:', [kat1, kat2, kat3, kat4].map(c => c.nama));

  // 3. Buat Pembicara
  const pb1 = await prisma.pembicara.create({
    data: {
      nama: 'Prof. Dr. Ir. Budi Santoso, M.Eng.',
      gelar: 'Profesor Teknik Mesin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Peneliti terkemuka di bidang material pintar, sering mewakili universitas di simposium internasional.',
    },
  });

  const pb2 = await prisma.pembicara.create({
    data: {
      nama: 'Nadia Salsabila, LL.M.',
      gelar: 'Alumni Beasiswa Oxford',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Lulusan berprestasi yang aktif berbagi strategi lolos wawancara beasiswa internasional.',
    },
  });

  const pb3 = await prisma.pembicara.create({
    data: {
      nama: 'Faisal Rahman, M.S.',
      gelar: 'Kepala Lab Ilmu Komputer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Ahli data science yang membimbing mahasiswa untuk skripsi dan kompetisi pemrograman nasional.',
    },
  });

  console.log('Pembicara dibuat:', [pb1, pb2, pb3].map(s => s.nama));

  // 4. Buat Acara
  const ac1 = await prisma.acara.create({
    data: {
      judul: 'Seminar Nasional: Riset Teknologi di Era Society 5.0',
      deskripsi: 'Acara wajib dihadiri mahasiswa akhir. Diskusi tentang cara merancang topik skripsi inovatif yang kompetitif global. Termasuk sesi tanya jawab langsung dengan pembicara.',
      tanggal: new Date('2026-06-10T08:30:00Z'),
      lokasi: 'Auditorium Rektorat Utama',
      kategoriId: kat1.id,
      pembicaraId: pb1.id,
    },
  });

  const ac2 = await prisma.acara.create({
    data: {
      judul: 'Panduan Beasiswa: Masuk Ivy League Jadi Mudah',
      deskripsi: 'Bermimpi kuliah gratis di luar negeri? Pembicara akan berbagi rahasia menulis motivation letter yang disukai komite seleksi. Terbuka untuk semua jurusan.',
      tanggal: new Date('2026-06-15T13:00:00Z'),
      lokasi: 'Ruang Seminar Perpustakaan, Lantai 2',
      kategoriId: kat2.id,
      pembicaraId: pb2.id,
    },
  });

  const ac3 = await prisma.acara.create({
    data: {
      judul: 'Workshop Analisis Data dengan Python untuk Penelitian',
      deskripsi: 'Berhenti memproses data skripsi secara manual! Ikuti workshop hands-on ini untuk belajar memproses ribuan dataset dalam hitungan detik. Bawa laptop dengan Python terinstal.',
      tanggal: new Date('2026-06-25T09:00:00Z'),
      lokasi: 'Laboratorium Komputer Terpadu (Lab 1)',
      kategoriId: kat3.id,
      pembicaraId: pb3.id,
    },
  });

  console.log('Acara dibuat:', [ac1, ac2, ac3].map(e => e.judul));
  console.log('Seeding berhasil!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
