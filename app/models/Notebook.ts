import mongoose, { Document, Schema, Model } from "mongoose";
import { Types } from "mongoose";
import { IQuestionSchema } from "./Question";
export interface INotebookSchema extends Document {
  _id: Types.ObjectId;
  title: string;
  user: string;
  questions: Types.ObjectId[] | IQuestionSchema[];
  currentQuestion: number;
}

const NotebookSchema = new Schema<INotebookSchema>(
  {
    title: { type: String, required: true, unique: true },
    user: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    currentQuestion: { type: Number, required: true },
  },
  { timestamps: true }
);

NotebookSchema.index({ createdAt: -1 });

const Notebook: Model<INotebookSchema> =
  mongoose.models.Notebook ||
  mongoose.model<INotebookSchema>("Notebook", NotebookSchema, "notebooks");

export default Notebook;
