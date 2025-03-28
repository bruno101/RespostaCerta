import mongoose, { Document, Schema, Model, ObjectId } from "mongoose";
import { Types } from "mongoose";

export interface IQuestionStageSchema extends Document {
  _id: ObjectId;
  Disciplina: string;
  Banca: string;
  Ano: string;
  Nivel: string;
  Instituicao: string;
  Cargos: string[];
  Link: string;
  Numero: number;
  TextoMotivador: string;
  Questao: string;
  Criterios: string;
  Resposta: string;
  EmailCriador: string;
  TextoPlano: string;
  Dificuldade: string;
  NotaMaxima?: string;
}

const QuestionStageSchema = new Schema<IQuestionStageSchema>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    Disciplina: { type: String, required: true },
    Banca: { type: String, required: true },
    Ano: { type: String, required: true },
    Nivel: { type: String, required: true },
    Instituicao: { type: String, required: true },
    Cargos: { type: [String], required: true },
    Link: { type: String, required: true },
    Numero: { type: Number, required: false },
    TextoMotivador: { type: String, required: false },
    Questao: { type: String, required: true },
    Criterios: { type: String, required: false },
    Resposta: { type: String, required: false },
    EmailCriador: { type: String, required: false, select: false },
    TextoPlano: { type: String, required: true },
    Dificuldade: { type: String, required: true },
    NotaMaxima: { type: Number, required: false },
  },
  { timestamps: true }
);

QuestionStageSchema.index({ createdAt: -1 });

const QuestionStage: Model<IQuestionStageSchema> =
  mongoose.models.QuestionStage ||
  mongoose.model<IQuestionStageSchema>(
    "QuestionStage",
    QuestionStageSchema,
    "questionStages"
  );

export default QuestionStage;
