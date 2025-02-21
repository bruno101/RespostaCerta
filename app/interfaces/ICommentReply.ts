export default interface ICommentReply {
  text: string;
  email: string;
  name: string;
  question_id: string;
  likes: number;
  createdAt: string;
  reply_to?: string;
  _id: string;
}
