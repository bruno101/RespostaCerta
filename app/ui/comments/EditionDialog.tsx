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

export default function EditionDialog({
  setComments,
  isReply,
  replyTo,
  hidePopover,
  commentId,
  initialText,
}: {
  setComments: Dispatch<SetStateAction<IComment[]>>;
  isReply: boolean;
  replyTo?: string;
  hidePopover: () => void;
  commentId: string;
  initialText: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(initialText);

  const updateReplyEditionOnUi = () => {
    setComments((comments) => {
      const newComments = [...comments];
      const commentIndex = newComments.findIndex(
        (comment) => comment._id === replyTo
      );

      const commentToChange = { ...newComments[commentIndex] };
      const newReplies = [...commentToChange.replies];
      const newReplyIndex = newReplies.findIndex(
        (repl) => repl._id === commentId
      );
      const newReply = { ...newReplies[newReplyIndex] };
      newReply.text = text;
      newReplies[newReplyIndex] = newReply;
      commentToChange.replies = newReplies;
      newComments[commentIndex] = commentToChange;

      return newComments;
    });
  };

  const updateCommentEditionOnUi = () => {
    setComments((comments) => {
      const newComments = [...comments];
      const index = newComments.findIndex((comm) => comm._id === commentId);
      const newComment = { ...newComments[index] };
      newComment.text = text;
      newComments[index] = newComment;
      return newComments;
    });
  };

  const onEdition = async () => {
    try {
      isReply ? updateReplyEditionOnUi() : updateCommentEditionOnUi();
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error editing comment:", error);
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
        <button className="flex hover:text-slate-600">
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>

          <p>Editar</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Editar comentário</DialogTitle>
          <DialogDescription>
            Clique em "confirmar" para salvar suas alterações.
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="mt-5 mb-5 h-[10em] bg-white border-1 rounded-lg"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
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
                onEdition();
                setOpen(false);
              }}
              className="mr-5 rounded-lg border-1 text-white bg-cyan-600 px-3 py-1"
            >
              Confirmar
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
