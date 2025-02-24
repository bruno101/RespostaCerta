export default interface IComment {
  text: string;
  email: string;
  name: string;
  user_image_link?: string;
  question_id: string ;
  likes: number;
  didCurrentUserLike: boolean;
  createdAt: string;
  _id: string;
  replies: {
    user_image_link?: string;
    text: string;
    email: string;
    name: string;
    question_id: string;
    createdAt: string;
    _id: string;
  }[];
}
