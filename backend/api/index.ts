import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Test database connection
prisma.$connect()
  .then(() => console.log('[Prisma] Database connected successfully'))
  .catch((err) => {
    console.error('[Prisma] Database connection failed:', err.message);
    process.exit(1);
  });

// Middleware
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Status Check
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Kategori Acara CRUD endpoints

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.kategoriAcara.findMany({
      include: {
        _count: {
          select: { acara: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// POST create category
app.post('/api/categories', async (req, res) => {
  const { nama, deskripsi } = req.body;
  if (!nama) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  try {
    const newCategory = await prisma.kategoriAcara.create({
      data: { nama, deskripsi }
    });
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
});

// PUT update category
app.put('/api/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, deskripsi } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  if (!nama) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  try {
    const updatedCategory = await prisma.kategoriAcara.update({
      where: { id },
      data: { nama, deskripsi }
    });
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update category', details: error.message });
  }
});

// DELETE category
app.delete('/api/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    await prisma.kategoriAcara.delete({
      where: { id }
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete category', details: error.message });
  }
});

// Pembicara (speaker) CRUD endpoints

// GET all speakers
app.get('/api/speakers', async (req, res) => {
  try {
    const speakers = await prisma.pembicara.findMany({
      include: {
        _count: {
          select: { acara: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    res.json(speakers);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch speakers', details: error.message });
  }
});

// POST create speaker
app.post('/api/speakers', async (req, res) => {
  const { nama, gelar, avatar, bio } = req.body;
  if (!nama || !gelar) {
    return res.status(400).json({ error: 'Name and title are required' });
  }
  try {
    const newSpeaker = await prisma.pembicara.create({
      data: { nama, gelar, avatar, bio }
    });
    res.status(201).json(newSpeaker);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create speaker', details: error.message });
  }
});

// PUT update speaker
app.put('/api/speakers/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, gelar, avatar, bio } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  if (!nama || !gelar) {
    return res.status(400).json({ error: 'Name and title are required' });
  }
  try {
    const updatedSpeaker = await prisma.pembicara.update({
      where: { id },
      data: { nama, gelar, avatar, bio }
    });
    res.json(updatedSpeaker);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update speaker', details: error.message });
  }
});

// DELETE speaker
app.delete('/api/speakers/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    await prisma.pembicara.delete({
      where: { id }
    });
    res.json({ message: 'Speaker deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete speaker', details: error.message });
  }
});

// Acara CRUD endpoints

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.acara.findMany({
      include: {
        kategori: true,
        pembicara: true,
      },
      orderBy: { tanggal: 'asc' },
    });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
});

// POST create event
app.post('/api/events', async (req, res) => {
  const { judul, deskripsi, tanggal, lokasi, kategoriId, pembicaraId } = req.body;
  if (!judul || !deskripsi || !tanggal || !lokasi || !kategoriId || !pembicaraId) {
    return res.status(400).json({ error: 'All event fields are required' });
  }

  const parsedCatId = parseInt(kategoriId);
  const parsedSpkId = parseInt(pembicaraId);

  if (isNaN(parsedCatId) || isNaN(parsedSpkId)) {
    return res.status(400).json({ error: 'Category ID and Speaker ID must be valid numbers' });
  }

  try {
    // Validate relations exist
    const categoryExists = await prisma.kategoriAcara.findUnique({ where: { id: parsedCatId } });
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const speakerExists = await prisma.pembicara.findUnique({ where: { id: parsedSpkId } });
    if (!speakerExists) {
      return res.status(404).json({ error: 'Speaker not found' });
    }

    const newEvent = await prisma.acara.create({
      data: {
        judul,
        deskripsi,
        tanggal: new Date(tanggal),
        lokasi,
        kategoriId: parsedCatId,
        pembicaraId: parsedSpkId,
      },
      include: {
        kategori: true,
        pembicara: true,
      },
    });

    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
});

// PUT update event
app.put('/api/events/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { judul, deskripsi, tanggal, lokasi, kategoriId, pembicaraId } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  if (!judul || !deskripsi || !tanggal || !lokasi || !kategoriId || !pembicaraId) {
    return res.status(400).json({ error: 'All event fields are required' });
  }

  const parsedCatId = parseInt(kategoriId);
  const parsedSpkId = parseInt(pembicaraId);

  if (isNaN(parsedCatId) || isNaN(parsedSpkId)) {
    return res.status(400).json({ error: 'Category ID and Speaker ID must be valid numbers' });
  }

  try {
    // Validate relations exist
    const categoryExists = await prisma.kategoriAcara.findUnique({ where: { id: parsedCatId } });
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const speakerExists = await prisma.pembicara.findUnique({ where: { id: parsedSpkId } });
    if (!speakerExists) {
      return res.status(404).json({ error: 'Speaker not found' });
    }

    const updatedEvent = await prisma.acara.update({
      where: { id },
      data: {
        judul,
        deskripsi,
        tanggal: new Date(tanggal),
        lokasi,
        kategoriId: parsedCatId,
        pembicaraId: parsedSpkId,
      },
      include: {
        kategori: true,
        pembicara: true,
      },
    });

    res.json(updatedEvent);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    await prisma.acara.delete({
      where: { id }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Root Endpoint for Health Checks (Railway often pings /)
app.get('/', (req, res) => {
  res.send('Backend API is running. Go to /api/status for more info.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Express] Backend API running on port ${PORT} host 0.0.0.0`);
});

// Export app instance (used as serverless function)
export default app;
