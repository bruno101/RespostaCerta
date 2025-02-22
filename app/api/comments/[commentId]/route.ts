import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      commentId: string;
    };
  }
) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let { didCurrentUserLike, text } = body;

    if (didCurrentUserLike === undefined && !text) {
      return NextResponse.json(
        { error: "Empty or missing fields" },
        { status: 400 }
      );
    }

    const { commentId } = params;
    const email = "arianagrande@fakegmail.com";

    if (text) {
      if (typeof text != "string") {
        return NextResponse.json(
          { error: "text must be a string" },
          { status: 400 }
        );
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }

      if (comment.email !== email) {
        return NextResponse.json(
          { error: "You are not authorized to edit this comment." },
          { status: 403 }
        );
      }

      comment.text = text;
      comment.save();

      return NextResponse.json(
        { message: "Comment edited successfully", comment: comment },
        { status: 200 }
      );
    }

    if (typeof didCurrentUserLike != "boolean") {
      return NextResponse.json(
        { error: "like must be a bolean" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (didCurrentUserLike) {
      if (!comment.usersWhoLiked.includes(email)) {
        comment.usersWhoLiked.push(email);
        await comment.save();
        return NextResponse.json(
          { message: "Comment liked successfully", comment: comment },
          { status: 200 }
        );
      } else {
        return (new NextResponse() as any).json(null, { status: 204 });
      }
    }

    if (comment.usersWhoLiked.includes(email)) {
      comment.usersWhoLiked = comment.usersWhoLiked.filter(
        (userEmail) => userEmail != email
      );
      await comment.save();
      return NextResponse.json(
        { message: "Comment disliked successfully", comment: comment },
        { status: 200 }
      );
    } else {
      return (new NextResponse() as any).json(null, { status: 204 });
    }
  } catch (error) {
    console.error("Error disliking comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      commentId: string;
    };
  }
) {
  try {
    await connectToDatabase();
    const { commentId } = params;
    const email = "arianagrande@fakegmail.com";

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return (new NextResponse() as any).json(null, { status: 204 });
    }

    if (comment.email !== email) {
      return NextResponse.json(
        { error: "You are not authorized to delete this comment." },
        { status: 403 }
      );
    }

    await Comment.deleteMany({
      $or: [{ _id: commentId }, { reply_to: commentId }],
    });
    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );

    //FINISH
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
