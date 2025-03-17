import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IResponse extends Document {
  content: string
  status: "pending" | "graded" | "rejected"
  createdAt: Date
  updatedAt: Date
  user: string
  question: mongoose.Types.ObjectId
  feedback?: mongoose.Types.ObjectId
}

const ResponseSchema = new Schema<IResponse>(
  {
    content: {
      type: String,
      required: [true, "O conteúdo da resposta é obrigatório"],
    },
    status: {
      type: String,
      enum: ["pending", "graded", "rejected"],
      default: "pending",
    },
    user: {
      type: String,
      required: [true, "O usuário é obrigatório"],
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "A questão é obrigatória"],
    },
    feedback: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model already exists to prevent overwriting
const Response: Model<IResponse> = mongoose.models.Response || mongoose.model<IResponse>("Response", ResponseSchema, "responses")

export default Response
