import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/app/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Connect to the database
    const session = await getServerSession(authOptions);
    await connectToDatabase();
    const p = await params;
    const { code } = p;

    if (!code) {
      return NextResponse.json(
        { error: "question_id is required" },
        { status: 400 }
      );
    }

    /*const comments = await Comment.find({
      question_id: code,
      $or: [{ reply_to: null }, { reply_to: { $exists: false } }],
    }).lean();*/
    const commentsWithUserData = await Comment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "user",
        },
      },
    ]);
    const commentsWithExtraData = await Promise.all(
      commentsWithUserData
        .filter((comment) => !comment.reply_to)
        .map(async (comment) => {
          const newComment = { ...comment };
          const didCurrentUserLike = newComment.usersWhoLiked.includes(
            session?.user?.email || ""
          );
          const likes = newComment.usersWhoLiked.length;
          const user_image_link = newComment.user[0]?.image;
          delete (newComment as any).usersWhoLiked;
          delete (newComment as any).user;
          const replies = await Comment.find({ reply_to: comment._id }).lean();
          return {
            ...newComment,
            replies,
            didCurrentUserLike,
            likes,
            user_image_link,
          };
        })
    );
    return NextResponse.json(commentsWithExtraData);
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
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    await connectToDatabase();
    const p = await params;
    const { code } = p;
    const body = await req.json();
    let { reply_to, text } = body;
    const name = session?.user?.name;
    const email = session?.user?.email;

    if (!code || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof code !== "string" || typeof text != "string") {
      return NextResponse.json(
        { error: "Code and text should be strings" },
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
      {
        message: "Comment created successfully",
        comment: {
          ...(newComment as any)._doc,
          user_image_link: session?.user?.image,
        },
      },
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
