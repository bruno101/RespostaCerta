export default interface IEvaluatedResponse {
    id: string
    questionTitle: string
    questionId: string
    evaluatedAt: string
    grade: number
    maxGrade: number
    subject: string
    student: {
      email: string
      name: string
      image?: string
    }
  }