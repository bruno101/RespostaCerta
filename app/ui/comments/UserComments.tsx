import { Skeleton } from "@/components/ui/skeleton";
import EmptyUserComments from "./EmptyUserComments";
import CommentArea from "./CommentArea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserComment from "./UserComment";
import IComment from "@/app/interfaces/IComment";
import IUser from "@/app/interfaces/IUser";

export default function UserComments({
  comments,
  commentsLoading,
  setComments,
  currentUser,
}: {
  comments: IComment[];
  commentsLoading: boolean;
  setComments: Dispatch<SetStateAction<IComment[]>>;
  currentUser?: IUser;
}) {
  const [buttonActive, setButtonActive] = useState(1);
  const orderByLikes = buttonActive === 1;
  useEffect(() => {
    let sortedComments = [...comments];
    sortedComments.sort((a, b) => {
      return orderByLikes
        ? b.likes - a.likes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setComments(sortedComments);
  }, [orderByLikes]);
  return (
    <div className="w-full">
      {commentsLoading ? (
        <div className="flex items-center space-x-4 w-full">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 min-w-[250px] mr-10" />
            <Skeleton className="h-4 min-w-[200px] mr-10" />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-row">
            <button
              onClick={() => {
                setButtonActive(1);
              }}
              className={` mr-3 text-[15px] rounded-2xl border-1 py-1 px-4 hover:bg-blue-50 hover:border-cyan-200 ${
                buttonActive === 1
                  ? "text-cyan-700 bg-blue-50 border-cyan-500"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              Mais curtidos
            </button>
            <button
              onClick={() => {
                setButtonActive(2);
              }}
              className={` text-[15px] rounded-2xl border-1 py-1 px-4 hover:bg-blue-50 hover:border-cyan-200 ${
                buttonActive === 2
                  ? "text-cyan-700 bg-blue-50 border-cyan-500"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              Por data
            </button>
          </div>
          {comments.length === 0 ? (
            <EmptyUserComments />
          ) : (
            <div className="flex flex-col mt-10 mb-3">
              {comments.map((comment, index) => (
                <UserComment
                  key={index}
                  comment={comment}
                  setComments={setComments}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
          <CommentArea
            questionId={comments[0].question_id}
            setComments={setComments}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
}
