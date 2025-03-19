import IQuestion from "./IQuestion";

export default interface INotebook {
  questions: IQuestion[];
  title: string;
  currentQuestion: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  numberOfQuestions: number;
  subjects: string[];
  bancas: string[];
}
