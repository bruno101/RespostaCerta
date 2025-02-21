import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";

export async function PATCH(request: Request, {
  params,
}: {
  params: { commentId: string };
}) {
  try {
    await connectToDatabase();
    const p = await params;
    const { commentId } = p;
    const email = "arianagrande@fakegmail.com";

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.usersWhoLiked.includes(email)) {
      comment.usersWhoLiked = comment.usersWhoLiked.filter((userEmail) => userEmail != email);
      await comment.save();
      return NextResponse.json(
        { message: "Comment disliked successfully", comment: comment },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: 204 }
      );
    }
  } catch (error) {
    console.error("Error disliking comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
