import ICommentReply from "@/app/interfaces/ICommentReply";
import Image from "next/image";
import TruncatedText from "./TruncatedText";
import EditionAndDeletionPopover from "./EditionAndDeletionPopover";
import { Dispatch, SetStateAction } from "react";
import IComment from "@/app/interfaces/IComment";
import IUser from "@/app/interfaces/IUser";

export default function CommentReply({
  comment,
  setComments,
  currentUser,
}: {
  comment: ICommentReply;
  setComments: Dispatch<SetStateAction<IComment[]>>;
  currentUser?: IUser;
}) {
  const date = new Date(comment.createdAt);
  const isThisCurrentUserComment =
    currentUser?.email && comment.email === currentUser.email;

  return (
    <div className="ml-4  sm:ml-10 border-l-2  border-gray-100 pl-4 sm:pl-6">
      <div className="border-1 shadow-sm w-full my-5 rounded-xl bg-white">
        {/* User Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-5">
          <div className="flex items-center">
            <Image
              src={
                comment.user_image_link
                  ? comment.user_image_link
                  : "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
              }
              alt="Circle Image"
              width={48}
              height={48}
              className="object-cover w-6 h-6 rounded-full overflow-hidden"
            />
            <p className="font-bold ml-3 text-[13px] sm:text-[14px] text-gray-800">
              {isThisCurrentUserComment ? "Você" : comment.name}
            </p>
          </div>
          <p className="sm:ml-auto mt-2 sm:mt-0 text-[12px] sm:text-[13px] text-gray-800">
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

        {/* Comment Text */}
        <div className="px-1 sm:px-5 pb-4">
          <TruncatedText text={comment.text} small={true} />
        </div>

        {/* Edit/Delete Popover */}
        {isThisCurrentUserComment && (
          <div className="flex justify-end px-4 sm:px-5 pb-4">
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
  );
}
