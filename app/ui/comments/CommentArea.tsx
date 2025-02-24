import IComment from "@/app/interfaces/IComment";
import ICommentReply from "@/app/interfaces/ICommentReply";
import IUser from "@/app/interfaces/IUser";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

export default function CommentArea({
  replyTo,
  questionId,
  setComments,
  currentUser,
}: {
  replyTo?: string;
  questionId: string;
  setComments: Dispatch<SetStateAction<IComment[]>>;
  currentUser?: IUser;
}) {
  const [text, setText] = useState("");

  const addCommentToUi = (newComment: IComment) => {
    setComments((comments) => {
      let newComments = [...comments];
      newComments.push(newComment);
      return newComments;
    });
  };

  const addCommentReplyToUi = (newComment: ICommentReply) => {
    setComments((comments) => {
      let newComments = [...comments];
      let index = newComments.findIndex((comment) => {
        return comment._id === newComment.reply_to;
      });
      const c = { ...newComments[index] };
      const replies = [...c.replies];
      replies.push(newComment);
      c.replies = replies;
      newComments[index] = c;
      return newComments;
    });
  };

  const addCommentOrReplyToUi = (newComment: IComment | ICommentReply) => {
    if (replyTo) {
      addCommentReplyToUi(newComment);
    } else {
      addCommentToUi({
        ...newComment,
        likes: 0,
        didCurrentUserLike: false,
        replies: [],
      });
    }
  };

  const postComment = async () => {
    const newCommentData = {
      reply_to: replyTo,
      text,
    };
    try {
      const response = await fetch(`/api/questions/${questionId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommentData),
      });

      const data = await response.json();
      data.comment && addCommentOrReplyToUi(data.comment);
      setText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className={`w-full flex flex-col ${!replyTo && "mt-[60px]"}`}>
      <div className="flex">
        <Image
          src={
            currentUser?.image
              ? currentUser.image
              : "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
          }
          alt="Circle Image"
          width={replyTo ? 56 : 120}
          height={replyTo ? 56 : 120}
          className={`object-cover ${
            replyTo ? "w-7 h-7 ml-[30px] mt-2 mr-5" : "w-9 h-9 ml-5 mt-5 mr-10"
          } rounded-full overflow-hidden`}
        />
        <textarea
          className={`${
            replyTo ? "h-[6em]" : "h-[10em]"
          } bg-white border-1 rounded-lg mr-auto w-full px-1`}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
      <button
        onClick={postComment}
        className={`${
          replyTo ? "mt-3 px-3 py-1 text-[14px]" : "mt-5 px-4 py-2"
        } ml-auto mr-5 mb-10 text-sm text-white bg-cyan-700 font-bold rounded-lg hover:bg-cyan-600 focus:outline focus:outline-5 focus:outline-cyan-200 focus:outline-offset-2`}
      >
        Responder
      </button>
    </div>
  );
}
