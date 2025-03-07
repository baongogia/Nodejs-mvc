import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes";
import dishRoutes from "./routes/dish.routes";
import categoryRoutes from "./routes/category.routes";
import commentRoutes from "./routes/comment.routes";
import { MONGO_URI, PORT, SECRET_KEY } from "./config/env.config";
import session from "express-session";
import path from "path";
import dashboardRoutes from "./routes/dashboard.routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Cấu hình EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:3008",
    credentials: true,
  })
);
// Cấu hình Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
// Kết nối MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Sử dụng các routes
app.use("/", dashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/api/users", userRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/dashboard", dashboardRoutes);
