interface IExamQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  timeLimit: number;
  points: number;
}

export default async function generateExam(
  dificuldade: 1 | 2 | 3,
  numQuestions: 1 | 2 | 3 | 4 | 5,
  timePerQuestion: number,
  selectedTemas: string[],
  cargo: string,
  examType: string,
  similarQuestions: string[],
  questionsForSimilarCargos: string[]
): Promise<IExamQuestion[]> {
  //tbd
  return [];
}
