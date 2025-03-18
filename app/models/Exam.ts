import mongoose, { Document, Schema, Model } from "mongoose";
import { Types } from "mongoose";
interface IExam extends Document {
  _id: Types.ObjectId;
  title: string;
  disciplina: string[];
  cargo: string;
  concurso: string;
  questions: {
    id: number;
    question: string;
    correctAnswer: string;
    timeLimit: number;
    points: number;
  }[];
}

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    timeLimit: { type: Number, required: true },
    points: { type: Number, required: true },
  },
  { _id: false } // Prevents auto-generating _id for each question object
);

const ExamSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    disciplina: { type: [String], required: true },
    cargo: { type: String, required: true },
    concurso: { type: String, required: true },
    questions: {
      type: [QuestionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

ExamSchema.index({ createdAt: -1 });

const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema, "exams");

export default Exam;
