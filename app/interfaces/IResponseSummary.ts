export default interface IResponseSummary {
  id: string;
  questionTitle: string;
  status: "pending" | "graded" | "rejected";
  grade?: number;
  createdAt: Date;
  questionId: string;
  maxGrade: number;
  evaluator?: {
    email: string;
    name: string;
    image?: string;
  }
}
