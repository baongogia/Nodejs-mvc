import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3008;
export const SECRET_KEY = process.env.JWT_SECRET || "686868";
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dishesdb";
