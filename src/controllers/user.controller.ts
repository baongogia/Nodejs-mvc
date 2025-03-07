import { Request, Response, RequestHandler, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { SECRET_KEY } from "../config/env.config";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    if (!["user", "admin"].includes(role)) {
      res.status(400).json({
        error: "Vai trò không hợp lệ! Chỉ chấp nhận 'user' hoặc 'admin'.",
      });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Tên đăng nhập đã tồn tại!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký tài khoản:", error);
    res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại sau!" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    // 🟢 Tạo token chứa ID & Role
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // 🟢 Lưu token vào cookie
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.username, role: user.role },
    }); // 🟢 Trả về user
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // 🟢 Truy vấn tất cả user nhưng loại bỏ mật khẩu
    const users = await User.find().select("-password");

    res.json({ success: true, users });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại sau!" });
  }
};
