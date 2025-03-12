import Feedback from "./IFeedback";

export default interface IResponseDetails {
    id: string;
    content: string;
    status: string;
    createdAt: string;
    question: {
      id: string;
      title: string;
      content: string;
      banca?: string;
      ano?: string;
      instituicao?: string;
      cargo?: string;
      questao?: string;
      maxGrade: number
    };
    student: {
      name: string;
      email: string;
      image?: string;
    };
    feedback?: Feedback;
  }
  