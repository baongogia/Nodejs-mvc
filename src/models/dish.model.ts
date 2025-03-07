import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  rating: number;
  comment: string;
  author: string;
}

interface IDish extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  comments: IComment[];
}

const CommentSchema = new Schema<IComment>(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const DishSchema = new Schema<IDish>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    comments: [CommentSchema],
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const Dish = mongoose.model<IDish>("Dish", DishSchema);
export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
