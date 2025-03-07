import mongoose, { Document, Schema, Model } from "mongoose";
import { Types } from "mongoose";

interface IQuestion extends Document {
  _id: Types.ObjectId;
  Disciplina: string;
  Banca: string;
  Ano: string;
  Nivel: string;
  Instituicao: string;
  Cargo: string;
  TextoMotivador: string;
  Questao: string;
  Criterios: string;
  Resposta: string;
  EmailCriador: string;
  TextoPlano: string;
  Dificuldade: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    Disciplina: { type: String, required: true },
    Banca: { type: String, required: true },
    Ano: { type: String, required: true },
    Nivel: { type: String, required: true },
    Instituicao: { type: String, required: true },
    Cargo: { type: String, required: true },
    TextoMotivador: { type: String, required: false },
    Questao: { type: String, required: true },
    Criterios: { type: String, required: false },
    Resposta: { type: String, required: false },
    EmailCriador: { type: String, required: false, select: false },
    TextoPlano: {type: String, required: true},
    Dificuldade: {type: String, required: true}
  },
  { timestamps: true }
);

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema, "questions");

export default Question;
