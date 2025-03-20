import mongoose, { Document, Schema, Model } from "mongoose";
import { Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  imageKey?: string;
  password: string;
  role: "user" | "admin" | "corretor";
  createdAt: Date;
  updatedAt: Date;
  signedUpWithGoogle?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  verified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: number;
  subscription: "free" | "premium";
  customerId?: string;
  subscriptionId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    image: { type: String, required: false },
    imageKey: { type: String, required: false },
    password: { type: String, required: false, select: false },
    role: {
      type: String,
      enum: ["user", "admin", "corretor"],
      default: "user",
    },
    signedUpWithGoogle: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Number, required: false },
    verified: { type: Boolean, required: true },
    verifyToken: { type: String, required: false },
    verifyTokenExpiry: { type: Number, required: false },
    subscription: { type: String, enum: ["free", "premium"], default: "free" },
    subscriptionId: { type: String, required: false },
    customerId: { type: String, required: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");

export default User;
