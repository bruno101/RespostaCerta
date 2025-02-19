import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";
import mongoose from "mongoose";
export async function GET(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { questionId } = params;

    if (!questionId) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 }
      );
    }
      
    const comments = await Comment.find({ question_id: questionId }).populate(
      "question_id"
    );
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
