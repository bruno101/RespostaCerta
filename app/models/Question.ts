import mongoose, { Document, Schema, Model, ObjectId } from "mongoose";

export interface IQuestionSchema extends Document {
  _id: ObjectId;
  Disciplina: string;
  Banca: string;
  Ano: string;
  Nivel: string;
  Instituicao: string;
  Cargos: string[];
  Numero: number;
  TextoMotivador: string;
  Questao: string;
  Criterios: string;
  Resposta: string;
  EmailCriador: string;
  TextoPlano: string;
  Dificuldade: string;
  NotaMaxima?: string;
  Embedding?: number[];
  EmbeddingModel?: string;
  SubjectEmbedding?: number[];
  SubjectEmbeddingModel?: string;
  CargoEmbedding?: number[];
  CargoEmbeddingModel?: string;
  Types?: string[];
  TypeModel?: string;
}

const QuestionSchema = new Schema<IQuestionSchema>(
  {
    Disciplina: { type: String, required: true },
    Banca: { type: String, required: true },
    Ano: { type: String, required: true },
    Nivel: { type: String, required: true },
    Instituicao: { type: String, required: true },
    Cargos: { type: [String], required: true },
    Numero: { type: Number, required: false },
    TextoMotivador: { type: String, required: false },
    Questao: { type: String, required: true },
    Criterios: { type: String, required: false },
    Resposta: { type: String, required: false },
    EmailCriador: { type: String, required: false, select: false },
    TextoPlano: { type: String, required: true },
    Dificuldade: { type: String, required: true },
    NotaMaxima: { type: Number, required: false },
    Embedding: { type: [Number] },
    EmbeddingModel: { type: String },
    SubjectEmbedding: { type: [Number] },
    SubjectEmbeddingModel: { type: String },
    CargoEmbedding: { type: [Number] },
    CargoEmbeddingModel: { type: String },
    Types: { type: [String] },
    TypeModel: { type: String },
  },
  { timestamps: true }
);

QuestionSchema.index({ createdAt: -1 });

const Question: Model<IQuestionSchema> =
  mongoose.models.Question ||
  mongoose.model<IQuestionSchema>("Question", QuestionSchema, "questions");

export default Question;
