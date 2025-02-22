import ICommentReply from "@/app/interfaces/ICommentReply";
import Image from "next/image";
import TruncatedText from "./TruncatedText";
import EditionAndDeletionPopover from "./EditionAndDeletionPopover";
import { Dispatch, SetStateAction } from "react";
import IComment from "@/app/interfaces/IComment";

export default function CommentReply({
  comment,
  setComments,
}: {
  comment: ICommentReply;
  setComments: Dispatch<SetStateAction<IComment[]>>;
}) {
  const date = new Date(comment.createdAt);
  const isThisCurrentUserComment =
    comment.email === "arianagrande@fakegmail.com";
  return (
    <div className="ml-20">
      <div className="mt-5 mb-5 shadow-sm border-1 w-full rounded-xl bg-white">
        <div className="flex flex-row">
          <div className="w-6 h-6 rounded-full overflow-hidden mt-5 ml-5 mr-2">
            <Image
              src="https://avatar.iran.liara.run/public/boy?username=Ash"
              alt="Circle Image"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <p className="font-bold mt-6 mr-2 text-[13px] text-gray-800">
            {isThisCurrentUserComment ? "Você" : comment.name}
          </p>
          <p className="ml-auto mr-5 mt-5 text-[12px] text-gray-800">
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
        <div className="mb-5 flex flex-col">
          <div className="ml-0 mr-auto">
            <TruncatedText text={comment.text} small={true} />
          </div>
          {isThisCurrentUserComment && (
            <div className="ml-auto mr-5 mt-3">
              <EditionAndDeletionPopover
                commentId={comment._id}
                setComments={setComments}
                isReply={true}
                replyTo={comment.reply_to}
                text={comment.text}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
