import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let { name, email, image_link } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      (image_link && typeof image_link !== "string")
    ) {
      return NextResponse.json(
        { error: "Name, email and image_url should be strings" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      return (new NextResponse() as any).json(null, { status: 204 }); 
    }

    const newUser = new User({
      name,
      email,
      image_link: image_link ? image_link : null,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
