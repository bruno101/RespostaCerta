import mongoose, { Document, Schema, Model } from "mongoose";
import { Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  signedUpWithGoogle?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
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
    password: { type: String, required: false, select: false },
    signedUpWithGoogle: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Number, required: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");

export default User;
