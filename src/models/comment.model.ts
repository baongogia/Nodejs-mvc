import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  dishId: mongoose.Types.ObjectId;
  author: string;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 🟢 Kiểm tra nếu model đã tồn tại trước khi tạo mới
const CommentSchema = new Schema<IComment>(
  {
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    author: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

export const CommentModel =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
