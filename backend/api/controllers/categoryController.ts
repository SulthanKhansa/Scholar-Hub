import { Request, Response } from 'express';
import prisma from '../config/db.js';

// GET all categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.kategoriAcara.findMany({
      include: {
        _count: {
          select: { acara: true },
        },
      },
      orderBy: { id: 'asc' },
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};

// POST create category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { nama, deskripsi } = req.body;
  if (!nama) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }
  try {
    const newCategory = await prisma.kategoriAcara.create({
      data: { nama, deskripsi },
    });
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
};

// PUT update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { nama, deskripsi } = req.body;
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }
  if (!nama) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }
  try {
    const updatedCategory = await prisma.kategoriAcara.update({
      where: { id },
      data: { nama, deskripsi },
    });
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update category', details: error.message });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }
  try {
    await prisma.kategoriAcara.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete category', details: error.message });
  }
};
