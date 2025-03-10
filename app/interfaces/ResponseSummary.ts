export default interface ResponseSummary {
    id: string;
    questionTitle: string;
    status: "pending" | "graded" | "rejected";
    grade?: number;
    createdAt: Date;
    questionId: string;
  }