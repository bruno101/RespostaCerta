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
  Numero: number;
  TextoMotivador: string;
  Questao: string;
  Criterios?: string;
  Resposta?: string;
  EmailCriador?: string;
  TextoPlano: string;
  Dificuldade?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  NotaMaxima?: string;
  Embedding?: number[];
  EmbeddingModel?: string;
  SubjectEmbedding?: number[];
  SubjectEmbeddingModel?: string;
  CargoEmbedding?: number[];
  CargoEmbeddingModel?: string;
  Modalidades?: string[];
  ModalidadeModel?: string;
}

const QuestionStageSchema = new Schema<IQuestionStageSchema>(
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
    Dificuldade: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: false,
    },
    NotaMaxima: { type: Number, required: false },
    Embedding: { type: [Number] },
    EmbeddingModel: { type: String },
    SubjectEmbedding: { type: [Number] },
    SubjectEmbeddingModel: { type: String },
    CargoEmbedding: { type: [Number] },
    CargoEmbeddingModel: { type: String },
    Modalidades: { type: [String] },
    ModalidadeModel: { type: String },
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
