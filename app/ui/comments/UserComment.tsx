import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import CommentReply from "./CommentReply";
import CommentArea from "./CommentArea";
import IComment from "@/app/interfaces/IComment";

export default function UserComment({
  comment,
  comments,
  setComments,
}: {
  comment: IComment;
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[]>>;
}) {
  const date = new Date(comment.createdAt);
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);
  const onClickLike = () => {
    setLiked((x) => !x);
  };
  return (
    <div>
      <div className="mt-5 mb-5 shadow-md border-1 w-full rounded-xl bg-white">
        <div className="flex flex-row">
          <div className="w-8 h-8 rounded-full overflow-hidden mt-5 ml-5 mr-4">
            <Image
              src="https://avatar.iran.liara.run/public/boy?username=Ash"
              alt="Circle Image"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <p className="font-bold mt-6 mr-3 text-[15px] text-gray-800">
            {comment.name}
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
              (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}
          </p>
        </div>
        <div className="mt-10 ml-5 text-[15px] mb-7">{comment.text}</div>
        <div className="flex border-t">
          <button
            className={`flex ml-5 rounded-2xl border-1 mt-3 mb-3 pl-3 pr-3 pt-[2px] pb-[1px] ${
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
            className={`flex ml-5 mr-5 mt-3 mb-3 pl-3 pt-[5px] pr-4 ${
              showReplies && "bg-gray-100 rounded-2xl"
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
        </div>
      </div>
      {showReplies && (
        <div>
          {comment.replies.map((comm, index) => (
            <CommentReply key={index} comment={comm} />
          ))}
          <div className="ml-10">
            <CommentArea
              replyTo={comment._id}
              questionId={comment.question_id}
              setComments={setComments}
              comments={comments}
            />
          </div>
        </div>
      )}
    </div>
  );
}
