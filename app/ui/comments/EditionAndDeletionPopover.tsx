import IComment from "@/app/interfaces/IComment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useState } from "react";
import DeletionDialog from "./DeletionDialog";
import EditionDialog from "./EditionDialog";

export default function EditionAndDeletionPopover({
  setComments,
  isReply,
  replyTo,
  commentId,
  text
}: {
  setComments: Dispatch<SetStateAction<IComment[]>>;
  isReply: boolean;
  replyTo?: string;
  commentId: string;
  text: string
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`flex hover:bg-blue-200 hover:text-cyan-700 ${
            open && "bg-blue-200 text-cyan-700"
          } rounded-2xl px-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] py-[17px] px-[10px] mr-[90px]">
      <EditionDialog 
          setComments={setComments}
          isReply={isReply}
          replyTo={replyTo}
          hidePopover={() => setOpen(false)}
          commentId={commentId}
          initialText={text}
        />
        <DeletionDialog
          setComments={setComments}
          isReply={isReply}
          replyTo={replyTo}
          hidePopover={() => setOpen(false)}
          commentId={commentId}
        />
      </PopoverContent>
    </Popover>
  );
}
