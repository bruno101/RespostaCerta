export default interface IFeedback {
  grade: number;
  comment: string;
  createdAt: string;
  evaluatedBy: {
    email: string;
    name: string;
    image?: string;
  };
}
