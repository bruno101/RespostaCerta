export default interface PendingResponse {
    id: string
    questionTitle: string
    questionId: string
    createdAt: string
    student: {
      email: string
      name: string
      image?: string
    }
  }