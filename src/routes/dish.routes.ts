import express from "express";
import {
  getDishes,
  createDish,
  updateDish,
  deleteDish,
} from "../controllers/dish.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { getCommentsByDish } from "../controllers/comment.controller";

const router = express.Router();

router.get("/", getDishes);
router.get("/:dishId/comments", getCommentsByDish);

router.post("/", authenticate, authorize("admin"), createDish);
router.put("/:id", authenticate, authorize("admin"), updateDish);
router.delete("/:id", authenticate, authorize("admin"), deleteDish);

export default router;
