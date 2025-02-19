import { Skeleton } from "@/components/ui/skeleton";
import EmptyUserComments from "./EmptyUserComments";
import CommentArea from "./CommentArea";
import { useState } from "react";
import UserComment from "./UserComment";

export default function UserComments({
  comments,
  commentsLoading,
}: {
  comments: {
    text: string;
    email: string;
    name: string;
    question_id: string;
    likes: Number;
    createdAt: Number;
  }[];
  commentsLoading: boolean;
}) {
  const [buttonActive, setButtonActive] = useState(0);
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
              className={`bg-white text-gray-800 text-[15px] mr-3 rounded-2xl border-1 border-gray-300 py-1 px-4 hover:bg-blue-50 hover:border-cyan-200 ${
                buttonActive === 1 && "text-cyan-700 bg-blue-50 border-cyan-500"
              }`}
            >
              Mais curtidos
            </button>
            <button
              onClick={() => {
                setButtonActive(2);
              }}
              className={`bg-white text-gray-800 text-[15px] rounded-2xl border-1 border-gray-300 py-1 px-4 hover:bg-blue-50 hover:border-cyan-200 ${
                buttonActive === 2 && "text-cyan-700 bg-blue-50 border-cyan-500"
              }`}
            >
              Por data
            </button>
          </div>
          {comments.length === 0 ? (
            <EmptyUserComments />
          ) : (
            <div className="flex flex-col mt-10 mb-10">
              {comments.map((comment, index) => (
                <UserComment key={index} comment={comment} />
              ))}
            </div>
          )}
          <CommentArea />
        </div>
      )}
    </div>
  );
}
