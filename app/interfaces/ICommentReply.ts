export default interface ICommentReply {
  text: string;
  email: string;
  name: string;
  question_id: string;
  createdAt: string;
  reply_to?: string;
  user_image_link?: string;
  _id: string;
}
