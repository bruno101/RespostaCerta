import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";

export async function GET(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();
    const p = await params;
    const { questionId } = p;

    if (!questionId) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({
      question_id: questionId,
      $or: [{ reply_to: null }, { reply_to: { $exists: false } }],
    })
      .populate("question_id")
      .lean();
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ reply_to: comment._id }).lean();
        return { ...comment, replies };
      })
    );
    return NextResponse.json(commentsWithReplies);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}