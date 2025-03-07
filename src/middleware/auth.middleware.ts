import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.config";

export interface AuthRequest extends Request {
  user?: { id: string; role: "admin" | "user" };
}
// 🛡 Middleware Xác thực (Authentication)
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Token not found" });
    return;
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY || "");
    req.user = payload as { id: string; role: "admin" | "user" };
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
// 🛡 Middleware Phân quyền (Authorization)
export const checkRole = (...roles: ("admin" | "user")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.send(`<script>
        alert("🚫 Bạn không có quyền truy cập!");
        window.location.href = "/";
      </script>`);
      return;
    }

    next();
  };
};
// 🛡 Middleware Phân quyền (Authorization)
export const authorize = (role: "admin" | "user") => {
  return function (req: AuthRequest, res: Response, next: NextFunction): void {
    if (req.user && req.user.role === role) {
      next();
      return;
    }
    res.status(403).json({ message: "Forbidden" });
  };
};
