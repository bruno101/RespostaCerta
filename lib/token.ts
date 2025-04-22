// lib/token.ts
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./mongoose";
import User from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const generateToken = (email: string) => {
  return jwt.sign({ email: email }, JWT_SECRET, {
    expiresIn: "15m", // Short-lived access token (15 minutes)
  });
};

// Generate refresh token with longer expiration
export const generateRefreshToken = (email: string) => {
  return jwt.sign({ email: email }, JWT_SECRET, {
    expiresIn: "30d", // Refresh token valid for 30 days
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
