import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  createdUserID: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true }, // 🟢 Trường bắt buộc
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // 🟢 Trường bắt buộc
  },
  { timestamps: true }
);

export const CategoryModel =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
