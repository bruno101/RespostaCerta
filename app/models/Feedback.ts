import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IFeedback extends Document {
  grade: number
  comment: string
  createdAt: Date
  updatedAt: Date
  response: mongoose.Types.ObjectId
  evaluatedBy: string
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    grade: {
      type: Number,
      required: [true, "A nota é obrigatória"],
      min: 0,
    },
    comment: {
      type: String,
      required: [true, "O comentário é obrigatório"],
    },
    response: {
      type: Schema.Types.ObjectId,
      ref: "Response",
      required: [true, "A resposta é obrigatória"],
    },
    evaluatedBy: {
      type: String,
      required: [true, "O avaliador é obrigatório"],
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model already exists to prevent overwriting
const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema, "feedbacks")

export default Feedback