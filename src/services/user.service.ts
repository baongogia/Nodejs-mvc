import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const createUser = async (
  username: string,
  password: string,
  role: "user" | "admin"
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });
  return await newUser.save();
};

export const findUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};
