import IExamQuestion from "./IExamQuestion";

export default interface ISimulado {
  id: string;
  title: string;
  disciplina: string[]; // Array of disciplines
  cargo: string; // Job role
  concurso: string; // Exam name
  questions: IExamQuestion[];
  completed: boolean;
}
