import Comment from "@/app/models/Comment";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let { question_id, reply_to, text, likes } = body;
    const name = "Ariana Grande";
    const email = "arianagrande@fakegmail.com";

    if (!question_id || !text || likes === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newComment = new Comment({
      name,
      email,
      reply_to: reply_to || null,
      text,
      likes,
      question_id,
    });

    await newComment.save();

    return NextResponse.json(
      { message: "Comment created successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
