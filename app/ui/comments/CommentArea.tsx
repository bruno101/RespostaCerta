import IComment from "@/app/interfaces/IComment";
import ICommentReply from "@/app/interfaces/ICommentReply";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

export default function CommentArea({
  replyTo,
  questionId,
  comments,
  setComments,
}: {
  replyTo?: string;
  questionId: string;
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[]>>;
}) {
  const [text, setText] = useState("");

  const addCommentToUi = (newComment: IComment) => {
    let newComments = [...comments];
    newComments.push(newComment);
    setComments(newComments);
  };

  const addCommentReplyToUi = (newComment: ICommentReply) => {
    let newComments = [...comments];
    let index = newComments
      .findIndex((comment) => {
        return comment._id === newComment.reply_to;
      })
    const c = {...newComments[index]};
    const replies = [...c.replies]
    replies.push(newComment);
    c.replies = replies;
    newComments[index] = c;
    setComments(newComments);
  };

  const addCommentOrReplyToUi = (newComment: IComment | ICommentReply) => {

    if (replyTo) {
      addCommentReplyToUi(newComment);
    } else {
      addCommentToUi({ ...newComment, likes: 0, didCurrentUserLike: false, replies: [] });
    }
  };

  const postComment = async () => {
    const newCommentData = {
      reply_to: replyTo,
      text
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
        <div
          className={`${
            replyTo
              ? "w-7 h-7 ml-[30px] mt-2 mr-5"
              : "w-10 h-10 ml-5 mt-5 mr-10"
          } rounded-full overflow-hidden`}
        >
          <Image
            src="https://avatar.iran.liara.run/public/boy?username=Ash"
            alt="Circle Image"
            width={replyTo ? 56 : 80}
            height={replyTo ? 56 : 80}
            className="object-cover"
          />
        </div>
        <textarea
          className={`${
            replyTo ? "h-[6em]" : "h-[10em]"
          } bg-white border-1 rounded-lg mr-auto w-full`}
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
