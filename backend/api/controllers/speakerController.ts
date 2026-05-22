import { Request, Response } from 'express';
import prisma from '../config/db.js';

// GET all speakers
export const getSpeakers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const speakers = await prisma.pembicara.findMany({
      include: {
        _count: {
          select: { acara: true },
        },
      },
      orderBy: { id: 'asc' },
    });
    res.json(speakers);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch speakers', details: error.message });
  }
};

// POST create speaker
export const createSpeaker = async (req: Request, res: Response): Promise<void> => {
  const { nama, gelar, avatar, bio } = req.body;
  if (!nama || !gelar) {
    res.status(400).json({ error: 'Name and title are required' });
    return;
  }
  try {
    const newSpeaker = await prisma.pembicara.create({
      data: { nama, gelar, avatar, bio },
    });
    res.status(201).json(newSpeaker);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create speaker', details: error.message });
  }
};

// PUT update speaker
export const updateSpeaker = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { nama, gelar, avatar, bio } = req.body;
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }
  if (!nama || !gelar) {
    res.status(400).json({ error: 'Name and title are required' });
    return;
  }
  try {
    const updatedSpeaker = await prisma.pembicara.update({
      where: { id },
      data: { nama, gelar, avatar, bio },
    });
    res.json(updatedSpeaker);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update speaker', details: error.message });
  }
};

// DELETE speaker
export const deleteSpeaker = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }
  try {
    await prisma.pembicara.delete({ where: { id } });
    res.json({ message: 'Speaker deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete speaker', details: error.message });
  }
};
