import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    // Connect to the database
    await connectToDatabase();
    const p = await params;
    const { code } = p;

    if (!code) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({
      question_id: code,
      $or: [{ reply_to: null }, { reply_to: { $exists: false } }],
    })
      .populate("question_id")
      .lean();
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const newComment = { ...comment };
        const didCurrentUserLike = newComment.usersWhoLiked.includes(
          "arianagrande@fakegmail.com"
        );
        const likes = newComment.usersWhoLiked.length;
        delete (newComment as any).usersWhoLiked;
        const replies = await Comment.find({ reply_to: comment._id }).lean();
        return { ...newComment, replies, didCurrentUserLike, likes };
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

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    await connectToDatabase();
    const p = await params;
    const { code } = p;
    const body = await req.json();
    let { reply_to, text } = body;
    const name = "Ariana Grande";
    const email = "arianagrande@fakegmail.com";

    if (!code || !text) {
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
      usersWhoLiked: [],
      question_id: code,
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
