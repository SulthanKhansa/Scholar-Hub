import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { CreateCategoryDto, UpdateCategoryDto } from '../types';

export const getAllCategories = async (_req: Request, res: Response) => {
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
};

export const createCategory = async (req: Request<{}, {}, CreateCategoryDto>, res: Response) => {
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
};

export const updateCategory = async (req: Request<{ id: string }, {}, UpdateCategoryDto>, res: Response) => {
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
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
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
};
