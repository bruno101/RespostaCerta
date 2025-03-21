import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import accountActivation from "@/utils/emails/account-activation";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { name, email, password } = await request.json();

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user && user.verified === true) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = Date.now() + 3600000; // 1 hour from now

    if (!user) {
      user = new User({
        name,
        email,
        password: hashedPassword,
        verified: false,
        verifyToken,
        verifyTokenExpiry,
      });
    } else {
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.verified = false;
      user.verifyToken = verifyToken;
      user.verifyTokenExpiry = verifyTokenExpiry;
    }

    const savedUser = await user.save();

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-account?token=${verifyToken}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Ativação de Conta - Resposta Certa",
      html: accountActivation(verifyUrl),
    });

    return NextResponse.json(
      {
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();

    const { userId, name, email, password } = await request.json();

    if (password && password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (name) {
      userToUpdate.name = name;
    }

    if (email) {
      userToUpdate.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      userToUpdate.password = hashedPassword;
    }

    await userToUpdate.save();

    return NextResponse.json(
      {
        message: "User updated successfully",
        updatedUser: {
          id: userToUpdate._id,
          name: userToUpdate.name,
          email: userToUpdate.email,
          createdAt: userToUpdate.createdAt,
          updatedAt: userToUpdate.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during user update:", error);
      return NextResponse.error();
    }
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const { userId } = await request.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await (user as any).remove();

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user/cart item deletion:", error);
    return NextResponse.error();
  }
}
