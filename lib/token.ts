// lib/token.ts
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./mongoose";
import User from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const JWT_EXPIRES_IN = "30d"; // Token expires in 30 days

export const generateToken = (email: string) => {
  return jwt.sign({ email: email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    await connectToDatabase();
    const user = await User.findOne({ email: decoded.email });
    return user;
  } catch (error) {
    return null;
  }
};
