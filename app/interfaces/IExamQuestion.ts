export default interface IExamQuestion {
  id: number;
  question: string; // HTML string
  correctAnswer: string; // HTML string
  timeLimit: number; // Time limit in seconds for this question
  points: number; // Points this question is worth
  userResponse?: string;
  grade?: number;
  comment?: string;
}
