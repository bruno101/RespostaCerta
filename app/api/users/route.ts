import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let { name, email, image, signedUpWithGoogle } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      (image && typeof image !== "string") ||
      (signedUpWithGoogle && typeof signedUpWithGoogle !== "boolean")
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email and image should be strings; signedUpWithGoogle should be boolean",
        },
        { status: 400 }
      );
    }

    if (signedUpWithGoogle === null || signedUpWithGoogle === undefined)
      signedUpWithGoogle = true;

    const user = await User.findOne({ email });

    if (
      signedUpWithGoogle &&
      user &&
      (user.signedUpWithGoogle === false ||
        user.signedUpWithGoogle === undefined ||
        user.signedUpWithGoogle === null)
    ) {
      return NextResponse.json(
        {
          error:
            "Email already used by account not created with google",
        },
        { status: 409 }
      );
    }

    if (user) {
      return (new NextResponse() as any).json(null, { status: 204 });
    }

    const newUser = new User({
      name,
      email,
      signedUpWithGoogle,
      image: image ? image : null,
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
