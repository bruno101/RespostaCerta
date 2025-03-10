import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify"

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      commentId: string;
    }>;
  }
) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let { didCurrentUserLike, text } = body;


    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (didCurrentUserLike === undefined && !text) {
      return NextResponse.json(
        { error: "Empty or missing fields" },
        { status: 400 }
      );
    }

    const { commentId } = await params;
    const email = session?.user?.email || "";

    if (text) {
      if (typeof text != "string") {
        return NextResponse.json(
          { error: "text must be a string" },
          { status: 400 }
        );
      }

      const sanitizedText = DOMPurify.sanitize(text, sanitizationSettings);

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

      comment.text = sanitizedText;
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
    params: Promise<{
      commentId: string;
    }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    await connectToDatabase();
    const { commentId } = await params;
    const email = session?.user?.email;

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
