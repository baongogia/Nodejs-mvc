import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Dish } from "../models/dish.model";
import { IComment } from "../models/comment.model";
import mongoose from "mongoose";
import { CategoryModel } from "../models/category.model";
import { User } from "../models/user.model";

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}
//  🟢 Hiển thị trang login
export const renderLogin = (req: Request, res: Response) => {
  res.render("login", { error: null });
};
// 🟢 Đăng kí người dùng
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Tên đăng nhập đã tồn tại!" });
    }

    // Kiểm tra role hợp lệ
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Vai trò không hợp lệ!" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới với role
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi đăng ký tài khoản." });
  }
};
// 🟢 Đăng xuất
export const handleLogout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/dashboard/login");
  });
};
// 🟢 Hiển thị trang dashboard
export const renderDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Dish.find({}).populate("category"); // 🟢 Lấy danh sách sản phẩm (món ăn)
    const categories = await CategoryModel.find({}); // 🟢 Lấy danh sách danh mục
    res.render("dashboard", { user: req.user, products, categories }); // 🟢 Truyền products vào view
  } catch (error) {
    console.error("❌ Lỗi khi tải dashboard:", error);
    res.status(500).send("Không thể tải dashboard.");
  }
};
// 🟢 Hiển thị form thêm món ăn
export const renderAddDishForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await CategoryModel.find({}); // 🟢 Lấy danh sách category từ database
    res.render("addDish", { categories }); // 🟢 Truyền categories vào view
  } catch (error) {
    console.error("❌ Lỗi khi tải danh mục:", error);
    res.status(500).send("Không thể tải danh mục.");
  }
};
// 🟢 Xử lý thêm món ăn
export const handleAddDish = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !category) {
      res.status(400).send("Thiếu thông tin quan trọng!");
      return;
    }

    // Kiểm tra category có tồn tại không
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      res.status(400).send("Danh mục không hợp lệ!");
      return;
    }

    const newDish = new Dish({
      name,
      price,
      description,
      category, // 🟢 Lưu category vào món ăn
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newDish.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi thêm món ăn:", error);
    res.status(500).send("Lỗi khi thêm món ăn.");
  }
};
// 🟠 Hiển thị form chỉnh sửa món ăn
export const renderEditDishForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      res.status(404).send("Không tìm thấy món ăn");
      return;
    }
    const categories = await CategoryModel.find({});
    res.render("editDish", { dish, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi khi tải dữ liệu món ăn.");
  }
};
// 🟠 Xử lý chỉnh sửa món ăn
export const handleEditDish = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, description, category } = req.body; // 🟢 Lấy thêm category từ req.body
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      res.status(404).send("Món ăn không tồn tại");
      return;
    }

    if (req.file) {
      dish.image = `/uploads/${req.file.filename}`;
    }

    dish.name = name;
    dish.price = price;
    dish.description = description;
    dish.category = category; // 🟢 Cập nhật category mới
    await dish.save();

    console.log("✅ Cập nhật món ăn thành công:", {
      id: dish._id,
      name,
      price,
      description,
      category,
      image: dish.image,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi chỉnh sửa món ăn:", error);
    res.status(500).send("Lỗi khi chỉnh sửa món ăn.");
  }
};
// 🔴 Xử lý xoá món ăn
export const handleDeleteDish = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      res.status(404).send("Món ăn không tồn tại");
      return;
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi khi xoá món ăn.");
  }
};
// 🟢 Thêm bình luận
export const handleAddComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { author, comment, rating } = req.body;
    if (!author || !comment || !rating) {
      res.status(400).send("Vui lòng điền đầy đủ thông tin bình luận.");
      return;
    }
    const dish = await Dish.findById(req.params.dishId);
    if (!dish) {
      res.status(404).send("Không tìm thấy món ăn");
      return;
    }
    // 🟢 Tạo comment mới theo schema
    const newComment = {
      author,
      comment,
      rating: parseInt(rating, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dish.comments.push(newComment as IComment);
    await dish.save();
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Lỗi khi thêm bình luận.");
  }
};
// 🟢 Chỉnh sửa bình luận
export const handleEditComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📌 Dữ liệu cập nhật bình luận:", req.body);

    const { author, comment, rating } = req.body;

    if (!author || !comment || !rating) {
      console.error("❌ Thiếu dữ liệu! Dữ liệu nhận được:", {
        author,
        comment,
        rating,
      });
      res.status(400).send("Vui lòng điền đầy đủ thông tin bình luận.");
      return;
    }

    const dish = await Dish.findOne({ "comments._id": req.params.commentId });

    if (!dish) {
      res.status(404).send("Không tìm thấy món ăn chứa bình luận này.");
      return;
    }

    const commentToUpdate = dish.comments.find(
      (comment) =>
        (comment._id as mongoose.Types.ObjectId).toString() ===
        req.params.commentId
    );
    if (!commentToUpdate) {
      res.status(404).send("Không tìm thấy bình luận.");
      return;
    }

    commentToUpdate.author = author;
    commentToUpdate.comment = comment;
    commentToUpdate.rating = parseInt(rating, 10);

    await dish.save();

    console.log("✅ Cập nhật bình luận thành công:", commentToUpdate);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi chỉnh sửa bình luận:", error);
    res.status(500).send("Lỗi khi chỉnh sửa bình luận.");
  }
};
// 🔴 Xoá bình luận
export const handleDeleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dish = await Dish.findOne({ "comments._id": req.params.commentId });

    if (!dish) {
      res.status(404).send("Không tìm thấy món ăn chứa bình luận này.");
      return;
    }

    dish.comments = dish.comments.filter(
      (comment) =>
        (comment._id as mongoose.Types.ObjectId).toString() !==
        req.params.commentId
    );

    await dish.save();

    console.log("✅ Xóa bình luận thành công:", req.params.commentId);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi xóa bình luận:", error);
    res.status(500).send("Lỗi khi xóa bình luận.");
  }
};
// 🟢 Thêm category
export const handleAddCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📌 Dữ liệu nhận từ form:", req.body);

    const { name, description } = req.body;

    if (!name || !description) {
      console.error("❌ Thiếu dữ liệu! Phải có cả tên và mô tả.");
      res.status(400).send("Tên và mô tả không được để trống.");
      return;
    }

    // 🟢 Tạo category với createdUserID là ID của Admin/User (tạm thời hardcode)
    const newCategory = new CategoryModel({
      name,
      description,
      createdUserID: new mongoose.Types.ObjectId("65f8e123abcde123456789ab"), // 🟢 Thay thế bằng ID của user thực tế
    });

    await newCategory.save();
    console.log("✅ Thêm category thành công:", newCategory);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi thêm Category:", error);
    res.status(500).send("Lỗi khi thêm Category.");
  }
};
// 🟠 Chỉnh sửa category
export const handleEditCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      console.error("❌ Thiếu dữ liệu! Phải có cả tên và mô tả.");
      res.status(400).send("Tên và mô tả không được để trống.");
      return;
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      res.status(404).send("Không tìm thấy category.");
      return;
    }

    console.log("✅ Cập nhật category thành công:", updatedCategory);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi chỉnh sửa Category:", error);
    res.status(500).send("Lỗi khi chỉnh sửa Category.");
  }
};
// 🔴 Xoá category
export const handleDeleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await CategoryModel.findByIdAndDelete(req.params.categoryId);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Lỗi khi xóa Category:", error);
    res.status(500).send("Lỗi khi xóa Category.");
  }
};
