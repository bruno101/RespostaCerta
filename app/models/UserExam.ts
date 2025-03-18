import mongoose, { Document, Schema, Model } from "mongoose";
import { Types } from "mongoose";
interface IUserExam extends Document {
  _id: Types.ObjectId;
  user: string;
  exam_id: Types.ObjectId;
  responses: string[];
  grades: number[];
  comments: string[];
}

const UserExamSchema = new Schema<IUserExam>(
  {
    user: { type: String, required: true },
    exam_id: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    responses: { type: [String], required: true },
    grades: { type: [Number], required: true },
    comments: { type: [String], required: true },
  },
  { timestamps: true }
);

UserExamSchema.index({ createdAt: -1 });

const UserExam: Model<IUserExam> =
  mongoose.models.UserExam ||
  mongoose.model<IUserExam>("UserExam", UserExamSchema, "user-exams");

export default UserExam;
