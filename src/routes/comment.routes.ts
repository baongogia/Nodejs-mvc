import express from "express";
import {
  getCommentsByDish,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:dishId/comments", getCommentsByDish);
router.post("/:dishId/comments", authenticate, createComment);
router.put("/:dishId/comments/:commentId", authenticate, updateComment);
router.delete("/:dishId/comments/:commentId", authenticate, deleteComment);

export default router;
