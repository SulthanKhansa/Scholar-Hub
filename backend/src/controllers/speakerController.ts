import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { CreateSpeakerDto, UpdateSpeakerDto } from '../types';

export const getAllSpeakers = async (_req: Request, res: Response) => {
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
};

export const createSpeaker = async (req: Request<{}, {}, CreateSpeakerDto>, res: Response) => {
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
};

export const updateSpeaker = async (req: Request<{ id: string }, {}, UpdateSpeakerDto>, res: Response) => {
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
};

export const deleteSpeaker = async (req: Request<{ id: string }>, res: Response) => {
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
};
