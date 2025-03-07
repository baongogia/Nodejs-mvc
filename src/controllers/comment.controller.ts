import { Request, Response } from "express";
import { Dish } from "../models/dish.model";

export const getCommentsByDish = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findById(req.params.dishId);
    if (!dish) res.status(404).json({ error: "Dish not found" });
    res.json(dish?.comments);
  } catch (error) {
    res.status(500).json({ error: "Invalid Dish ID" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findById(req.params.dishId);
    if (!dish) res.status(404).json({ error: "Dish not found" });
    dish?.comments.push(req.body);
    await dish?.save();
    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { dishId, commentId } = req.params;
    const { rating, comment } = req.body;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      res.status(404).json({ error: "Dish not found" });
    } else {
      const commentIndex = dish.comments.findIndex(
        (c) => c._id?.toString() === commentId
      );
      if (commentIndex === -1) {
        res.status(404).json({ error: "Comment not found" });
      }

      // Cập nhật nội dung comment
      if (rating !== undefined) dish.comments[commentIndex].rating = rating;
      if (comment !== undefined) dish.comments[commentIndex].comment = comment;

      await dish.save();
      res.json({
        message: "Comment updated successfully",
        comment: dish.comments[commentIndex],
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findById(req.params.dishId);
    if (!dish) {
      res.status(404).json({ error: "Dish not found" });
    } else {
      dish.comments = dish.comments.filter(
        (c) => c._id?.toString() !== req.params.commentId
      );
      await dish.save();
      res.json({ message: "Comment deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Invalid ID format" });
  }
};
