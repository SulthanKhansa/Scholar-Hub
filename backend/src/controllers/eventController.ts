import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { CreateEventDto, UpdateEventDto } from '../types';

export const getAllEvents = async (_req: Request, res: Response) => {
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

export const createEvent = async (req: Request<{}, {}, CreateEventDto>, res: Response) => {
  const { judul, deskripsi, tanggal, lokasi, kategoriId, pembicaraId } = req.body;
  if (!judul || !deskripsi || !tanggal || !lokasi || !kategoriId || !pembicaraId) {
    return res.status(400).json({ error: 'All event fields are required' });
  }

  const parsedCatId = parseInt(String(kategoriId));
  const parsedSpkId = parseInt(String(pembicaraId));

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
};

export const updateEvent = async (req: Request<{ id: string }, {}, UpdateEventDto>, res: Response) => {
  const id = parseInt(req.params.id);
  const { judul, deskripsi, tanggal, lokasi, kategoriId, pembicaraId } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  if (!judul || !deskripsi || !tanggal || !lokasi || !kategoriId || !pembicaraId) {
    return res.status(400).json({ error: 'All event fields are required' });
  }

  const parsedCatId = parseInt(String(kategoriId));
  const parsedSpkId = parseInt(String(pembicaraId));

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
};

export const deleteEvent = async (req: Request<{ id: string }>, res: Response) => {
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
};
