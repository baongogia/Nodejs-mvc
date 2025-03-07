import { Request, Response } from "express";
import { Dish } from "../models/dish.model";
import mongoose from "mongoose";

export const getDishes = async (req: Request, res: Response) => {
  try {
    const dishes = await Dish.find({});
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createDish = async (req: Request, res: Response) => {
  try {
    const newDish = await Dish.create(req.body);
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

export const updateDish = async (req: Request, res: Response) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedDish) res.status(404).json({ error: "Dish not found" });
    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ error: "Invalid ID format" });
  }
};

export const deleteDish = async (req: Request, res: Response) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) res.status(404).json({ error: "Dish not found" });
    res.json(deletedDish);
  } catch (error) {
    res.status(500).json({ error: "Invalid ID format" });
  }
};
