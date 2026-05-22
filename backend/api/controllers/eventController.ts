import { Request, Response } from 'express';
import prisma from '../config/db.js';

// GET all events
export const getEvents = async (_req: Request, res: Response): Promise<void> => {
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
};

// POST create event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { judul, deskripsi, tanggal, lokasi, kategoriId, pembicaraId } = req.body;
  if (!judul || !deskripsi || !tanggal || !lokasi || !kategoriId || !pembicaraId) {
    res.status(400).json({ error: 'All event fields are required' });
    return;
  }

  const parsedCatId = parseInt(kategoriId);
  const parsedSpkId = parseInt(pembicaraId);

  if (isNaN(parsedCatId) || isNaN(parsedSpkId)) {
    res.status(400).json({ error: 'Category ID and Speaker ID must be valid numbers' });
    return;
  }

  try {
    const categoryExists = await prisma.kategoriAcara.findUnique({ where: { id: parsedCatId } });
    if (!categoryExists) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const speakerExists = await prisma.pembicara.findUnique({ where: { id: parsedSpkId } });
    if (!speakerExists) {
      res.status(404).json({ error: 'Speaker not found' });
      return;
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
};

// PUT update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { judul, deskripsi, tanggal, lokasi, kategoriId, pembicaraId } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }
  if (!judul || !deskripsi || !tanggal || !lokasi || !kategoriId || !pembicaraId) {
    res.status(400).json({ error: 'All event fields are required' });
    return;
  }

  const parsedCatId = parseInt(kategoriId);
  const parsedSpkId = parseInt(pembicaraId);

  if (isNaN(parsedCatId) || isNaN(parsedSpkId)) {
    res.status(400).json({ error: 'Category ID and Speaker ID must be valid numbers' });
    return;
  }

  try {
    const categoryExists = await prisma.kategoriAcara.findUnique({ where: { id: parsedCatId } });
    if (!categoryExists) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const speakerExists = await prisma.pembicara.findUnique({ where: { id: parsedSpkId } });
    if (!speakerExists) {
      res.status(404).json({ error: 'Speaker not found' });
      return;
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
};

// DELETE event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }
  try {
    await prisma.acara.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
};
