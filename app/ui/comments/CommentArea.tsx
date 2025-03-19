import IComment from "@/app/interfaces/IComment";
import ICommentReply from "@/app/interfaces/ICommentReply";
import IUser from "@/app/interfaces/IUser";
import CustomButton from "@/components/ui/custom-button";
import { CornerDownRight } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

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
  const [content, setContent] = useState(""); // State for rich text content

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
      text: content, // Use the rich text content
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
      setContent(""); // Clear the rich text content
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className={`w-full flex flex-col ${!replyTo && "mt-[60px]"}`}>
      {/* Visual Indicator for Replies */}
      {replyTo && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <CornerDownRight className="w-4 h-4 mr-2" />
          Respondendo ao comentário...
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start">
        {/* Profile Picture */}
        <div className="flex items-center sm:items-start mb-4 sm:mb-0">
          <Image
            src={
              currentUser?.image
                ? currentUser.image
                : "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
            }
            alt="Circle Image"
            width={replyTo ? 48 : 64}
            height={replyTo ? 48 : 64}
            className={`object-cover ${
              replyTo ? "w-6 h-6 sm:w-7 sm:h-7" : "w-8 h-8 sm:w-9 sm:h-9"
            } rounded-full overflow-hidden ml-4 sm:ml-5 mt-2 sm:mt-0 mr-4 sm:mr-5`}
          />
        </div>

        {/* RichTextEditor */}
        <div className="flex-1">
          <RichTextEditor
            content={content}
            onChange={(newContent) => setContent(newContent)}
            placeholder={
              replyTo ? "Escreva sua resposta..." : "Escreva um comentário..."
            }
            className="bg-white shadow-md border-1 rounded-lg p-4 min-h-[8em] sm:min-h-[6em] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <CustomButton
        onClick={postComment}
        bgColor="cyan"
        className={`${
          replyTo ? "mt-3 px-3 py-1 text-[14px]" : "mt-5 px-4 py-2"
        } ml-auto mr-4 sm:mr-5 mb-10 text-sm`}
      >
        <CornerDownRight className={`w-4 h-4 ${replyTo ? "mr-1" : "mr-2"}`} />
        {replyTo ? "Responder" : "Comentar"}
      </CustomButton>
    </div>
  );
}
