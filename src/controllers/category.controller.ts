import { Request, Response } from "express";
import { CategoryModel } from "../models/category.model";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: "admin" | "user" };
    }
  }
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find({}).populate(
      "createdUserID",
      "username role"
    );
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const createdUserID = req.user?.id;
    const newCategory = new CategoryModel({ name, description, createdUserID });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: "Error creating category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updatedCat = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCat) res.status(404).json({ error: "Category not found" });
    res.json(updatedCat);
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deletedCat = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCat) res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};
