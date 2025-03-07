import express from "express";
import {
  renderLogin,
  handleLogout,
  renderDashboard,
  renderAddDishForm,
  handleAddDish,
  renderEditDishForm,
  handleEditDish,
  handleDeleteDish,
  handleAddComment,
  handleEditComment,
  handleDeleteComment,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
} from "../controllers/dashboard.controller";
import multer from "multer";
import path from "path";
import { getUsers, registerUser } from "../controllers/user.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const dashboardRoutes = express.Router();
// Trang Login
dashboardRoutes.get("/login", renderLogin);
// Lấy danh sách người dùng
dashboardRoutes.get("/api/users", getUsers);
// Trang Register
dashboardRoutes.get("/register", (req, res) => {
  res.render("register");
});
dashboardRoutes.post("/api/users/register", async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    next(error);
  }
});
// Đăng xuất
dashboardRoutes.post("/logout", handleLogout);
// Trang Dashboard
dashboardRoutes.get("/", authenticate, renderDashboard);
// 🟢 Thêm món ăn
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads")); // Lưu ảnh vào thư mục uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đổi tên file tránh trùng lặp
  },
});
// Upload ảnh
const upload = multer({ storage });
dashboardRoutes.get(
  "/dishes/add",
  authenticate,
  checkRole("admin"),
  renderAddDishForm
);
dashboardRoutes.post(
  "/dishes/add",
  authenticate,
  checkRole("admin"),
  upload.single("image"),
  handleAddDish
);
// 🟠 Chỉnh sửa món ăn
dashboardRoutes.get(
  "/dishes/edit/:id",
  authenticate,
  checkRole("admin"),
  renderEditDishForm
);
dashboardRoutes.post(
  "/dishes/edit/:id",
  upload.single("image"),
  handleEditDish
);
// 🔴 Xoá món ăn
dashboardRoutes.post(
  "/dishes/delete/:id",
  authenticate,
  checkRole("admin"),
  handleDeleteDish
);
// 🟢 CRUD comment
dashboardRoutes.post("/comments/add/:dishId", handleAddComment);
export default dashboardRoutes;
dashboardRoutes.post("/comments/edit/:commentId", handleEditComment);
dashboardRoutes.post("/comments/delete/:commentId", handleDeleteComment);
// 🟢 CRUD category
dashboardRoutes.post(
  "/categories/add",
  authenticate,
  checkRole("admin"),
  handleAddCategory
);
dashboardRoutes.post(
  "/categories/edit/:categoryId",
  authenticate,
  checkRole("admin"),
  handleEditCategory
);
dashboardRoutes.post(
  "/categories/delete/:categoryId",
  authenticate,
  checkRole("admin"),
  handleDeleteCategory
);
