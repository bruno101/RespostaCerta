export default interface IPendingResponse {
    id: string
    questionTitle: string
    questionId: string
    createdAt: string
    subject: string
    maxGrade: number
    student: {
      email: string
      name: string
      image?: string
    }
  }