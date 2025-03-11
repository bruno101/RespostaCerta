export default interface EvaluatedResponse {
    id: string
    questionTitle: string
    questionId: string
    evaluatedAt: string
    grade: number
    maxGrade: number
    student: {
      email: string
      name: string
      image?: string
    }
  }