export default interface ICommentReply {
  text: string;
  email: string;
  name: string;
  question_id: string;
  createdAt: string;
  reply_to?: string;
  _id: string;
}
