import IComment from "@/app/interfaces/IComment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function DeletionDialog({
  setComments,
  isReply,
  replyTo,
  hidePopover,
  commentId,
}: {
  setComments: Dispatch<SetStateAction<IComment[]>>;
  isReply: boolean;
  replyTo?: string;
  hidePopover: () => void;
  commentId: string;
}) {
  const [open, setOpen] = useState(false);

  const updateReplyDeletionOnUi = () => {
    setComments((comments) => {
      const newComments = [...comments];
      const commentIndex = newComments.findIndex(
        (comment) => comment._id === replyTo
      );

      const commentToChange = { ...newComments[commentIndex] };
      const newReplies = [...commentToChange.replies];
      commentToChange.replies = newReplies.filter(
        (reply) => reply._id != commentId
      );
      newComments[commentIndex] = commentToChange;
      return newComments;
    });
  };

  const updateCommentDeletionOnUi = () => {
    setComments((comments) => {
      const newComments = [...comments];
      return newComments.filter((comment) => comment._id !== commentId);
    });
  };

  const onDeletion = async () => {
    try {
      isReply ? updateReplyDeletionOnUi() : updateCommentDeletionOnUi();
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        open && hidePopover();
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <button className="text-red-600 flex mt-3 hover:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 mr-2 mt-[2px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>

          <p>Deletar</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deletar comentário</DialogTitle>
          <DialogDescription>
            Clique em "deletar" se realmente deseja remover o comentário
            selecionado.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex">
            <button
              onClick={() => {
                hidePopover();
                setOpen(false);
              }}
              className="ml-auto mr-3 rounded-lg border-1 text-slate-700 px-3 py-1"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                hidePopover();
                onDeletion();
                setOpen(false);
              }}
              className="mr-5 rounded-lg border-1 text-white bg-red-600 px-3 py-1"
            >
              Deletar
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
