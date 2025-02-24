import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import CommentReply from "./CommentReply";
import CommentArea from "./CommentArea";
import IComment from "@/app/interfaces/IComment";
import EditionAndDeletionPopover from "./EditionAndDeletionPopover";
import TruncatedText from "./TruncatedText";
import IUser from "@/app/interfaces/IUser";

export default function UserComment({
  comment,
  setComments,
  currentUser,
}: {
  comment: IComment;
  setComments: Dispatch<SetStateAction<IComment[]>>;
  currentUser?: IUser;
}) {
  const [showReplies, setShowReplies] = useState(false);

  const isThisCurrentUserComment =
    currentUser?.email && comment.email === currentUser.email;
  const date = new Date(comment.createdAt);
  const liked = comment.didCurrentUserLike;
  const updateLikesOnUi = () => {
    setComments((c) => {
      let newComments = [...c];
      let index = newComments.findIndex((comm) => {
        return comm._id === comment._id;
      });
      const newComment = { ...newComments[index] };
      if (newComment.didCurrentUserLike) {
        newComment.didCurrentUserLike = false;
        newComment.likes -= 1;
      } else {
        newComment.didCurrentUserLike = true;
        newComment.likes += 1;
      }
      newComments[index] = newComment;
      return newComments;
    });
  };

  const onClickLike = async () => {
    try {
      updateLikesOnUi();
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          didCurrentUserLike: !comment.didCurrentUserLike,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  return (
    <div>
      <div className="mt-5 mb-5 shadow-md border-1 w-full rounded-xl bg-white">
        <div className="flex flex-row">
          <Image
            src={
              comment.user_image_link
                ? comment.user_image_link
                : "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
            }
            alt="Circle Image"
            width={64}
            height={64}
            className="object-cover w-8 h-8 rounded-full overflow-hidden mt-5 ml-5 mr-4"
          />
          <p className="font-bold mt-6 mr-3 text-[15px] text-gray-800">
            {isThisCurrentUserComment ? "Você" : comment.name}
          </p>
          <p className="ml-auto mr-5 mt-5 text-[13px] text-gray-800">
            {date.getDate() +
              "/" +
              date.getMonth() +
              "/" +
              date.getFullYear() +
              " às " +
              date.getHours() +
              ":" +
              (date.getMinutes() < 10 ? "0" : "") +
              date.getMinutes()}
          </p>
        </div>
        <TruncatedText text={comment.text} small={false} />
        <div className="flex border-t mt-7">
          <button
            className={`flex ml-5 hover:bg-blue-100 hover:text-cyan-700 rounded-2xl border-1 mt-3 mb-3 pl-3 pr-3 pt-[2px] pb-[1px] ${
              liked ? "bg-blue-200 text-cyan-700" : "text-gray-700"
            }`}
            onClick={onClickLike}
          >
            <Image
              src={`${
                liked
                  ? "https://img.icons8.com/?size=100&id=33479&format=png&color=22C3E6"
                  : "https://img.icons8.com/?size=100&id=24816&format=png&color=000000"
              }`}
              width={20}
              height={20}
              alt="responder"
            ></Image>
            <p className="text-[13px] mt-[2px] ml-1 font-bold">
              {comment.likes}
            </p>
          </button>
          <button
            className={`flex hover:bg-gray-100 rounded-2xl ml-5 mr-5 mt-3 mb-3 pl-3 pt-[5px] pr-4 ${
              showReplies && "bg-gray-100"
            }`}
            onClick={() => {
              setShowReplies((x) => !x);
            }}
          >
            <Image
              src={`${
                showReplies
                  ? "https://img.icons8.com/?size=100&id=7806&format=png&color=737373"
                  : "https://img.icons8.com/?size=100&id=2889&format=png&color=111111"
              }`}
              width={16}
              height={16}
              alt="responder"
            ></Image>
            <p className="ml-2 mb-[5px] text-[13px] text-gray-700 font-bold">
              {comment.replies.length}
            </p>
          </button>
          {isThisCurrentUserComment && (
            <div className="ml-auto mr-10 mt-[15px]">
              <EditionAndDeletionPopover
                setComments={setComments}
                isReply={false}
                commentId={comment._id}
                text={comment.text}
              />
            </div>
          )}
        </div>
      </div>
      {showReplies && (
        <div>
          {comment.replies.map((comm, index) => (
            <CommentReply
              key={index}
              comment={comm}
              setComments={setComments}
              currentUser={currentUser}
            />
          ))}
          <div className="ml-10">
            <CommentArea
              replyTo={comment._id}
              questionId={comment.question_id}
              setComments={setComments}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
